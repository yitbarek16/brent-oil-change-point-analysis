import React, { useMemo, useState } from "react";

function CPTable({ data = [] }) {
  if (!data || data.length === 0) return <div className="muted">No change points detected</div>;
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Before</th>
            <th>After</th>
            <th>$ (USD)</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {data.map((c, i) => (
            <tr key={i}>
              <td>{c.change_number}</td>
              <td>{(c.change_date || "").toString().slice(0, 10)}</td>
              <td>{Number(c.mean_before).toFixed(2)}</td>
              <td>{Number(c.mean_after).toFixed(2)}</td>
              <td>{Number(c.delta).toFixed(2)}</td>
              <td>{Number(c.pct_change).toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ChangePointPanel({ singleCP = [], multiCP = [] }) {
  const [tab, setTab] = useState("multi"); // default to multi
  const counts = useMemo(() => ({ s: singleCP.length, m: multiCP.length }), [singleCP, multiCP]);

  return (
    <div>
      <div className="row-between">
        <h3>Change Points</h3>
        <div className="tabs">
          <button className={`tab ${tab === "multi" ? "active" : ""}`} onClick={() => setTab("multi")}>
            Multi ({counts.m})
          </button>
          <button className={`tab ${tab === "single" ? "active" : ""}`} onClick={() => setTab("single")}>
            Single ({counts.s})
          </button>
        </div>
      </div>
      {tab === "multi" ? <CPTable data={multiCP} /> : <CPTable data={singleCP} />}
    </div>
  );
}
