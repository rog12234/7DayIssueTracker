import { useState } from "react";

export type Issue = {
  id: string;
  title: string;
  category: string;
  status: string;
  description?: string;
  latitude?: number;
  longitude?: number;
};

type NewIssueCardProps = {
  issueToEdit?: Issue;
  onSaveIssue: (issue: Omit<Issue, "id">) => void;
  onClose: () => void;
};

export default function NewIssueCard({
  issueToEdit,
  onSaveIssue,
  onClose,
}: NewIssueCardProps) {

  const isEditing = !!issueToEdit;

  const [title, setTitle] = useState(
    issueToEdit?.title ?? ""
  );

  const [category, setCategory] = useState(
    issueToEdit?.category ?? "Infrastructure"
  );

  const [status, setStatus] = useState(
    issueToEdit?.status ?? "Open"
  );

  const [description, setDescription] = useState(
    issueToEdit?.description ?? ""
  );

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim()) return;

    onSaveIssue({
      title: title.trim(),
      category,
      status,
      description: description.trim() || undefined,
      latitude: issueToEdit?.latitude,
      longitude: issueToEdit?.longitude,
    });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-issue-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="new-issue-title">
          {isEditing ? "Edit Issue" : "Add New Issue"}
        </h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="issue-title">Title</label>
          <input
            id="issue-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label htmlFor="issue-description">Description (optional)</label>
          <textarea
            id="issue-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue in more detail..."
            rows={4}
          />

          <label htmlFor="issue-category">Category</label>
          <select
            id="issue-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Electrical">Electrical</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Infrastructure/Waste Management">Infrastructure / Waste Management</option>
            <option value="Drainage">Drainage</option>
            <option value="Other">Other</option>
          </select>

          <label htmlFor="issue-status">Status</label>
          <select
            id="issue-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">
              {isEditing ? "Save Changes" : "Add Issue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}