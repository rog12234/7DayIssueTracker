import IssueCard from "../Components/IssueCard";
import { useEffect, useState } from "react"; //useEffect, allows React to synchronize a component with an external system, such as a REST API
import NewIssueCard from "../Components/NewIssueCard";
import IssueDetails from "../Components/IssueDetails";
import type { Issue, IssueInput, } from "../Components/NewIssueCard";
import '../App.css'



export default function IssuesPage() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showNewIssue, setShowNewIssue] = useState(false);
    const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
    const [statusFilter, setStatusFilter] = useState("All");
    const [viewingIssueId, setViewingIssueId] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController(); //AbortController cancels outdated requests during cleanup.

        async function loadIssues() {
            try {
                setLoading(true);
                setError(null);
                //Sends an HTTP GET request to your ASP.NET Core backend.
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/issues`,
                    { signal: controller.signal }
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to retrieve issues: ${response.status}`
                    );
                }
                //Converts the JSON response into JavaScript objects, which TypeScript treats as an array of Issue objects.
                const data: Issue[] = await response.json();

                setIssues(data);
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

        loadIssues();

        return () => controller.abort();
    }, []);

    async function addIssue(newIssue: Omit<Issue, "id">) {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/issues`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...newIssue,
                    description: newIssue.description ?? null,
                    latitude: newIssue.latitude ?? null,
                    longitude: newIssue.longitude ?? null,
                }),
            }
        );

        if (!response.ok) {
            const errorMessage = await response.text();

            throw new Error(
                errorMessage || `Failed to create issue: ${response.status}`
            );
        }

        const savedIssue: Issue = await response.json();

        setIssues((previousIssues) => [
            ...previousIssues,
            savedIssue,
        ]);

        setShowNewIssue(false);
    }

    async function deleteIssue(id: string) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this issue?"
        );

        if (!confirmed) return;

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/issues/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to delete issue: ${response.status}`
                );
            }

            setIssues((previousIssues) =>
                previousIssues.filter((issue) => issue.id !== id)
            );

            setViewingIssueId((currentId) =>
                currentId === id ? null : currentId
            );
        } catch (error) {
            console.error("Delete failed:", error);

            window.alert(
                "Could not delete the issue. Please try again."
            );
        }
    }

    function startEditing(id: string) {
        const selectedIssue = issues.find(
            (issue) => issue.id === id
        );

        if (selectedIssue) {
            setEditingIssue(selectedIssue);
        }
    }

    async function updateIssue(updatedDetails: IssueInput) {
        if (!editingIssue) return;

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/issues/${editingIssue.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedDetails),
            }
        );

        if (!response.ok) {
            const errorMessage = await response.text();

            throw new Error(
                errorMessage ||
                `Failed to update issue: ${response.status}`
            );
        }

        // Update the existing issue in React state
        setIssues((previousIssues) =>
            previousIssues.map((issue) =>
                issue.id === editingIssue.id
                    ? {
                        ...issue,
                        title: updatedDetails.title,
                        category: updatedDetails.category,
                        status: updatedDetails.status,
                        description: updatedDetails.description,
                        latitude: updatedDetails.latitude,
                        longitude: updatedDetails.longitude,
                    }
                    : issue
            )
        );

        setEditingIssue(null);
    }

    const viewingIssue = issues.find((issue) => issue.id === viewingIssueId);

    const filteredIssues = issues.filter((issue) => {
        return statusFilter === "All" || issue.status === statusFilter;
    });

    return (
        <main className="issues-page">
            <h1>Municipality Issue Tracker</h1>

            <div className="issue-toolbar">
                <button onClick={() => setShowNewIssue(true)}>
                    Add Issue
                </button>

                <div className="filter-group">
                    <label htmlFor="status-filter">Filter by status:</label>

                    <select
                        id="status-filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>
            </div>
            {loading && (
                <p role="status">Loading issues...</p>
            )}

            {error && (
                <p role="alert" className="error-message">
                    {error}
                </p>
            )}

            {!loading && !error && filteredIssues.length === 0 && (
                <p>No issues found.</p>
            )}

            {!loading && !error && (
                <div className="issue-list">
                    {filteredIssues.map((issue) => (
                        <IssueCard
                            key={issue.id}
                            id={issue.id}
                            title={issue.title}
                            category={issue.category}
                            status={issue.status}
                            onView={setViewingIssueId}
                            onEdit={startEditing}
                            onDelete={deleteIssue}
                        />
                    ))}
                </div>
            )}
            {viewingIssue && (
                <IssueDetails
                    issue={viewingIssue}
                    onClose={() => setViewingIssueId(null)}
                />
            )}

            {showNewIssue && (
                <NewIssueCard
                    onSaveIssue={addIssue}
                    onClose={() => setShowNewIssue(false)}
                />
            )}

            {editingIssue && (
                <NewIssueCard
                    key={editingIssue.id}
                    issueToEdit={editingIssue}
                    onSaveIssue={updateIssue}
                    onClose={() => setEditingIssue(null)}
                />
            )}
        </main>
    );
}