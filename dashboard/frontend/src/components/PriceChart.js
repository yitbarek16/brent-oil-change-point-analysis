import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Brush,
} from "recharts";

function formatDate(d) {
  return new Date(d).toISOString().slice(0, 10);
}

export default function PriceChart({ prices = [], events = [], singleCP = [], multiCP = [] }) {
  const data = useMemo(
    () =>
      prices.map((p) => ({
        date: p.date,
        price: Number(p.Price),
      })),
    [prices]
  );

  // --- Compute latest change ---
  const priceChange = useMemo(() => {
    if (data.length < 2) return null;
    const last = data[data.length - 1].price;
    const prev = data[data.length - 2].price;
    const diff = last - prev;
    const pct = (diff / prev) * 100;
    return { last, diff, pct };
  }, [data]);

  const eventLines = useMemo(
    () => events.map((e, i) => ({ key: `ev-${i}`, date: formatDate(e.date) })),
    [events]
  );
  const singleLines = useMemo(
    () => (singleCP || []).map((c, i) => ({ key: `s-${i}`, date: formatDate(c.change_date) })),
    [singleCP]
  );
  const multiLines = useMemo(
    () => (multiCP || []).map((c, i) => ({ key: `m-${i}`, date: formatDate(c.change_date) })),
    [multiCP]
  );

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
        <span style={{ width: 16, height: 3, background: "#1976d2" }}></span> Price
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ width: 16, height: 3, background: "#ff9800" }}></span> Events
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ width: 16, height: 3, background: "#8e24aa" }}></span> Change Points
      </span>
    </div>
  );

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", height: 420, position: "relative" }}>
        {/* --- Last Price Change (top-right overlay) --- */}
        {priceChange && (
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 16,
            display: "inline-block",       // ensures the box wraps around fully
            fontSize: "0.85rem",
            fontWeight: "600",
            color: priceChange.diff >= 0 ? "green" : "red",
            backgroundColor: "#ffffff",    // solid white (hex to avoid theme issues)
            padding: "6px 10px",           // a bit more spacing
            borderRadius: "6px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            zIndex: 10,                    // ensure it's above chart grid
          }}
        >
          {priceChange.diff >= 0 ? "+" : ""}
          {priceChange.diff.toFixed(2)} ({priceChange.pct.toFixed(2)}%)
        </div>
      )}


        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 16, right: 24, left: 40, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              tickFormatter={(d) => d.slice(0, 4)}
              label={{ value: "Date", position: "insideBottom", offset: -25 }}
            />

            <YAxis
              width={60}
              label={{ value: "Price", angle: -90, position: "insideLeft", offset: 10 }}
            />

            <Tooltip
              formatter={(v) => (typeof v === "number" ? v.toFixed(2) : v)}
              labelFormatter={(l) => `Date: ${l}`}
            />

            <Line
              type="monotone"
              dataKey="price"
              name="Price (USD)"
              dot={false}
              stroke="#1976d2"
              strokeWidth={2}
              isAnimationActive={false}
            />

            {eventLines.map((e) => (
              <ReferenceLine key={e.key} x={e.date} stroke="#ff9800" strokeDasharray="3 3" />
            ))}
            {singleLines.map((c) => (
              <ReferenceLine key={c.key} x={c.date} stroke="#8e24aa" strokeDasharray="6 3" />
            ))}
            {multiLines.map((c) => (
              <ReferenceLine key={c.key} x={c.date} stroke="#8e24aa" strokeDasharray="6 3" />
            ))}

            <Brush dataKey="date" height={24} travellerWidth={12} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {renderLegend()}
    </div>
  );
}
