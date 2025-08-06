import React from "react";

function CPTable({ title, cps }) {
  return (
    <div>
      <h3>{title}</h3>
      {cps.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Before</th>
              <th>After</th>
              <th>Δ (USD)</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            {cps.map((cp, idx) => (
              <tr key={idx}>
                <td>{cp.change_number}</td>
                <td>{cp.change_date}</td>
                <td>{cp.mean_before.toFixed(2)}</td>
                <td>{cp.mean_after.toFixed(2)}</td>
                <td>{cp.delta.toFixed(2)}</td>
                <td>{cp.pct_change.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No change points detected</p>
      )}
    </div>
  );
}

export default CPTable;
