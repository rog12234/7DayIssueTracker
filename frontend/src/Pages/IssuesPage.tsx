import IssueCard from "../Components/IssueCard";
import { useState } from 'react';
import NewIssueCard from "../Components/NewIssueCard";
import IssueDetails from "../Components/IssueDetails";
import type { Issue } from "../Components/NewIssueCard";
import '../App.css'



export default function IssuesPage() {
    const [issues, setIssues] = useState<Issue[]>([
        {
            id: "1",
            title: "Pothole on the main road",
            category: "Infrastructure",
            status: "Open",
        },
        {
            id: "2",
            title: "GEBE left road unpaved",
            category: "Infrastructure",
            status: "In Progress",
        },
        {
            id: "3",
            title: "Broken Streetlight",
            category: "Electrical",
            status: "Closed",
        },
        {
            id: "4",
            title: "Dog waste creating a puddle on the road",
            category: "Infrastructure/Waste Management",
            status: "Open",
        },

    ]);

    const [showNewIssue, setShowNewIssue] = useState(false);
    const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
    const [statusFilter, setStatusFilter] = useState("All");
    const [viewingIssueId, setViewingIssueId] = useState<string | null>(null);

    function addIssue(newIssue: Omit<Issue, "id">) {
        const issue: Issue = {
            ...newIssue,
            id: crypto.randomUUID(),
        };

        setIssues((previousIssues) => [...previousIssues, issue]);
        setShowNewIssue(false);
    }

    function deleteIssue(id: string) {
        setIssues((previousIssues) =>
            previousIssues.filter((issue) => issue.id !== id)
        );
    }

    function startEditing(id: string) {
        const selectedIssue = issues.find(
            (issue) => issue.id === id
        );

        if (selectedIssue) {
            setEditingIssue(selectedIssue);
        }
    }

    function updateIssue(updatedDetails: Omit<Issue, "id">) {
        if (!editingIssue) return;

        setIssues((previousIssues) =>
            previousIssues.map((issue) =>
                issue.id === editingIssue.id
                    ? { ...issue, ...updatedDetails }
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