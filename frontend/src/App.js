import React, { useState, useEffect } from "react";

const API_URL = "https://rwvieqmoph.execute-api.eu-west-2.amazonaws.com/prod";

function App() {
  const [incidents, setIncidents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    severity: "Low",
    file: null
  });

  // Fetch incidents
  const fetchIncidents = async () => {
    const res = await fetch(`${API_URL}/incidents`);
    const data = await res.json();
    setIncidents(data);
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  // Convert file to base64
  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(",")[1];
      setForm(prev => ({ ...prev, file: base64 }));
    };
    reader.readAsDataURL(file);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`${API_URL}/incident`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    // Reset form
    setForm({
      title: "",
      description: "",
      severity: "Low",
      file: null
    });

    fetchIncidents();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🚨 Incident Reporting System</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />
        <br /><br />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
        <br /><br />

        <select
          value={form.severity}
          onChange={e => setForm({ ...form, severity: e.target.value })}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <br /><br />

        <input type="file" onChange={e => handleFile(e.target.files[0])} />
        <br /><br />

        <button type="submit">Submit Incident</button>
      </form>

      <hr />

      <h2>📋 Incidents</h2>

      {incidents.map((i) => (
        <div key={i.incidentId} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <h3>{i.title}</h3>
          <p>{i.description}</p>
          <p><b>Severity:</b> {i.severity}</p>

          {i.imageUrl && (
            <img src={i.imageUrl} alt="" width="200" />
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
