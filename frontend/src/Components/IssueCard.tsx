type IssueCardProps = {
  id: string;
  title: string;
  category: string;
  status: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function IssueCard({
  id,
  title,
  category,
  status,
  onEdit,
  onDelete,
}: IssueCardProps) {

  const statusClass = status.toLowerCase().replace(/\s+/g, "-");

  return (
    <article className="issue-card">
      <h4>{title}</h4>
      <p className="category">Category: {category}</p>
      <p className={`status ${statusClass}`}> Status: {status}</p>
      <div className="buttons-list">
        <button className="edit-button" onClick={() => onEdit(id)}>
          Edit Issue
        </button>
        <button className="delete-button" onClick={() => onDelete(id)}>
          Remove Issue
        </button>
      </div>
    </article>
  );
}