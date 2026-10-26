import express from "express";
import { pool } from "./db.js";
const app = express();
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "Server is working" });
});

app.get("/api/applications/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: "Некоректний id" });
  }
  try {
    const result = await pool.query(
      `SELECT id,company,position,url,to_char(applied_at,'YYYY-MM-DD') as "appliedAt",status FROM applications WHERE id=$1`,
      [id],
    );

    const application = result.rows[0];

    if (!application) {
      return res.status(404).json({ message: "Відгук не знайдено" });
    }

    return res.json(application);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Не вдалося завантажити відгук" });
  }
});

app.post("/api/applications", async (req, res) => {
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
  if (typeof appliedAt !== "string" || appliedAt.trim() === "") {
    return res.status(400).json({
      message: "Дата має бути непорожнім рядком",
    });
  }

  if (typeof url !== "string" || url.trim() === "") {
    return res.status(400).json({
      message: "Посилання має бути непорожнім рядком",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO applications (company, position, url, applied_at, status)
   VALUES ($1, $2, $3, $4, $5)
   RETURNING id, company, position, url,
     to_char(applied_at, 'YYYY-MM-DD') AS "appliedAt", status`,
      [company, position, url, appliedAt, "applied"],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "22007" || error.code === "22008") {
      return res.status(400).json({ message: "Некоректна дата" });
    }

    console.error(error);
    return res.status(500).json({ message: "Не вдалося додати відгук" });
  }
});

app.get("/api/applications", async (req, res) => {
  try {
    const result = await pool.query(`SELECT id, company, position, url,
       to_char(applied_at, 'YYYY-MM-DD') AS "appliedAt",
       status
FROM applications
ORDER BY id;`);
    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Не вдалося завантажити відгуки" });
  }
});

app.delete("/api/applications/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: "Некоректний id" });
  }
  try {
    const result = await pool.query(
      `DELETE FROM applications WHERE id=$1 RETURNING id`,
      [id],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Відгук не знайдено" });
    }

    return res.status(204).end();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Не вдалося видалити відгук" });
  }
});

app.patch("/api/applications/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: "Некоректний id" });
  }

  const { status, company, position, url, appliedAt } = req.body ?? {};
  const allowedStatuses = ["applied", "interview", "offer", "rejected"];

  if (status !== undefined && !allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Некоректний статус" });
  }

  for (const value of [company, position, url, appliedAt]) {
    if (
      value !== undefined &&
      (typeof value !== "string" || value.trim() === "")
    ) {
      return res.status(400).json({ message: "Некоректні вхідні дані" });
    }
  }

  try {
    const result = await pool.query(
      `UPDATE applications
       SET status = COALESCE($1, status),
           company = COALESCE($2, company),
           position = COALESCE($3, position),
           url = COALESCE($4, url),
           applied_at = COALESCE($5::date, applied_at)
       WHERE id = $6
       RETURNING id, company, position, url,
         to_char(applied_at, 'YYYY-MM-DD') AS "appliedAt", status`,
      [status, company, position, url, appliedAt, id],
    );

    const application = result.rows[0];

    if (!application) {
      return res.status(404).json({ message: "Відгук не знайдено" });
    }

    return res.json(application);
  } catch (error) {
    if (error.code === "22007" || error.code === "22008") {
      return res.status(400).json({ message: "Некоректна дата" });
    }

    console.error(error);
    return res.status(500).json({ message: "Не вдалося оновити відгук" });
  }
});

app.listen(3000, () => {
  console.log("Server: http://localhost:3000");
});
