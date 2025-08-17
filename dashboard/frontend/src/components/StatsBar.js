import React, { useMemo } from "react";
import { ArrowUpCircle, ArrowDownCircle, TrendingUp, Sigma, BarChart3 } from "lucide-react";

function toNumber(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}

export default function StatsBar({ prices }) {
  const stats = useMemo(() => {
    if (!prices || prices.length === 0) return null;

    const series = prices
      .map((r) => ({ d: r.date, p: toNumber(r.Price), lr: r.Log_Return }))
      .filter((r) => r.p !== null);

    if (series.length === 0) return null;

    const last = series[series.length - 1];
    const min = series.reduce((a, b) => (b.p < a.p ? b : a));
    const max = series.reduce((a, b) => (b.p > a.p ? b : a));
    const avg = series.reduce((s, r) => s + r.p, 0) / series.length;

    // annualized volatility from daily log returns
    const lrs = series.map((r) => Number(r.lr)).filter((x) => Number.isFinite(x));
    const lrMean = lrs.reduce((s, x) => s + x, 0) / (lrs.length || 1);
    const lrVar =
      lrs.reduce((s, x) => s + (x - lrMean) * (x - lrMean), 0) /
      (lrs.length > 1 ? lrs.length - 1 : 1);
    const dailyStd = Math.sqrt(Math.max(lrVar, 0));
    const annVol = dailyStd * Math.sqrt(252);

    return {
      last,
      min,
      max,
      avg,
      annVol,
      count: prices.length,
      span: `${prices[0].date} → ${prices[prices.length - 1].date}`,
    };
  }, [prices]);

  if (!stats) {
    return (
      <div className="kpi-row">
        <div className="kpi-card">No price data</div>
      </div>
    );
  }

  return (
    <div className="kpi-row">
      <div className="kpi-card">
        <div className="kpi-label">Current Price</div>
        <div className="kpi-value">${stats.last.p.toFixed(2)}</div>
        <div className="kpi-sub">{stats.last.d}</div>
      </div>

      {/* Highest Price - Green */}
      <div className="kpi-card kpi-high">
        <div className="kpi-label">Highest</div>
        <div className="kpi-value">
          <ArrowUpCircle size={20} style={{ marginRight: 6 }} /> ${stats.max.p.toFixed(2)}
        </div>
        <div className="kpi-sub">{stats.max.d}</div>
      </div>

      {/* Lowest Price - Red */}
      <div className="kpi-card kpi-low">
        <div className="kpi-label">Lowest</div>
        <div className="kpi-value">
          <ArrowDownCircle size={20} style={{ marginRight: 6 }} /> ${stats.min.p.toFixed(2)}
        </div>
        <div className="kpi-sub">{stats.min.d}</div>
      </div>

      {/* Average - Blue */}
      <div className="kpi-card kpi-avg">
        <div className="kpi-label">Average</div>
        <div className="kpi-value">
          <TrendingUp size={20} style={{ marginRight: 6 }} /> ${stats.avg.toFixed(2)}
        </div>
        <div className="kpi-sub">across {stats.count} points</div>
      </div>

      {/* Volatility - Purple */}
      <div className="kpi-card kpi-vol">
        <div className="kpi-label">Annualized Volatility</div>
        <div className="kpi-value">
          <Sigma size={20} style={{ marginRight: 6 }} /> {(stats.annVol * 100).toFixed(2)}%
        </div>
        <div className="kpi-sub">{stats.span}</div>
      </div>
    </div>
  );
}
