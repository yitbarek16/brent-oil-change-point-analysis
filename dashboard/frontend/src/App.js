// dashboard/frontend/src/App.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ReferenceLine, Scatter, ScatterChart, YAxis as YAxis2
} from "recharts";

function isoDate(d) {
  // ensure date string YYYY-MM-DD
  return new Date(d);
}

function App() {
  const [prices, setPrices] = useState([]);
  const [events, setEvents] = useState([]);
  const [cpSingle, setCpSingle] = useState([]);
  const [cpMulti, setCpMulti] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [pRes, eRes, sRes, mRes] = await Promise.all([
          axios.get("/api/prices"),
          axios.get("/api/events"),
          axios.get("/api/changepoints/single"),
          axios.get("/api/changepoints/multi"),
        ]);

        // Normalize prices to {date, price}
        const pricesData = pRes.data.map(d => ({
          date: d.date,
          price: Number(d.price),
          log_return: d.log_return ? Number(d.log_return) : undefined,
          rolling_std_252: d.rolling_std_252 ? Number(d.rolling_std_252) : undefined
        }));

        // For Recharts, convert date to string and sort
        pricesData.sort((a,b) => new Date(a.date) - new Date(b.date));

        setPrices(pricesData);
        setEvents(eRes.data || []);
        setCpSingle(sRes.data || []);
        setCpMulti(mRes.data || []);
      } catch (err) {
        console.error("Error loading API data:", err);
      }
    }
    fetchData();
  }, []);

  // create scatter points for changepoints
  const cpSinglePoints = cpSingle.map(cp => ({
    date: cp.change_date,
    label: `Single: ${cp.change_date}`
  }));

  const cpMultiPoints = cpMulti.map(cp => ({
    date: cp.change_date,
    label: `CP ${cp.change_number}: ${cp.change_date}`
  }));

  // interactive filters (simple example)
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredPrices = prices.filter(d => {
    if (!startDate && !endDate) return true;
    const dt = new Date(d.date);
    if (startDate && dt < new Date(startDate)) return false;
    if (endDate && dt > new Date(endDate)) return false;
    return true;
  });

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h2>Brent Oil Dashboard — Change Point Explorer</h2>

      <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 8 }}>Start:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <label style={{ marginLeft: 12, marginRight: 8 }}>End:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      <div style={{ width: "100%", height: 420 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredPrices}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(tick) => tick} minTickGap={20} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="price" name="Brent Price" stroke="#2b6cb0" dot={false} />

            {/* single change points as ReferenceLine */}
            {cpSinglePoints.map((cp, i) => (
              <ReferenceLine key={`s-${i}`} x={cp.date} stroke="red" strokeDasharray="3 3" label={`Single ${i+1}`} />
            ))}

            {/* multi change points */}
            {cpMultiPoints.map((cp, i) => (
              <ReferenceLine key={`m-${i}`} x={cp.date} stroke="#ff7f0e" strokeDasharray="5 3" label={`CP ${i+1}`} />
            ))}

          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "flex", gap: 20, marginTop: 18 }}>
        <div style={{ flex: 1 }}>
          <h3>Detected Change Points (Single)</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr><th>Date</th><th>Before</th><th>After</th><th>Δ (USD)</th></tr>
            </thead>
            <tbody>
              {cpSingle.map((cp, idx) => (
                <tr key={idx}>
                  <td style={{ borderTop: "1px solid #ddd" }}>{cp.change_date}</td>
                  <td style={{ borderTop: "1px solid #ddd" }}>{cp.mean_before?.toFixed(2)}</td>
                  <td style={{ borderTop: "1px solid #ddd" }}>{cp.mean_after?.toFixed(2)}</td>
                  <td style={{ borderTop: "1px solid #ddd" }}>{cp.delta?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ flex: 1 }}>
          <h3>Detected Change Points (Multi)</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr><th>#</th><th>Date</th><th>Before</th><th>After</th><th>%</th></tr>
            </thead>
            <tbody>
              {cpMulti.map((cp, idx) => (
                <tr key={idx}>
                  <td style={{ borderTop: "1px solid #ddd" }}>{cp.change_number}</td>
                  <td style={{ borderTop: "1px solid #ddd" }}>{cp.change_date}</td>
                  <td style={{ borderTop: "1px solid #ddd" }}>{cp.mean_before?.toFixed(2)}</td>
                  <td style={{ borderTop: "1px solid #ddd" }}>{cp.mean_after?.toFixed(2)}</td>
                  <td style={{ borderTop: "1px solid #ddd" }}>{cp.pct_change ? cp.pct_change.toFixed(1) + "%" : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Event List (sample)</h3>
        <div style={{ maxHeight: 200, overflow: "auto", border: "1px solid #eee", padding: 8 }}>
          {events.slice(0, 200).map((ev, i) => (
            <div key={i} style={{ padding: 6, borderBottom: "1px solid #f1f1f1" }}>
              <strong>{ev.date}</strong> — {ev.event_name} [{ev.event_type}]
              <div style={{ color: "#555" }}>{ev.description}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default App;
