import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Issue } from "./NewIssueCard";
import IssueMap from "./IssueMap";

type IssueComment = {
  id: string;
  issueId: string;
  text: string;
  createdAt: string;
  author: string | null;
  previousStatus: string | null;
  newStatus: string | null;
};

type IssueDetailsProps = {
  issue: Issue;
  onClose: () => void;
};

export default function IssueDetails({ issue, onClose }: IssueDetailsProps) {

  const [comments, setComments] = useState<IssueComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [commentText, setCommentText] = useState("");
  const [author, setAuthor] = useState("");

  const [isPosting, setIsPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadComments() {
      setLoading(true);
      setError(null);
      setComments([]);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/issues/${issue.id}/comments`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to load progress comments.");
        }

        const data: IssueComment[] = await response.json();

        if (!controller.signal.aborted) {
          setComments(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : "An unexpected error occurred."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadComments();

    return () => controller.abort();
  }, [issue.id]);

  async function handleCommentSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!commentText.trim() || isPosting) return;

    setIsPosting(true);
    setPostError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/issues/${issue.id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: commentText.trim(),
            author: author.trim() || null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to add comment: ${response.status}`
        );
      }

      const savedComment: IssueComment = await response.json();

      setComments((previousComments) => [
        savedComment,
        ...previousComments,
      ]);

      setCommentText("");
      setShowHistory(true);

    } catch (err) {
      setPostError(
        err instanceof Error
          ? err.message
          : "Unable to post comment."
      );
    } finally {
      setIsPosting(false);
    }
  }

  const amountOfComments: number = comments.length;

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
        <IssueMap issue={issue} />
        <section className="progress-section">
          <button
            type="button"
            className="progress-toggle"
            onClick={() => setShowHistory((previous) => !previous)}
            aria-expanded={showHistory}
            aria-controls="progress-history-content"
          >
            <span>Progress History ({amountOfComments})</span>
            <span aria-hidden="true">
              {showHistory ? "▲" : "▼"}
            </span>
          </button>

          {showHistory && (
            <div id="progress-history-content">
              {loading && <p>Loading comments...</p>}

              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}

              {!loading && !error && comments.length === 0 && (
                <p>No progress updates have been recorded yet.</p>
              )}

              {!loading && !error && (
                <div className="progress-list">
                  {comments.map((comment) => (
                    <article
                      className="progress-comment"
                      key={comment.id}
                    >
                      <div className="progress-comment-header">
                        <strong>{comment.author || "Anonymous"}</strong>

                        <time dateTime={comment.createdAt}>
                          {new Date(comment.createdAt).toLocaleString()}
                        </time>
                      </div>

                      {comment.previousStatus && comment.newStatus && (
                        <p className="progress-status-change">
                          {comment.previousStatus} → {comment.newStatus}
                        </p>
                      )}

                      <p className="progress-comment-text">
                        {comment.text}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
        <section>
          <h3>Add Progress Comment</h3>

          <form
            className="progress-form"
            onSubmit={handleCommentSubmit}
          >
            <label htmlFor="comment-text">Comment</label>

            <textarea
              id="comment-text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a progress update..."
              maxLength={2000}
              rows={3}
              required
            />

            <label htmlFor="comment-author">
              Your Name (optional)
            </label>

            <input
              id="comment-author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter your name"
            />

            {postError && (
              <p className="form-error" role="alert">
                {postError}
              </p>
            )}

            <button
              type="submit"
              disabled={isPosting || !commentText.trim()}
            >
              {isPosting ? "Posting..." : "Post Comment"}
            </button>
          </form>
        </section>
        <div className="modal-actions">
          <button type="button" onClick={onClose}>Close</button>
        </div>
      </section>
    </div>
  );
}
