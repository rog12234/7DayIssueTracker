type IssueCardProps = {
  id: string;
  title: string;
  category: string;
  status: string;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function IssueCard({
  id,
  title,
  category,
  status,
  onView,
  onEdit,
  onDelete,
}: IssueCardProps) {
  const statusClass = status.toLowerCase().replace(/\s+/g, "-");

  return (
    <article className="issue-card">
      <button
        type="button"
        className="issue-card-main"
        onClick={() => onView(id)}
        aria-label={`View details for ${title}`}
      >
        <h4>{title}</h4>
        <p className="category">Category: {category}</p>
        <p className={`status ${statusClass}`}>Status: {status}</p>
        <span className="view-details">View full details</span>
      </button>

      <div className="buttons-list">
        <button type="button" className="edit-button" onClick={() => onEdit(id)}>
          Edit Issue
        </button>
        <button type="button" className="delete-button" onClick={() => onDelete(id)}>
          Remove Issue
        </button>
      </div>
    </article>
  );
}
