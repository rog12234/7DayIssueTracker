import { useState } from "react";
import LocationPicker from "./LocationPicker";

export type Issue = {
  id: string;
  title: string;
  category: string;
  status: string;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: string;
};

export type IssueInput = Omit<Issue, "id" | "createdAt"> & {
  progressComment?: string;
  author?: string;
};

type NewIssueCardProps = {
  issueToEdit?: Issue;
  onSaveIssue: (issue: IssueInput) => void | Promise<void>;
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

  const [progressComment, setProgressComment] = useState("");
  const [author, setAuthor] = useState("");

  const statusChanged =
    isEditing && status !== issueToEdit?.status;

  const [isSaving, setIsSaving] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);

  const [latitude, setLatitude] = useState<number | null>(issueToEdit?.latitude ?? null);

  const [longitude, setLongitude] = useState<number | null>(issueToEdit?.longitude ?? null);

  const savedLatitude = issueToEdit?.latitude ?? null;

  const savedLongitude = issueToEdit?.longitude ?? null;

  const [mapResetCount, setMapResetCount] = useState(0);

  const locationHasChanged = latitude !== savedLatitude || longitude !== savedLongitude;

  async function handleSubmit(
    e: React.SubmitEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!title.trim() || isSaving) return;

    setIsSaving(true);
    setFormError(null);

    try {
      const issueData: IssueInput = {
        title: title.trim(),
        category,
        status,
        description: description.trim() || undefined,
        latitude,
        longitude,
      };

      // Only include progress information during status changes
      if (statusChanged) {
        issueData.progressComment =
          progressComment.trim() || undefined;

        issueData.author =
          author.trim() || undefined;
      }

      await onSaveIssue(issueData);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={() => {
      if (!isSaving) onClose();
    }}>
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

          <div className="location-section">
            <h3>Issue Location (optional)</h3>

            <p>
              Click the map to select where the issue is located.
            </p>

            <LocationPicker
              key={`${issueToEdit?.id ?? "new"}-${mapResetCount}`}
              latitude={latitude}
              longitude={longitude}
              onChange={(lat, lng) => {
                setLatitude(lat);
                setLongitude(lng);
              }}
            />

            <div className="location-actions">
              <button
                type="button"
                onClick={() => {
                  setLatitude(null);
                  setLongitude(null);
                }}
                disabled={latitude === null && longitude === null}
              >
                Clear Location
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setLatitude(savedLatitude);
                    setLongitude(savedLongitude);
                    setMapResetCount((previous) => previous + 1);
                  }}
                  disabled={!locationHasChanged}
                >
                  Reset Location
                </button>
              )}
            </div>
          </div>

          {statusChanged && (
            <div className="progress-fields">
              <label htmlFor="progress-comment">
                Progress Comment (optional)
              </label>

              <textarea
                id="progress-comment"
                value={progressComment}
                onChange={(e) => setProgressComment(e.target.value)}
                placeholder="Describe the progress made..."
                maxLength={2000}
                rows={3}
              />

              <label htmlFor="progress-author">
                Updated By (optional)
              </label>

              <input
                id="progress-author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Employee name"
              />
            </div>
          )}
          {formError && (
            <p className="form-error" role="alert">
              {formError}
            </p>
          )}
          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving || !title.trim()}
            >
              {isSaving
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Add Issue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}