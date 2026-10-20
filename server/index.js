import express from "express";

const app = express();
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "Server is working" });
});

const applications = [
  {
    id: 1,
    company: "Google",
    position: "Junior Fullstack Developer",
    url: "https://google.com",
    appliedAt: "2026-10-19",
    status: "applied",
  },
];

app.get("/api/applications/:id", (req, res) => {
  const id = Number(req.params.id);

  const application = applications.find((item) => item.id === id);

  if (!application) {
    return res.status(404).json({ message: "Відгук не знайдено" });
  }

  res.json(application);
});

app.post("/api/applications", (req, res) => {
  const { company, position, url, appliedAt } = req.body ?? {};

  if (typeof company !== "string" || company.trim() === "") {
    return res.status(400).json({
      message: "Компанія має бути непорожнім рядком",
    });
  }
  if (typeof position !== "string" || position.trim() === "") {
    return res.status(400).json({
      message: "Посада має бути непорожнім рядком",
    });
  }
  const newApplication = {
    id: Date.now(),
    company: company,
    position: position,
    url: url,
    appliedAt: appliedAt,
    status: "applied",
  };

  applications.push(newApplication);

  res.status(201).json(newApplication);
});

app.get("/api/applications", (req, res) => res.json(applications));

app.delete("/api/applications/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = applications.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Відгук не знайдено" });
  }
  applications.splice(index, 1);
  res.status(204).end();
});

app.patch("/api/applications/:id", (req, res) => {
  const id = Number(req.params.id);
  const status = req.body?.status;
  const application = applications.find((item) => item.id === id);
  const allowedStatuses = ["applied", "interview", "offer", "rejected"];
  if (!application)
    return res.status(404).json({ message: "Відгук не знайдено" });
  if (status !== undefined) {
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Некоректний статус" });
    }

  }
  const company = req.body?.company;
  if (company !== undefined) {
    if (typeof company !== "string" || company.trim() === "") {
      return res.status(400).json({ message: "Некоректні вхідні дані" });
    }
  }

  const position = req.body?.position;
  if (position !== undefined) {
    if (typeof position !== "string" || position.trim() === "") {
      return res.status(400).json({ message: "Некоректні вхідні дані" });
    }
  }

  const appliedAt = req.body?.appliedAt;
  if (appliedAt !== undefined) {
    if (typeof appliedAt !== "string" || appliedAt.trim() === "") {
      return res.status(400).json({ message: "Некоректні вхідні дані" });
    }
  }

  const url = req.body?.url;
  if (url !== undefined) {
    if (typeof url !== "string" || url.trim() === "") {
      return res.status(400).json({ message: "Некоректні вхідні дані" });
    }
  }

  if (status !== undefined) application.status = status;
  if (company !== undefined) application.company = company;
  if (position !== undefined) application.position = position;
  if (appliedAt !== undefined) application.appliedAt = appliedAt;
  if (url !== undefined) application.url = url;

  res.json(application);
});

app.listen(3000, () => {
  console.log("Server: http://localhost:3000");
});
