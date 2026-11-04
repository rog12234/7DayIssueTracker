namespace MunicipalIssueTracker.Api.Models;

public class IssueComment
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid IssueId { get; set; }

    public string Text { get; set; } = string.Empty;

    public DateTimeOffset CreatedAt { get; set; }
        = DateTimeOffset.UtcNow;

    public string? Author { get; set; }

    public string? PreviousStatus { get; set; }

    public string? NewStatus { get; set; }
}