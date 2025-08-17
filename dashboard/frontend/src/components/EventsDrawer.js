import React, { useMemo, useState } from "react";

export default function EventsDrawer({ events = [] }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(true);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return events;
    return events.filter((e) =>
      [e.Event, e.Title, e.Type, e.Description, e.date]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(qq)
    );
  }, [events, q]);

  return (
    <div>
      <div className="row-between">
        <h3>Events</h3>
        <button className="btn" onClick={() => setOpen((v) => !v)}>{open ? "Hide" : "Show"}</button>
      </div>
      {open && (
        <>
          <input
            className="input"
            placeholder="Search events..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="list">
            {filtered.length === 0 ? (
              <div className="muted">No events in this range</div>
            ) : (
              filtered.map((e, i) => (
                <div key={i} className="list-item">
                  <div className="list-title">
                    {e.date} — {e.Event || e.Title}
                  </div>
                  <div className="list-sub">{e.Type}</div>
                  <div className="list-desc">{e.Description}</div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
