import React from "react";

function HeaderControls({ dateRange, setDateRange, showCP, setShowCP }) {
  return (
    <div className="header-controls">
      <label>
        Start Date:
        <input
          type="date"
          value={dateRange.start}
          onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
        />
      </label>
      <label>
        End Date:
        <input
          type="date"
          value={dateRange.end}
          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
        />
      </label>
      <label>
        Show Change Points:
        <select
          value={showCP}
          onChange={(e) => setShowCP(e.target.value)}
        >
          <option value="all">All</option>
          <option value="single">Single CP</option>
          <option value="multi">Multi CP</option>
          <option value="none">None</option>
        </select>
      </label>
    </div>
  );
}

export default HeaderControls;
