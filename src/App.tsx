import "./App.css";
import type { JobApplication } from "./types/application";
import ApplicationCard from "./components/ApplicationCard";
import { useState } from "react";
import type { FormEvent } from "react";

const initialApplications: JobApplication[] = [
  {
    id: 0,
    company: "RedWi",
    position: "junior FullStack Developer",
    url: "https://RedWi.com",
    appliedAt: "2026-09-23",
    status: "applied",
  },
  {
    id: 1,
    company: "Fudji",
    position: "junior FullStack Developer",
    url: "https://Fudji.com",
    appliedAt: "2026-02-12",
    status: "interview",
  },
];
function App() {
  const [applications, setApplications] =
    useState<JobApplication[]>(initialApplications);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [url, setUrl] = useState("");
  const [appliedAt, setAppliedAt] = useState("");
  function handleDelete(id: number): void {
    setApplications((prev) =>
      prev.filter((application) => application.id !== id),
    );
  }
  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const trimmedCompany = company.trim();
    const trimmedPosition = position.trim();
    if (trimmedCompany === "" || trimmedPosition === "") return;
    const newApplication: JobApplication = {
      id: Date.now(),
      company: trimmedCompany,
      position: trimmedPosition,
      url: url,
      appliedAt: appliedAt,
      status: "applied",
    };
    setApplications((prev) => [...prev, newApplication]);
    (setCompany(""), setPosition(""), setUrl(""), setAppliedAt(""));
  }
  return (
    <main>
      <div className="eyebrow">ТВІЙ НАСТУПНИЙ КРОК</div>
      <h1>Job Tracker<span className="title-dot">.</span></h1>
      <p>Мої відгуки на вакансії</p>
      <form onSubmit={handleSubmit}>
        <h2 className="form-title">Новий відгук</h2>
        <label htmlFor="company">Компанія</label>
        <input
          required
          id="company"
          type="text"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
        />
        <label htmlFor="position">Посада</label>
        <input
          required
          id="position"
          type="text"
          value={position}
          onChange={(event) => setPosition(event.target.value)}
        />
        <label htmlFor="url">Лінк</label>
        <input
          required
          id="url"
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
        <label htmlFor="appliedAt">Дата</label>
        <input
          required
          id="appliedAt"
          type="date"
          value={appliedAt}
          onChange={(event) => setAppliedAt(event.target.value)}
        />
        <button type="submit">Додати відгук</button>
      </form>

      <div className="list-heading"><h2>Мої відгуки</h2><span>{applications.length} у списку</span></div>
      {applications.length === 0 ? (
        <p className="empty-state">Ви ще не додали жодного відгуку</p>
      ) : (
        <ul>
          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onDelete={handleDelete}
            ></ApplicationCard>
          ))}
        </ul>
      )}
    </main>
  );
}

export default App;
