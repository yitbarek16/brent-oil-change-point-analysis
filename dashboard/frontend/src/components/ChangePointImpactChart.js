import React from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

function ChangePointImpactChart({ cps, title }) {
  const data = cps.map(cp => ({
    before: cp.mean_before,
    after: cp.mean_after,
    label: cp.change_date
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3>{title}</h3>
      <ResponsiveContainer>
        <ScatterChart>
          <CartesianGrid />
          <XAxis type="number" dataKey="before" name="Mean Before" />
          <YAxis type="number" dataKey="after" name="Mean After" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Change Points" data={data} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChangePointImpactChart;
