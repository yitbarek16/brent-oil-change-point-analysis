import React from "react";

export default function HeaderControls({
  dateRange,
  setDateRange,
  showCP,
  setShowCP,
  showEvents,
  setShowEvents,
}) {
  return (
    <div className="card controls">
      {/* No extra row wrapper */}
      <div className="control">
        <label>Start Date:</label>
        <input
          type="date"
          value={dateRange.start}
          onChange={(e) => setDateRange((r) => ({ ...r, start: e.target.value }))}
        />
      </div>

      <div className="control">
        <label>End Date:</label>
        <input
          type="date"
          value={dateRange.end}
          onChange={(e) => setDateRange((r) => ({ ...r, end: e.target.value }))}
        />
      </div>

      <div className="control">
        <label>Events:</label>
        <select
          value={showEvents ? "on" : "off"}
          onChange={(e) => setShowEvents(e.target.value === "on")}
        >
          <option value="on">Show</option>
          <option value="off">Hide</option>
        </select>
      </div>

      <div className="control">
        <label>Change Points:</label>
        <select value={showCP} onChange={(e) => setShowCP(e.target.value)}>
          <option value="all">All</option>
          <option value="single">Single only</option>
          <option value="multi">Multi only</option>
          <option value="none">Hide</option>
        </select>
      </div>

      <div className="control">
        <button className="btn" onClick={() => setDateRange({ start: "", end: "" })}>
          Reset Dates
        </button>
      </div>
    </div>
  );
}
