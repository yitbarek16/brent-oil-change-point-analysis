import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, ResponsiveContainer
} from "recharts";

function PriceChart({ prices, singleCP, multiCP, showCP }) {
  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <LineChart data={prices}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" minTickGap={20} />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="Price"
            stroke="#007bff"
            dot={false}
          />
          {showCP !== "none" && showCP !== "multi" &&
            singleCP.map((cp, idx) => (
              <ReferenceLine
                key={`single-${idx}`}
                x={cp.change_date}
                stroke="red"
                label={`S${cp.change_number}`}
              />
            ))
          }
          {showCP !== "none" && showCP !== "single" &&
            multiCP.map((cp, idx) => (
              <ReferenceLine
                key={`multi-${idx}`}
                x={cp.change_date}
                stroke="orange"
                label={`M${cp.change_number}`}
              />
            ))
          }
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PriceChart;
