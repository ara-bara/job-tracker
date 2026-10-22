import type { NewApplicationData } from "../types/application";
import { useState } from "react";
import type { FormEvent } from "react";

type ApplicationFormProps = {
  onSave: (data: NewApplicationData) => Promise<boolean>;
  initialData?: NewApplicationData;
  onCancel?: () => void;
};
export default function ApplicationForm({
  onSave,
  initialData,
  onCancel,
}: ApplicationFormProps) {
  const [company, setCompany] = useState(initialData?.company ?? "");
  const [position, setPosition] = useState(initialData?.position ?? "");
  const [url, setUrl] = useState(initialData?.url ?? "");
  const [appliedAt, setAppliedAt] = useState(initialData?.appliedAt ?? "");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    if (isSaving === true) return;
    const trimmedCompany = company.trim();
    const trimmedPosition = position.trim();
    if (trimmedCompany === "" || trimmedPosition === "") {
      setError("Вкажіть компанію та посаду");
      return;
    }
    setError("");
    setIsSaving(true);
    try {
      const success = await onSave({
        company: trimmedCompany,
        position: trimmedPosition,
        url,
        appliedAt,
      });

      if (!success) {
        setError("Не вдалося надіслати дані");
        return;
      }
      setCompany("");
      setPosition("");
      setUrl("");
      setAppliedAt("");
    } catch {
      setError("Не вдалося зберегти відгук. Спробуйте ще раз");
    } finally {
      setIsSaving(false);
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <h2 className="form-title">
        {initialData ? "Редагування відгуку" : "Новий відгук"}
      </h2>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
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
      <div className="form-actions">
        <button type="submit" disabled={isSaving}>
          {isSaving
            ? "Збереження...."
            : initialData
              ? "Зберегти зміни"
              : "Додати відгук"}
        </button>

        {initialData && onCancel && (
          <button type="button" className="button-secondary" onClick={onCancel}>
            Скасувати
          </button>
        )}
      </div>
    </form>
  );
}
