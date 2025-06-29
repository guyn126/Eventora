import React, { useEffect, useState } from "react";
import axios from "axios";

const cardStyle = {
  borderRadius: "32px",
  background: "#fff",
  padding: "24px 40px",
  margin: "20px",
  minWidth: "200px",
  minHeight: "130px",
  boxShadow: "0 2px 8px rgba(30, 58, 138, 0.06)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [participants, setParticipants] = useState({});
  const [showParticipants, setShowParticipants] = useState({});

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get("http://localhost:5000/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch {
        setErrorMsg("Unable to fetch dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleShowParticipants = async (eventId) => {
    setShowParticipants((prev) => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
    if (!participants[eventId]) {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get(
          `http://localhost:5000/api/events/${eventId}/participants`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setParticipants((prev) => ({
          ...prev,
          [eventId]: res.data.participants
        }));
      } catch {
        setParticipants((prev) => ({
          ...prev,
          [eventId]: []
        }));
      }
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "80px" }}>Loading...</div>;
  }
  if (errorMsg) {
    return (
      <div style={{ textAlign: "center", marginTop: "80px" }}>
        <span
          style={{
            background: "#ffe5e5",
            color: "#d32f2f",
            padding: "16px 24px",
            borderRadius: "12px"
          }}
        >
          {" "}
          ! {errorMsg}
        </span>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 0", minHeight: "100vh", background: "#f6f7fb" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={cardStyle}>
          <div style={{ color: "#1e3a8a", fontWeight: "bold", fontSize: "22px" }}>Events</div>
          <div style={{ fontSize: "42px", fontWeight: "bold", marginTop: 8 }}>{stats.events_count}</div>
        </div>
        <div style={cardStyle}>
          <div style={{ color: "#1e3a8a", fontWeight: "bold", fontSize: "22px" }}>Organizers</div>
          <div style={{ fontSize: "42px", fontWeight: "bold", marginTop: 8 }}>{stats.organizers_count}</div>
        </div>
        <div style={cardStyle}>
          <div style={{ color: "#1e3a8a", fontWeight: "bold", fontSize: "22px" }}>Participants</div>
          <div style={{ fontSize: "42px", fontWeight: "bold", marginTop: 8 }}>{stats.participants_count}</div>
        </div>
        <div style={cardStyle}>
          <div style={{ color: "#1e3a8a", fontWeight: "bold", fontSize: "22px" }}>Tickets Sold</div>
          <div style={{ fontSize: "42px", fontWeight: "bold", marginTop: 8 }}>{stats.tickets_sold_count}</div>
        </div>
      </div>
      <h1 style={{ textAlign: "center", margin: "60px 0 24px", fontWeight: 700, fontSize: "36px" }}>
        Organizers &amp; Their Events
      </h1>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {stats.organizers.length === 0 ? (
          <div style={{ textAlign: "center", fontStyle: "italic", color: "#888" }}>No organizers found.</div>
        ) : (
          stats.organizers.map((org) => (
            <div
              key={org.id}
              style={{
                background: "#fff",
                borderRadius: "28px",
                boxShadow: "0 2px 8px rgba(30, 58, 138, 0.08)",
                marginBottom: "32px",
                padding: "28px 32px"
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 20 }}>{org.name}</div>
              <div style={{ color: "#666", marginBottom: 8 }}>{org.email}</div>
              <div style={{ fontWeight: 500, marginBottom: 6 }}>Events:</div>
              {org.events.length === 0 ? (
                <span style={{ color: "#aaa" }}>No event.</span>
              ) : (
                <ul style={{ paddingLeft: 24, marginBottom: 0 }}>
                  {org.events.map((evt) => (
                    <li key={evt.id} style={{ marginBottom: 5 }}>
                      <span style={{ fontWeight: 600 }}>{evt.title}</span>{" "}
                      <span style={{ color: "#444", fontSize: 14 }}>
                        ({evt.date}, {evt.location})
                      </span>
                      <button
                        style={{
                          marginLeft: 8,
                          background: "#fff",
                          color: "#1e88e5",
                          border: "1px solid #1e88e5",
                          borderRadius: 6,
                          padding: "3px 12px",
                          cursor: "pointer"
                        }}
                        onClick={() => handleShowParticipants(evt.id)}
                      >
                        {showParticipants[evt.id] ? "Hide Participants" : "Show Participants"}
                      </button>
                      {showParticipants[evt.id] && (
                        <div
                          style={{
                            marginTop: 8,
                            background: "#f5faff",
                            borderRadius: 8,
                            padding: 10,
                            border: "1px solid #e0e7ef"
                          }}
                        >
                          <strong>Participants:</strong>
                          <ul>
                            {(participants[evt.id] || []).length === 0
                              ? <li style={{ color: "#888" }}>No participants</li>
                              : participants[evt.id].map((p) => (
                                <li key={p.id}>{p.name} ({p.email})</li>
                              ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
