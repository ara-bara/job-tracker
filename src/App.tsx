import "./App.css";
import type {
  JobApplication,
  ApplicationStatus,
  NewApplicationData,
} from "./types/application";
import ApplicationCard from "./components/ApplicationCard";
import { useState } from "react";
import ApplicationForm from "./components/ApplicationForm";

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
type SortOrder = "newest" | "oldest";
function App() {
  const [applications, setApplications] =
    useState<JobApplication[]>(initialApplications);

  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">(
    "all",
  );
  const [editingId, setEditingId] = useState<number | null>(null);
  function handleDelete(id: number): void {
    setApplications((prev) =>
      prev.filter((application) => application.id !== id),
    );
    if (id === editingId) {
      setEditingId(null);
    }
  }

  function handleStatusChange(id: number, status: ApplicationStatus): void {
    setApplications((prev) =>
      prev.map((application) => {
        if (application.id === id) {
          return { ...application, status };
        }
        return application;
      }),
    );
  }

  const query = search.trim().toLowerCase();
  const filteredApplications = applications.filter(
    (filtered) =>
      (filtered.company.toLowerCase().includes(query) ||
        filtered.position.toLowerCase().includes(query)) &&
      (statusFilter === "all" || filtered.status === statusFilter),
  );
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (sortOrder === "oldest") return a.appliedAt.localeCompare(b.appliedAt);
    else return b.appliedAt.localeCompare(a.appliedAt);
  });
  function handleAdd(data: NewApplicationData): void {
    const newApplication: JobApplication = {
      id: Date.now(),
      ...data,
      status: "applied",
    };
    setApplications((prev) => [...prev, newApplication]);
  }
  function handleUpdate(id: number, data: NewApplicationData): void {
    setApplications((prev) =>
      prev.map((application) => {
        if (application.id === id) {
          return { ...application, ...data };
        }
        return application;
      }),
    );
  }
  const editingApplication = applications.find(
    (application) => application.id === editingId,
  );
  function handleSave(data: NewApplicationData): void {
    if (editingId !== null) {
      handleUpdate(editingId, data);
    } else handleAdd(data);
    setEditingId(null);
  }
  return (
    <main>
      <div className="eyebrow">ТВІЙ НАСТУПНИЙ КРОК</div>
      <h1>
        Job Tracker<span className="title-dot">.</span>
      </h1>
      <p>Мої відгуки на вакансії</p>
      <ApplicationForm
        onSave={handleSave}
        onCancel={() => setEditingId(null)}
        initialData={editingApplication}
        key={editingId ?? "new"}
      />
      <section className="filters" aria-label="Пошук і фільтри">
        <div className="filter-field">
          <label htmlFor="search">Пошук відгуків</label>
          <input
            id="search"
            type="search"
            placeholder="Компанія або посада"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="filter-field">
          <label htmlFor="statusFilter">Фільтр за статусом</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as ApplicationStatus | "all")
            }
          >
            <option value="all">Усі статуси</option>
            <option value="applied">Відгук надіслано</option>
            <option value="interview">Співбесіда</option>
            <option value="offer">Пропозиція роботи</option>
            <option value="rejected">Відмова</option>
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="sortOrder">Сортування</label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value as SortOrder)}
          >
            <option value="newest">Спочатку нові</option>
            <option value="oldest">Спочатку старі</option>
          </select>
        </div>
      </section>
      <div className="list-heading">
        <h2>Мої відгуки</h2>
        <span>
          Показано {filteredApplications.length} із {applications.length}
        </span>
      </div>
      {applications.length === 0 ? (
        <p className="empty-state">Ви ще не додали жодного відгуку</p>
      ) : filteredApplications.length === 0 ? (
        <p className="empty-state">За вашим запитом нічого не знайдено</p>
      ) : (
        <ul>
          {sortedApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              onEdit={setEditingId}
            ></ApplicationCard>
          ))}
        </ul>
      )}
    </main>
  );
}

export default App;
