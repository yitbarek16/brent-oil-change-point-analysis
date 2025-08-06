import React from "react";

function EventsList({ events, onSelectEvent }) {
  return (
    <div>
      <h3>Events</h3>
      {events.length > 0 ? (
        <ul className="events-list">
          {events.map((ev, idx) => (
            <li key={idx} onClick={() => onSelectEvent(ev)}>
              <strong>{ev.date}</strong> - {ev.Event} ({ev.Type})
            </li>
          ))}
        </ul>
      ) : (
        <p>No events loaded</p>
      )}
    </div>
  );
}

export default EventsList;
