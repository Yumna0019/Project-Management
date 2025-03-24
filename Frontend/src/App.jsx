import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api/projects";

function App() {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [editProjectId, setEditProjectId] = useState(null);
  const [editProjectName, setEditProjectName] = useState("");
  const [error, setError] = useState("");

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const response = await axios.get(API_URL);
      setProjects(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message ||"Error fetching projects.");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Add project
  const addProject = async () => {
    if (projectName.length < 3) {
      setError("Project name must be at least 3 characters");
      return;
    }

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
      setError(err.response?.data?.message ||"Error deleting project.");
    }
  };

  // Update project
  const updateProject = async () => {
    if (editProjectName.length < 3) {
      setError("Project name must be at least 3 characters");
      return;
    }

    try {
      await axios.put(`${API_URL}/${editProjectId}`, { name: editProjectName });
      setProjects(
        projects.map(project =>
          project.id === editProjectId ? { ...project, name: editProjectName } : project
        )
      );
      setEditProjectId(null);
      setEditProjectName("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error updating project.");
    }
  };

  return (
    <div className="container">
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
            {editProjectId === project.id ? (
              <>
                <input
                  type="text"
                  value={editProjectName}
                  onChange={(e) => setEditProjectName(e.target.value)}
                  placeholder="Project name"
                />
                <button className="add" onClick={updateProject}>Save</button>
                <button className="cancel"  onClick={() => setEditProjectId(null)}>Cancel</button>
              </>
            ) : (
              <>
                {project.name} 
                <button className="delete" onClick={() => { setEditProjectId(project.id); setEditProjectName(project.name); }}>✏️</button>
                <button className="delete" onClick={() => deleteProject(project.id)}>❌</button>
              </>
            )}
          </li>
        ))}
      </ol>

      <button className="add" onClick={fetchProjects}>Refresh Projects</button>
    </div>
  );
}

export default App;
