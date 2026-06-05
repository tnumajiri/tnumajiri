"""酷暑下でキャベツ生育モデルの予測がどう割れるかを比較する。

平年シナリオで「素GDD / 上限キャップGDD / 茨城R4 / RUE型」が同じ収穫日になるよう
較正し、その同じモデルを猛暑シナリオに通して収穫日予測のズレを見る。

実行: python3 simulate.py
出力: 標準出力に比較表、results.csv に数値を保存。
ネットワーク・外部依存なし（標準ライブラリのみ）。
"""

from __future__ import annotations

import csv
import math
from dataclasses import dataclass
from datetime import date, timedelta

from models import Models

PLANTING = date(2024, 6, 1)   # 6/1 定植 → 結球肥大が盛夏(7-8月)の酷暑に重なる作型
HORIZON = 130                 # 定植後 最大日数


@dataclass
class DayWeather:
    doy: int
    month: int
    tmean: float    # 日平均気温 [℃]
    solar_mj: float  # 日積算全天日射量 [MJ/m2]


def base_tmean(doy: int) -> float:
    """平年の日平均気温（年周期サイン）。盛夏 約26℃、厳寒 約4.5℃。"""
    return 15.2 - 10.7 * math.cos(2 * math.pi * (doy - 16) / 365.0)


def base_solar(doy: int) -> float:
    """平年の日射量 [MJ/m2]。盛夏 約20、厳寒 約7。"""
    return 13.5 + 6.5 * math.sin(2 * math.pi * (doy - 80) / 365.0)


def make_weather(scenario: str) -> list[DayWeather]:
    out: list[DayWeather] = []
    for d in range(HORIZON + 1):
        day = PLANTING + timedelta(days=d)
        doy = int(day.strftime("%j"))
        t = base_tmean(doy)
        s = base_solar(doy)
        if scenario == "heat":
            # 盛夏(7-8月)に高温アノマリ +5℃、6月下旬〜7月の梅雨で日射 -35%
            if day.month in (7, 8):
                t += 5.0
            elif day.month == 6 and day.day >= 20:
                t += 2.5
            if (day.month == 6 and day.day >= 20) or (day.month == 7 and day.day <= 20):
                s *= 0.65
        out.append(DayWeather(doy=doy, month=day.month, tmean=round(t, 2),
                              solar_mj=round(max(0.5, s), 2)))
    return out


def calibrate(normal: list[DayWeather], target_day: int = 70) -> Models:
    """平年シナリオで上限キャップGDDとRUE型が target_day に揃うよう較正。"""
    # 有効積算温度のしきい値 = 平年の上限キャップ有効温度の target_day 日累積
    acc = 0.0
    for w in normal[:target_day + 1]:
        acc += max(0.0, min(w.tmean, 30.0) - 5.0)
    target_et = acc

    # RUE_max を二分探索で較正（head_fw が target_day で目標球重に達するよう）
    target_head = 1200.0  # 目標球重 [g]
    lo, hi = 0.1, 10.0
    for _ in range(60):
        mid = (lo + hi) / 2
        m = Models(target_et=target_et, rue_max=mid, target_head_fw=target_head)
        hd = m.harvest_day_rue(normal)
        if hd is None or hd > target_day:
            lo = mid
        else:
            hi = mid
    return Models(target_et=target_et, rue_max=hi, target_head_fw=target_head)


def harvest_date(d: int | None) -> str:
    if d is None:
        return "未到達"
    return (PLANTING + timedelta(days=d)).strftime("%m/%d") + f" (+{d}日)"


def main() -> None:
    normal = make_weather("normal")
    heat = make_weather("heat")
    m = calibrate(normal, target_day=70)

    models = [
        ("素のGDD（上限なし）", m.harvest_day_naive),
        ("上限キャップGDD(30℃)", m.harvest_day_capped),
        ("茨城R4法（高温/低日射補正）", m.harvest_day_r4),
        ("RUE型（NARO露地ツール相当）", m.harvest_day_rue),
    ]

    rows = []
    print(f"\n定植日: {PLANTING}  / 較正: 平年で上限GDD・RUE型が +70日に一致")
    print(f"較正値: target_ET={m.target_et:.0f} ℃日, RUE_max={m.rue_max:.3f} g/MJ, 目標球重={m.target_head_fw:.0f} g\n")
    header = f"{'モデル':<28}{'平年 収穫':<18}{'猛暑 収穫':<18}{'猛暑のズレ':>10}"
    print(header)
    print("-" * len(header))
    for name, fn in models:
        dn = fn(normal)
        dh = fn(heat)
        diff = (dh - dn) if (dn is not None and dh is not None) else None
        diff_s = (f"{diff:+d}日" if diff is not None else "—")
        print(f"{name:<28}{harvest_date(dn):<18}{harvest_date(dh):<18}{diff_s:>10}")
        rows.append({
            "model": name,
            "normal_day": dn, "normal_date": harvest_date(dn),
            "heat_day": dh, "heat_date": harvest_date(dh),
            "heat_shift_days": diff,
        })

    # 気象サマリ
    def summ(ws, label):
        jul_aug = [w for w in ws if w.month in (7, 8)]
        t = sum(w.tmean for w in jul_aug) / len(jul_aug)
        s = sum(w.solar_mj for w in jul_aug) / len(jul_aug)
        print(f"  {label}: 7-8月 平均気温 {t:.1f}℃ / 平均日射 {s:.1f} MJ")

    print("\n[気象シナリオ]")
    summ(normal, "平年")
    summ(heat, "猛暑")

    with open("results.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)
    print("\n→ results.csv に保存しました。")

    print("""
[読み方]
 ・素のGDD は猛暑で「早まる/変わらない」= 高温の熱量を生育に算入し過大評価しやすい。
 ・上限キャップGDD は 30℃超を頭打ちにするだけなので猛暑の伸びを止めるが減算はしない。
 ・茨城R4法 は 25℃超過減算＋低日射減算で、猛暑では収穫を「遅らせる」側に補正する。
 ・RUE型 は低日射(梅雨)で乾物生産が落ち、収穫が遅れる＝日射主導で酷暑の停滞を捉える。
 ※ 係数は教材用の較正値。絶対日数ではなくモデル間の「割れ方」を見ること。
""")


if __name__ == "__main__":
    main()
