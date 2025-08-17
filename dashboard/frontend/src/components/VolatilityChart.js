import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Brush,
} from "recharts";

function toNum(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}

export default function VolatilityChart({ prices = [], windowSize = 21 }) {
  const data = useMemo(() => {
    if (!prices || prices.length < 3) return [];
    const rows = prices
      .map((r) => ({ date: r.date, price: toNum(r.Price) }))
      .filter((r) => r.price !== null);

    const lr = rows.map((r, i) =>
      i === 0 ? null : Math.log(rows[i].price / rows[i - 1].price)
    );

    const out = rows.map((r, i) => {
      if (i < windowSize || lr[i] == null)
        return { date: r.date, logReturn: lr[i] || null, vol: null };
      const slice = lr.slice(i - windowSize + 1, i + 1).filter((x) => x !== null);
      const mean = slice.reduce((s, x) => s + x, 0) / slice.length;
      const variance =
        slice.reduce((s, x) => s + (x - mean) ** 2, 0) /
        (slice.length > 1 ? slice.length - 1 : 1);
      return {
        date: r.date,
        logReturn: lr[i],
        vol: Math.sqrt(Math.max(variance, 0)),
      };
    });
    return out;
  }, [prices, windowSize]);

  // --- Custom Legend under chart ---
  const renderLegend = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "24px",
        marginTop: "12px",
        flexWrap: "wrap",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ width: 16, height: 3, background: "#ff7043" }}></span>
        Daily Log Return
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ width: 16, height: 3, background: "#455a64" }}></span>
        Rolling Std ({windowSize}d)
      </span>
    </div>
  );

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 20, right: 24, left: 40, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(d) => d.slice(0, 4)}
              label={{ value: "Date", position: "insideBottom", offset: -25 }}
            />
            <YAxis
              yAxisId="left"
              width={60}
              label={{ value: "Log Returns", angle: -90, position: "insideLeft" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              width={60}
              label={{ value: "Volatility", angle: 90, position: "insideRight" }}
            />
            <Tooltip />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="logReturn"
              name="Daily Log Return"
              dot={false}
              stroke="#ff7043"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="vol"
              name={`Rolling Std (${windowSize}d)`}
              dot={false}
              stroke="#455a64"
            />
            <Brush dataKey="date" height={24} travellerWidth={12} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {renderLegend()}
    </div>
  );
}
