import type { Issue } from "./NewIssueCard";

type IssueDetailsProps = {
  issue: Issue;
  onClose: () => void;
};

export default function IssueDetails({ issue, onClose }: IssueDetailsProps) {
  const hasLocation =
    typeof issue.latitude === "number" &&
    typeof issue.longitude === "number";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <section
        className="modal issue-details-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="issue-details-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="issue-details-header">
          <h2 id="issue-details-title">{issue.title}</h2>
          <button
            type="button"
            className="details-close"
            onClick={onClose}
            aria-label="Close issue details"
          >
            ×
          </button>
        </div>

        <div className="issue-details-meta">
          <p><strong>Category:</strong> {issue.category}</p>
          <p><strong>Status:</strong> {issue.status}</p>
        </div>

        <h3>Description</h3>
        <p className="issue-description">
          {issue.description || "No description provided."}
        </p>

        <h3>Issue location</h3>
        <div className="map-placeholder">
          <span className="map-placeholder-icon" aria-hidden="true">📍</span>
          <strong>Map preview</strong>
          <p>Interactive map will be added during the GIS exercise.</p>
          <p>
            {hasLocation
              ? `Coordinates: ${issue.latitude}, ${issue.longitude}`
              : "Location not assigned yet."}
          </p>
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose}>Close</button>
        </div>
      </section>
    </div>
  );
}
