import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

function LogReturnChart({ prices }) {
  const data = prices
    .filter(p => p.Log_Return !== null && !isNaN(p.Log_Return))
    .map(p => ({
      date: p.date,
      log_return: p.Log_Return
    }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3 style={{ color: "#ff7f50" }}>Daily Log Returns of Brent Oil Prices</h3>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" minTickGap={20} />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="log_return"
            stroke="#ff7f50" // coral/orange like matplotlib example
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LogReturnChart;
