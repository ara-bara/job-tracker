import "./App.css";
import type {
  JobApplication,
  ApplicationStatus,
  NewApplicationData,
} from "./types/application";
import ApplicationCard from "./components/ApplicationCard";
import { useState, useEffect } from "react";
import ApplicationForm from "./components/ApplicationForm";

type SortOrder = "newest" | "oldest";
function App() {
  const [applications, setApplications] = useState<JobApplication[]>([]);

  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">(
    "all",
  );
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loadError, setLoadError] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    async function loadApplications() {
      try {
        const response = await fetch("/api/applications");
        if (!response.ok) throw new Error("Не вдалося завантажити відгуки");
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error(error);
        setLoadError("Не вдалося завантажити відгуки");
      } finally {
        setIsLoading(false);
      }
    }
    loadApplications();
  }, []);

  async function handleDelete(id: number): Promise<void> {
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        console.error("Не вдалося видалити відгук");
        return;
      }
      setApplications((prev) =>
        prev.filter((application) => application.id !== id),
      );
      if (id === editingId) {
        setEditingId(null);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleStatusChange(
    id: number,
    status: ApplicationStatus,
  ): Promise<void> {
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        console.error("Не вдалося оновити статус відгуку");
        return;
      }
      setApplications((prev) =>
        prev.map((application) => {
          if (application.id === id) {
            return { ...application, status };
          }
          return application;
        }),
      );
    } catch (error) {
      console.error(error);
    }
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
  async function handleAdd(data: NewApplicationData): Promise<boolean> {
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        console.error("Не вдалося додати відгук");
        return false;
      }
      const newApplication: JobApplication = await response.json();
      setApplications((prev) => [...prev, newApplication]);
    } catch (error) {
      console.error(error);
      return false;
    }
    return true;
  }
  async function handleUpdate(
    id: number,
    data: NewApplicationData,
  ): Promise<boolean> {
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        console.error("Не вдалося оновити відгук");
        return false;
      }
      setApplications((prev) =>
        prev.map((application) => {
          if (application.id === id) {
            return { ...application, ...data };
          }
          return application;
        }),
      );
    } catch (error) {
      console.error(error);
      return false;
    }
    return true;
  }
  const editingApplication = applications.find(
    (application) => application.id === editingId,
  );
  async function handleSave(data: NewApplicationData): Promise<boolean> {
    let success: boolean;
    if (editingId !== null) {
      success = await handleUpdate(editingId, data);
    } else {
      success = await handleAdd(data);
    }
    if (success === true) setEditingId(null);
    return success;
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
      {isLoading ? <p>Завантаження відгуків…</p>: loadError? <p role="alert">{loadError}</p> : applications.length === 0 ? (
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
