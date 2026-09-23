import type { JobApplication } from "../types/application";

type ApplicationCardProps = {
  application: JobApplication;
  onDelete: (id: number) => void;
};

export default function ApplicationCard({
  application,
  onDelete,
}: ApplicationCardProps) {
  return (
    <li className="application-card">
      <h2>{application.company}</h2>
      <p>{application.position}</p>
      <span className={`status status--${application.status}`}>{application.status}</span>
      <p className="application-date">Дата відгуку · {application.appliedAt}</p>
      <a href={application.url} target="_blank" rel="noopener noreferrer">
        Відкрити вакансію
      </a>
      <button type="button" onClick={() => onDelete(application.id)} aria-label={`Видалити відгук у ${application.company}`}>Видалити</button>
    </li>
  );
}
