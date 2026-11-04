namespace MunicipalIssueTracker.Api.Models;

public class IssueCommentRequest
{
    public string Text { get; set; } = string.Empty;

    public string? Author { get; set; }
}