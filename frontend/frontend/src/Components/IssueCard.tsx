type IssueCardProps = {
  title: string;
  category: string;
  status: string;
};

export default function IssueCard({
  title,
  category,
  status,
}: IssueCardProps) {

  const statusClass = status.toLowerCase().replace(/\s+/g, "-");

  return (
    <article className="issue-card">
      <h4>{title}</h4>
      <p className="category">Category: {category}</p>
      <p className={`status ${statusClass}`}>
        Status: {status}</p>
    </article>
  );
}