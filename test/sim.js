'use strict';
/* Headless smoke test: stubs DOM/canvas/audio, loads game.js,
 * simulates input and thousands of frames, and asserts basic progress.
 * Run: node test/sim.js
 */

// --- universal callable proxy (absorbs any canvas/audio API call) ---
function anyProxy() {
  const fn = function () { return p; };
  const p = new Proxy(fn, {
    get(t, k) {
      if (k === Symbol.toPrimitive) return () => 0;
      if (k === 'length' || k === 'width' || k === 'height') return 16;
      return p;
    },
    set() { return true; },
    apply() { return p; },
    construct() { return p; }
  });
  return p;
}

const listeners = { keydown: [], keyup: [] };
let rafCb = null;

global.window = global;
global.addEventListener = (ev, fn) => { (listeners[ev] = listeners[ev] || []).push(fn); };
global.requestAnimationFrame = cb => { rafCb = cb; return 0; };
global.AudioContext = function () { return anyProxy(); };
global.document = {
  getElementById: () => ({
    getContext: () => anyProxy(),
    width: 256, height: 240, style: {}
  }),
  createElement: () => ({
    getContext: () => anyProxy(),
    width: 16, height: 16
  })
};

require('../game.js');

const dbg = global.__debug;
if (!dbg) { console.error('FAIL: __debug not exposed'); process.exit(1); }

function key(code, down) {
  const ev = { code, preventDefault() {} };
  for (const fn of listeners[down ? 'keydown' : 'keyup']) fn(ev);
}
let t = 0;
function frames(n) {
  for (let i = 0; i < n; i++) { t += 1000 / 60; rafCb(t); }
}

// title -> start
frames(10);
console.log('state after boot:', dbg.game.state);
key('Enter', true); frames(2); key('Enter', false);
frames(130); // prelevel is 120 frames
console.log('state after start:', dbg.game.state);
if (dbg.game.state !== 'play') { console.error('FAIL: did not reach play state'); process.exit(1); }

// --- deterministic mechanic tests -----------------------------------------
function expect(cond, msg) {
  if (!cond) { console.error('FAIL:', msg); process.exit(1); }
  console.log('ok:', msg);
}

// Test 1: bump the ? block at column 16, row 9 -> coin + score
dbg.player.x = 16 * 16 + 3;
dbg.player.vx = 0;
frames(30); // settle on ground
const scoreBefore = dbg.game.score;
key('KeyZ', true); frames(20); key('KeyZ', false); frames(40);
expect(dbg.game.score > scoreBefore, '? block gives score (got +' + (dbg.game.score - scoreBefore) + ')');
expect(dbg.game.coins === 1, 'coin counter incremented');

// Test 2: stomp a goomba (in open space, column 10)
dbg.player.x = 10 * 16;
const goombaE = dbg.enemies.find(e => e.type === 'goomba' && e.alive);
goombaE.active = true;
goombaE.x = dbg.player.x + 4;
goombaE.y = 13 * 16 - 16;
dbg.player.y = goombaE.y - 48;
dbg.player.vy = 0;
const score2 = dbg.game.score;
frames(40);
expect(dbg.game.score >= score2 + 100, 'goomba stomp gives 100');
expect(goombaE.squash > 0 || !goombaE.alive, 'goomba squashed');
expect(dbg.game.state === 'play', 'player survived the stomp');

// Test 3: koopa stomp -> shell -> kick (in open space)
dbg.player.x = 10 * 16;
const koopaE = dbg.enemies.find(e => e.type === 'koopa');
koopaE.active = true;
koopaE.x = dbg.player.x + 4;
koopaE.y = 13 * 16 - 21;
koopaE.vx = 0;
dbg.player.y = koopaE.y - 48;
dbg.player.vy = 0;
frames(30);
expect(koopaE.shell, 'koopa turned into shell');
frames(60);
expect(koopaE.shellMoving, 'shell was kicked');
console.log('--- mechanic tests passed ---');

// run right while hopping, for a long time
key('ArrowRight', true);
key('ShiftLeft', true);
let maxX = 0, deaths = 0;
for (let i = 0; i < 9000; i++) {
  if (i % 40 === 0) key('KeyZ', true);
  if (i % 40 === 25) key('KeyZ', false);
  t += 1000 / 60; rafCb(t);
  const st = dbg.game.state;
  if (st === 'play' || st === 'flag') maxX = Math.max(maxX, dbg.player.x);
  if (st === 'dead') deaths++;
  if (st === 'clear' || st === 'gameover' || st === 'title') break;
}
console.log('final state:', dbg.game.state,
  '| max player x:', Math.round(maxX),
  '| score:', dbg.game.score,
  '| coins:', dbg.game.coins,
  '| lives:', dbg.game.lives,
  '| time:', dbg.game.time);

if (maxX < 30 * 16) { console.error('FAIL: player barely moved'); process.exit(1); }

// --- goal sequence: restart, warp near the staircase, run to the flag ------
key('ArrowRight', false); key('ShiftLeft', false); key('KeyZ', false);
frames(100); // game-over screen ignores the start key for 90 frames
if (dbg.game.state !== 'title') { key('Enter', true); frames(3); key('Enter', false); frames(3); }
key('Enter', true); frames(3); key('Enter', false);
frames(130);
expect(dbg.game.state === 'play', 'restarted into play');
dbg.player.x = 176 * 16; dbg.player.y = 11 * 16;
key('ArrowRight', true); key('ShiftLeft', true);
let cleared = false;
for (let i = 0; i < 4000; i++) {
  if (i % 36 === 0) key('KeyZ', true);
  if (i % 36 === 22) key('KeyZ', false);
  t += 1000 / 60; rafCb(t);
  if (dbg.game.state === 'clear') { cleared = true; break; }
  if (dbg.game.state === 'gameover' || dbg.game.state === 'title') break;
}
expect(cleared, 'reached the flag and cleared the course (score ' + dbg.game.score + ')');
console.log('SMOKE TEST OK');
