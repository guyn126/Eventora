import React, { useEffect, useState } from "react";
import axios from "axios";

const OrganizerListPage = () => {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchOrganizers = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          "http://localhost:5000/api/admin/organizers",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrganizers(response.data);
      } catch {
        setFetchError("Unable to fetch organizers.");
      }
      setLoading(false);
    };
    fetchOrganizers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this organizer?")) return;
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`http://localhost:5000/api/admin/organizers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrganizers((prev) => prev.filter((org) => org.id !== id));
    } catch {
      alert("Failed to delete organizer.");
    }
  };

  if (loading) return <div style={{ textAlign: "center", marginTop: 64 }}>Loading...</div>;

  if (fetchError)
    return (
      <div style={{ textAlign: "center", marginTop: 64 }}>
        <div style={{ background: "#ffeaea", color: "#d32f2f", padding: 16, borderRadius: 8, display: "inline-block" }}>
          <b>!</b> {fetchError}
        </div>
      </div>
    );

  if (!organizers.length)
    return <div style={{ textAlign: "center", marginTop: 64 }}>No organizers found.</div>;

  return (
    <div style={{ padding: 32 }}>
      <h2 style={{ marginBottom: 24 }}>Organizers</h2>
      <ul>
        {organizers.map((org) => (
          <li key={org.id} style={{ marginBottom: 16 }}>
            <b>{org.name}</b> ({org.email})
            <button
              style={{ marginLeft: 12, color: "#d32f2f" }}
              onClick={() => handleDelete(org.id)}
            >
              Delete
            </button>
          
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrganizerListPage;
