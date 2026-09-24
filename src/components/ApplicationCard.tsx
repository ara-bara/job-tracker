import type { JobApplication, ApplicationStatus } from "../types/application";

type ApplicationCardProps = {
  application: JobApplication;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: ApplicationStatus) => void;
};

export default function ApplicationCard({
  application,
  onDelete,
  onStatusChange,
}: ApplicationCardProps) {
  return (
    <li className="application-card">
      <h2>{application.company}</h2>
      <p>{application.position}</p>
      <span className={`status status--${application.status}`}>
        {application.status}
      </span>
      <select
        onChange={(event) =>
          onStatusChange(
            application.id,
            event.target.value as ApplicationStatus,
          )
        }
        value={application.status}
        aria-label="Статус відгуку"
      >
        <option value="applied">Відгук надіслано</option>
        <option value="interview">Співбесіда</option>
        <option value="offer">Пропозиція роботи</option>
        <option value="rejected">Відмова</option>
      </select>
      <p className="application-date">Дата відгуку · {application.appliedAt}</p>
      <a href={application.url} target="_blank" rel="noopener noreferrer">
        Відкрити вакансію
      </a>
      <button
        type="button"
        onClick={() => onDelete(application.id)}
        aria-label={`Видалити відгук у ${application.company}`}
      >
        Видалити
      </button>
    </li>
  );
}
