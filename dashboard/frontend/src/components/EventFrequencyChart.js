import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

function EventFrequencyChart({ events }) {
  // Count events per year
  const freq = {};
  events.forEach(ev => {
    const year = ev.date ? ev.date.substring(0, 4) : "Unknown";
    freq[year] = (freq[year] || 0) + 1;
  });
  const data = Object.entries(freq).map(([year, count]) => ({ year, count }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3>Event Frequency by Year</h3>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default EventFrequencyChart;
