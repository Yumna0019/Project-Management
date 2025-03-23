import React, { useState, useEffect} from "react";
import axios from "axios";
import "./App.css";


const API_URL = "http://localhost:5000/api/projects";

function App() {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    try {
        const response = await axios.get(API_URL);
        console.log("Fetched Projects:", response.data);  // Debugging log
        setProjects(response.data);
        setError(""); // Clear previous errors
    } catch (err) {
        console.error("Error fetching projects:", err);
        setError(err.response?.data?.message || "Error fetching projects.");
    }
  };


  // Fetch total project count
  const fetchProjectCount = async () => {
    try {
      const response = await axios.get(`${API_URL}/count`);
      console.log(`Total projects: ${response.data.count}`);
    } catch (err) {
      setError(err.response?.data?.message);
      console.error("Error fetching project count");
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchProjectCount();
  }, []);

  // Add project
  const addProject = async () => {
    try {
      const response = await axios.post(API_URL, { name: projectName });
      setProjects([...projects, response.data]);
      setProjectName("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error adding project.");
    }
  };

  // Delete project
  const deleteProject = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setProjects(projects.filter(project => project.id !== id));
    } catch (err) {
      setError(err.response?.data?.message);
      setError("Error deleting project.");
    }
  };

  return (
    <div className="container" style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Project Manager</h2>

      <input
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        placeholder="Enter project name"
      />
      <button className="add" onClick={addProject}>Add Project</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ol>
        {projects.map((project) => (
          <li key={project.id}>
            {project.name} 
            <button className="delete" onClick={() => deleteProject(project.id)}>❌</button>
          </li>
        ))}
      </ol>

      <button className="add" onClick={fetchProjects}>Refresh Projects</button>
    </div>
  );
}

export default App;
