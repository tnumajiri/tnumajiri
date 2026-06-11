'use strict';
/* Headless renderer: implements a minimal software canvas 2D context,
 * runs the game, and writes PNG screenshots to test/shots/.
 * Run: node test/render.js
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// ----------------------------------------------------------- soft canvas --
const colorCache = {};
function parseColor(s) {
  if (colorCache[s]) return colorCache[s];
  let c;
  if (s[0] === '#') {
    if (s.length === 7) c = [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16), 255];
    else c = [parseInt(s[1] + s[1], 16), parseInt(s[2] + s[2], 16), parseInt(s[3] + s[3], 16), 255];
  } else {
    const m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/.exec(s);
    c = m ? [+m[1], +m[2], +m[3], m[4] === undefined ? 255 : Math.round(+m[4] * 255)] : [0, 0, 0, 255];
  }
  colorCache[s] = c;
  return c;
}
class SoftCtx {
  constructor(cv) {
    this.canvas = cv;
    this.fillStyle = '#000000';
    this.strokeStyle = '#000000';
    this.imageSmoothingEnabled = false;
    this.m = { a: 1, d: 1, e: 0, f: 0 };
    this.stack = [];
  }
  _buf() {
    const cv = this.canvas;
    if (!cv._data || cv._w !== cv.width || cv._h !== cv.height) {
      cv._data = new Uint8ClampedArray(cv.width * cv.height * 4);
      cv._w = cv.width; cv._h = cv.height;
    }
    return cv._data;
  }
  save() { this.stack.push({ ...this.m }); }
  restore() { const m = this.stack.pop(); if (m) this.m = m; }
  translate(x, y) { this.m.e += this.m.a * x; this.m.f += this.m.d * y; }
  scale(sx, sy) { this.m.a *= sx; this.m.d *= sy; }
  beginPath() {} rect() {} clip() {}
  _px(buf, x, y, r, g, b, a) {
    const cv = this.canvas;
    if (x < 0 || y < 0 || x >= cv.width || y >= cv.height || a === 0) return;
    const i = (y * cv.width + x) * 4;
    if (a === 255) {
      buf[i] = r; buf[i + 1] = g; buf[i + 2] = b; buf[i + 3] = 255;
    } else {
      const ia = a / 255, na = 1 - ia;
      buf[i] = r * ia + buf[i] * na;
      buf[i + 1] = g * ia + buf[i + 1] * na;
      buf[i + 2] = b * ia + buf[i + 2] * na;
      buf[i + 3] = Math.max(buf[i + 3], a);
    }
  }
  fillRect(x, y, w, h) {
    const [r, g, b, a] = parseColor(this.fillStyle);
    const buf = this._buf();
    let x0 = this.m.a * x + this.m.e, y0 = this.m.d * y + this.m.f;
    let x1 = this.m.a * (x + w) + this.m.e, y1 = this.m.d * (y + h) + this.m.f;
    if (x1 < x0) [x0, x1] = [x1, x0];
    if (y1 < y0) [y0, y1] = [y1, y0];
    for (let py = Math.floor(y0); py < Math.ceil(y1) - 0; py++)
      for (let px = Math.floor(x0); px < Math.ceil(x1) - 0; px++)
        this._px(buf, px, py, r, g, b, a);
  }
  drawImage(img, ...args) {
    let sx = 0, sy = 0, sw = img.width, sh = img.height, dx, dy, dw, dh;
    if (args.length === 2) { [dx, dy] = args; dw = sw; dh = sh; }
    else if (args.length === 4) { [dx, dy, dw, dh] = args; }
    else { [sx, sy, sw, sh, dx, dy, dw, dh] = args; }
    const src = img._data;
    if (!src) return;
    const buf = this._buf();
    let tx0 = this.m.a * dx + this.m.e, ty0 = this.m.d * dy + this.m.f;
    let tx1 = this.m.a * (dx + dw) + this.m.e, ty1 = this.m.d * (dy + dh) + this.m.f;
    const fx = tx1 < tx0, fy = ty1 < ty0;
    if (fx) [tx0, tx1] = [tx1, tx0];
    if (fy) [ty0, ty1] = [ty1, ty0];
    const W = tx1 - tx0, H = ty1 - ty0;
    if (W <= 0 || H <= 0) return;
    for (let py = Math.floor(ty0); py < Math.ceil(ty1); py++) {
      for (let px = Math.floor(tx0); px < Math.ceil(tx1); px++) {
        let u = (px + 0.5 - tx0) / W, v = (py + 0.5 - ty0) / H;
        if (u < 0 || u >= 1 || v < 0 || v >= 1) continue;
        if (fx) u = 1 - u;
        if (fy) v = 1 - v;
        const sxx = sx + Math.floor(u * sw), syy = sy + Math.floor(v * sh);
        if (sxx < 0 || syy < 0 || sxx >= img.width || syy >= img.height) continue;
        const si = (syy * img.width + sxx) * 4;
        this._px(buf, px, py, src[si], src[si + 1], src[si + 2], src[si + 3]);
      }
    }
  }
}
function makeCanvas(w, h) {
  const cv = { width: w || 0, height: h || 0, style: {} };
  cv.getContext = () => (cv._ctx || (cv._ctx = new SoftCtx(cv)));
  return cv;
}

// ------------------------------------------------------------ png writer --
function crc32(buf) {
  let c, table = crc32.table;
  if (!table) {
    table = crc32.table = [];
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c >>> 0;
    }
  }
  c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
function writePNG(cv, file) {
  const { width: w, height: h, _data: d } = cv;
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;
    for (let x = 0; x < w * 4; x++) raw[y * (w * 4 + 1) + 1 + x] = d[y * w * 4 + x];
  }
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0))
  ]);
  fs.writeFileSync(file, png);
  console.log('wrote', file, `(${w}x${h})`);
}

// -------------------------------------------------------------- DOM stubs --
const listeners = { keydown: [], keyup: [] };
let rafCb = null;
const mainCanvas = makeCanvas(256, 240);

global.window = global;
global.addEventListener = (ev, fn) => { (listeners[ev] = listeners[ev] || []).push(fn); };
global.requestAnimationFrame = cb => { rafCb = cb; return 0; };
global.AudioContext = undefined; // audio off in headless render
global.document = {
  getElementById: () => mainCanvas,
  createElement: () => makeCanvas()
};

require('../game.js');
const dbg = global.__debug;

function key(code, down) {
  const ev = { code, preventDefault() {} };
  for (const fn of listeners[down ? 'keydown' : 'keyup']) fn(ev);
}
let t = 0;
function frames(n) {
  for (let i = 0; i < n; i++) { t += 1000 / 60; rafCb(t); }
}

const dir = path.join(__dirname, 'shots');
fs.mkdirSync(dir, { recursive: true });

// 1. title screen
frames(20);
writePNG(mainCanvas, path.join(dir, '1_title.png'));

// photo helper: keep the player invulnerable between shots, but make sure
// the invuln flicker leaves the player visible on the captured frame
function photo(file) {
  dbg.player.invuln = 6;
  frames(1);
  writePNG(mainCanvas, path.join(dir, file));
  dbg.player.invuln = 10000;
}

// 2. level start
key('Enter', true); frames(2); key('Enter', false);
frames(125);
dbg.player.invuln = 10000;
key('ArrowRight', true);
frames(120);
photo('2_blocks.png');

// 3. jump pose near pipes
key('KeyZ', true); frames(11);
photo('3_jump.png');
key('KeyZ', false);
key('ArrowRight', false);

// 4. mid level (koopa & q-block row)
dbg.player.x = 104 * 16; dbg.player.y = 10 * 16;
frames(30);
photo('4_mid.png');

// 5. flag & castle
dbg.player.x = 192 * 16; dbg.player.y = 10 * 16;
frames(20);
photo('5_flag.png');

console.log('RENDER OK, state:', dbg.game.state);

// 6. sprite sheet (3x zoom) for art inspection
{
  const sheet = makeCanvas(256, 160);
  const g = sheet.getContext();
  g.fillStyle = '#5c94fc';
  g.fillRect(0, 0, 256, 160);
  const D = global.__debug.sprites;
  let x = 8;
  for (const img of D.heroSmall) { g.drawImage(img, 0, 0, 16, 16, x, 8, 48, 48); x += 56; }
  x = 8;
  for (const img of D.heroBig) { g.drawImage(img, 0, 0, 16, 32, x, 60, 32, 64); x += 40; }
  g.drawImage(D.goomba, 0, 0, 16, 16, 170, 60, 32, 32);
  g.drawImage(D.koopa, 0, 0, 16, 21, 206, 50, 32, 42);
  g.drawImage(D.shell, 0, 0, 16, 12, 170, 100, 32, 24);
  g.drawImage(D.mushroom, 0, 0, 16, 16, 206, 100, 32, 32);
  g.drawImage(D.flower, 0, 0, 16, 16, 8, 126, 32, 32);
  writePNG(sheet, path.join(dir, '6_sprites.png'));
}
