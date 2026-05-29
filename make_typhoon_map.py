#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""2024-2025 日本・中国 台風進路 まとめ地図（1枚 / 2x2パネル）"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import cartopy.crs as ccrs
import cartopy.feature as cfeature

# 日本語フォント
jp = fm.FontProperties(fname="/usr/share/fonts/truetype/fonts-japanese-gothic.ttf")
plt.rcParams["axes.unicode_minus"] = False

# 進路データ: name, [(lon,lat),...], landfall_index(上陸/最接近の代表点), approach_only
# 座標は実経路を近似したもの
JP2024 = [
    ("T5 マリア",   [(145,30),(143,34),(142,37),(141.7,39.0),(141,41)], 3, False),
    ("T10 サンサン",[(128,24),(129,28),(130.3,31.8),(131.5,33),(133,33.6),(135.5,34),(138,34.5),(140,34.6)], 2, False),
    ("T7 アンピル",  [(142,22),(141,27),(140.3,31),(140.5,34),(140.8,35.7),(142,38),(144,41)], 4, True),
]
JP2025 = [
    ("T5 ナーリー",  [(143,33),(143,37),(142,40),(141,42.5),(141,44)], 3, False),
    ("T12 レンレン",[(131,27),(130.8,29),(130.5,31.5),(131,32.5),(131.5,33.2)], 2, False),
    ("T15 ペイパー",[(134,28),(133,31),(132.6,32.9),(133.6,33.6),(135.2,34.1),(137,34.6),(139,34.9),(141,35.6)], 2, False),
    ("T22 (接近)",  [(140,20),(140,26),(139.5,30),(139.8,33.7),(141,36),(143,39)], 3, True),
]
CN2024 = [
    ("T2 マリクシ", [(114,18),(113,20),(112,21.5),(112,23)], 2, False),
    ("T3 ケーミー", [(126,20),(124,22),(121.8,24.6),(120,25),(119,25.5),(118,27)], 2, False),
    ("T9 プラピルーン",[(114,16),(112,17.5),(110.4,18.8),(109,19.5),(107,21)], 2, False),
    ("T11 ヤギ",     [(118,16),(114,18),(111,19.3),(110.7,19.6),(110.2,20.3),(108,21),(106,21.5)], 3, False),
    ("T13 ベビンカ",[(126,24),(124,27),(122,29.5),(121.7,31.2),(120,32),(118,33)], 3, False),
    ("T18 クラトーン",[(126,18),(123,20),(121,22),(120.3,22.6),(120,24)], 3, False),
]
CN2025 = [
    ("T1 ウーティップ",[(112,15),(110,17),(108.7,18.5),(109,20),(110.1,20.9)], 2, False),
    ("T4 ダナス",   [(118,21),(119,22.5),(120.2,23.4),(120,25.5),(120.6,28),(121,29.5)], 2, False),
    ("T6 ウィパー", [(118,20),(115,21),(112.8,22.0),(110.5,21.6),(109,21.6)], 2, False),
    ("T16 ターファー",[(117,19),(115,20.5),(112.8,22.0),(112,23)], 2, False),
    ("T18 ラガサ",  [(128,19),(124,20.5),(120,21),(116,21.5),(113,21.8),(111.8,21.8),(111,23)], 5, False),
    ("T21 マットゥモ",[(115,17),(112,19),(110.4,21.2),(108,21.6)], 2, False),
]

PANELS = [
    ("(a) 2024年 日本に接近・上陸した台風", JP2024, [122,150,22,46]),
    ("(b) 2025年 日本に接近・上陸した台風", JP2025, [122,150,22,46]),
    ("(c) 2024年 中国に上陸した主な台風",   CN2024, [102,132,12,36]),
    ("(d) 2025年 中国に上陸した主な台風",   CN2025, [102,132,12,36]),
]

colors = ["#d62728","#1f77b4","#2ca02c","#ff7f0e","#9467bd","#8c564b","#e377c2"]

fig = plt.figure(figsize=(15, 13))
for i, (title, tracks, extent) in enumerate(PANELS):
    ax = fig.add_subplot(2, 2, i+1, projection=ccrs.PlateCarree())
    ax.set_extent(extent, crs=ccrs.PlateCarree())
    ax.add_feature(cfeature.LAND, facecolor="#f2efe9")
    ax.add_feature(cfeature.OCEAN, facecolor="#dcecf5")
    ax.add_feature(cfeature.COASTLINE, linewidth=0.6, edgecolor="#555")
    ax.add_feature(cfeature.BORDERS, linewidth=0.4, edgecolor="#999")
    gl = ax.gridlines(draw_labels=True, linewidth=0.3, color="gray", alpha=0.4)
    gl.top_labels = gl.right_labels = False
    gl.xlabel_style = gl.ylabel_style = {"size": 8}

    for j, (name, pts, lf, appr) in enumerate(tracks):
        c = colors[j % len(colors)]
        lons = [p[0] for p in pts]; lats = [p[1] for p in pts]
        ax.plot(lons, lats, "--" if appr else "-", color=c, lw=2.2,
                transform=ccrs.PlateCarree(), label=name, zorder=5,
                solid_capstyle="round")
        # 進行方向（始点に丸、終点に矢印風）
        ax.plot(lons[0], lats[0], "o", color=c, ms=5, transform=ccrs.PlateCarree(), zorder=6)
        # 上陸/最接近点に★
        ax.plot(lons[lf], lats[lf], marker="*", color=c, ms=15,
                markeredgecolor="white", markeredgewidth=0.6,
                transform=ccrs.PlateCarree(), zorder=7)
        ax.annotate(name, xy=(lons[lf], lats[lf]),
                    xytext=(lons[lf]+0.5, lats[lf]+0.5),
                    fontproperties=jp, fontsize=8, color=c, zorder=8,
                    path_effects=[])

    ax.set_title(title, fontproperties=jp, fontsize=13, pad=8)
    leg = ax.legend(loc="upper right", prop=jp, fontsize=8, framealpha=0.9)
    leg.set_zorder(20)

fig.suptitle("日本・中国に接近／上陸した台風の進路（2024年・2025年）\n"
             "★=上陸・最接近点  ●=経路の始点  実線=上陸  破線=接近のみ  ※進路は近似",
             fontproperties=jp, fontsize=16, y=0.98)
fig.tight_layout(rect=[0, 0, 1, 0.94])
fig.savefig("/home/user/tnumajiri/typhoon-tracks-map-2024-2025.png", dpi=140,
            bbox_inches="tight")
print("saved")
