"""キャベツ生育モデルの再現実装（酷暑挙動の比較用）.

注意（重要）:
    本ファイルのモデルは、農研機構・茨城県農業総合センター等が公開している
    「考え方・補正ルール」を原典記述から再現した *教材用の近似実装* であり、
    各機関が用いている正式なパラメータ値そのものではない。
    - 有効積算温度の基準/上限（5/30 ℃）と、茨城 R4 予測法の補正ルール
      （7-8月は 25 ℃超過分を減算 / 1-2月の有効温度 5-10 ℃域は ×0.8 /
       梅雨低日射時は日射に応じて減算）は原典記述に基づく。
    - 収穫しきい値・RUE 値などの係数は、平年シナリオで現実的な収穫日に
      なるよう本スクリプト側で較正した値であり、原典の値ではない。
    目的は「酷暑下で各モデルの予測がどう割れるか」を数値で示すことにある。

出典:
    - 露地キャベツ出荷期予測の精度向上（R4予測法）, 茨城県農業総合センター
    - アブラナ科野菜の生育と積算気温および積算受光量との関係, 農研機構研究報告 2024
    - NARO生育・収量予測ツール③キャベツ (yieldpredict-cabbage), WAGRI
"""

from __future__ import annotations

from dataclasses import dataclass


# --- 共通パラメータ ---------------------------------------------------------
T_BASE = 5.0   # 基準温度 [℃]（地上部の生育は 5〜30 ℃で進む）
T_CAP = 30.0   # 上限温度 [℃]


def effective_temp_capped(tmean: float) -> float:
    """上限キャップ付き有効温度: clamp(Tmean, 5, 30) - 5."""
    return max(0.0, min(tmean, T_CAP) - T_BASE)


def effective_temp_naive(tmean: float) -> float:
    """素のGDD: 上限なし（Tmean - 5）。酷暑で過大評価する側。"""
    return max(0.0, tmean - T_BASE)


# --- 茨城 R4 予測法の補正ルール ---------------------------------------------
def effective_temp_r4(tmean: float, solar_mj: float, month: int,
                      solar_ref: float = 16.0) -> float:
    """茨城 R4 予測法を模した有効温度（原典の補正ルールを再現）.

    1) 上限キャップ付き有効温度を基礎値にする。
    2) 7-8月: 日平均気温の 25 ℃超過分を減算（高温で生育が鈍る分）。
    3) 6-8月の低日射: 日積算日射量 H が基準 solar_ref を下回る割合に応じて減算
       （梅雨・曇天で玉が太らない分。原典は回帰直線ベースだがここでは線形近似）。
    4) 1-2月: 有効温度が 5〜10 ℃の低温域なら ×0.8。
    """
    eff = effective_temp_capped(tmean)

    # (2) 盛夏の高温減算
    if month in (7, 8) and tmean > 25.0:
        eff -= (tmean - 25.0)

    # (3) 梅雨〜盛夏の低日射減算（線形近似）
    if month in (6, 7, 8) and solar_mj < solar_ref:
        eff *= max(0.0, solar_mj / solar_ref)

    # (4) 厳寒期の低温減衰
    if month in (1, 2) and 5.0 <= eff <= 10.0:
        eff *= 0.8

    return max(0.0, eff)


# --- RUE型（NARO生育・収量予測ツール③ 相当）-------------------------------
def rue_factor(tmean: float) -> float:
    """気温による光利用効率の相対係数（0〜1）.

    5 ℃以下と 35 ℃以上で 0、18〜22 ℃で最大の折れ線。
    （原典: RUE は日平均気温の関数で 5 ℃近辺から低減、高温側も低下する設計）
    """
    if tmean <= 5.0 or tmean >= 35.0:
        return 0.0
    if tmean < 18.0:
        return (tmean - 5.0) / (18.0 - 5.0)
    if tmean <= 22.0:
        return 1.0
    return (35.0 - tmean) / (35.0 - 22.0)


def f_intercept(day_after_plant: int) -> float:
    """受光割合（群落の光遮断率）。定植後の生育で 0.05→0.90 に飽和する近似。"""
    # ロジスティック状の立ち上がり
    import math
    return 0.90 / (1.0 + math.exp(-0.10 * (day_after_plant - 30)))


@dataclass
class Models:
    """較正済みのしきい値を保持して各モデルの収穫日を計算する。"""

    target_et: float          # 有効積算温度モデルの収穫しきい値 [℃日]
    rue_max: float            # 乾物生産の光利用効率 [g DM / MJ(PAR)]
    target_head_fw: float     # 収穫球重の目標 [g]（生体重）
    par_fraction: float = 0.5  # 全天日射→PARの割合
    dm_to_fw: float = 1.0 / 0.07  # 乾物→生体重（含水率約93%）
    head_partition: float = 0.6   # 地上部乾物のうち結球部へ配分する割合

    # --- 各モデルの収穫日（定植後日数）を返す ---
    def harvest_day_naive(self, weather) -> int | None:
        acc = 0.0
        for d, w in enumerate(weather):
            acc += effective_temp_naive(w.tmean)
            if acc >= self.target_et:
                return d
        return None

    def harvest_day_capped(self, weather) -> int | None:
        acc = 0.0
        for d, w in enumerate(weather):
            acc += effective_temp_capped(w.tmean)
            if acc >= self.target_et:
                return d
        return None

    def harvest_day_r4(self, weather) -> int | None:
        acc = 0.0
        for d, w in enumerate(weather):
            acc += effective_temp_r4(w.tmean, w.solar_mj, w.month)
            if acc >= self.target_et:
                return d
        return None

    def harvest_day_rue(self, weather) -> int | None:
        head_fw = 0.0
        for d, w in enumerate(weather):
            ipar = w.solar_mj * self.par_fraction * f_intercept(d)
            dm = self.rue_max * rue_factor(w.tmean) * ipar
            head_fw += dm * self.head_partition * self.dm_to_fw
            if head_fw >= self.target_head_fw:
                return d
        return None
