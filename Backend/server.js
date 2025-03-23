import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let projects = [
  { id: 1, name: "Project Alpha" },
  { id: 2, name: "Project Beta" },
];

// Get total number of projects
app.get("/api/projects/count", (req, res) => {
  res.json({ count: projects.length });
});

// Get all projects
app.get("/api/projects", (req, res) => {
  res.json(projects);
});

// Add a new project
app.post("/api/projects", (req, res) => {
  const { name } = req.body;

  // Validation: Name must be at least 3 characters
  if (!name || name.length < 3) {
    return res.status(400).json({ status: "error", message: "Project name must be at least 3 characters" });
  }

  // Check for duplicate names (case-insensitive)
  if (projects.some(p => p.name.toLowerCase() === name.toLowerCase())) {
    return res.status(400).json({ status: "error", message: "Project name already exists" });
  }

  const newProject = { id: projects.length + 1, name };
  projects.push(newProject);
  res.json(newProject);
});

// Delete a project
app.delete("/api/projects/:id", (req, res) => {
  const projectId = parseInt(req.params.id);
  const projectIndex = projects.findIndex(p => p.id === projectId);

  if (projectIndex === -1) {
    return res.status(404).json({ status: "error", message: "Project not found" });
  }

  const deletedProject = projects.splice(projectIndex, 1)[0];
  res.json(deletedProject);
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
