import express from "express";
import cors from "cors";

const app = express();
app.use(cors({ origin: "*", methods: ["POST", "GET", "DELETE", "PUT"] }));
app.use(express.json());

let projects = [
  { id: 1, name: "Todo List" },
  { id: 2, name: "Weather App" },
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

  if (!name || name.length < 3) {
    return res.status(400).json({ message: "Project name must be at least 3 characters" });
  }

  if (projects.some(p => p.name.toLowerCase() === name.toLowerCase())) {
    return res.status(400).json({ message: "Project name already exists" });
  }

  const newProject = { id: projects.length + 1, name };
  projects.push(newProject);
  res.status(201).json(newProject);
});

// Update project name
app.put("/api/projects/:id", (req, res) => {
  const projectId = parseInt(req.params.id);
  const { name } = req.body;

  const project = projects.find(p => p.id === projectId);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  if (!name || name.length < 3) {
    return res.status(400).json({ message: "Project name must be at least 3 characters" });
  }

  if (projects.some(p => p.id !== projectId && p.name.toLowerCase() === name.toLowerCase())) {
    return res.status(400).json({ message: "Project name already exists" });
  }

  project.name = name;
  res.json({ message: "Project updated", project });
});

// Delete project
app.delete("/api/projects/:id", (req, res) => {
  const projectId = parseInt(req.params.id);
  const projectIndex = projects.findIndex(p => p.id === projectId);

  if (projectIndex === -1) {
    return res.status(404).json({ message: "Project not found" });
  }

  const deletedProject = projects.splice(projectIndex, 1)[0];
  res.json({ message: "Project deleted", deletedProject });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
