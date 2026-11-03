namespace MunicipalIssueTracker.Api.Models;

public class IssueRequest
{
    public string Title { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string Status { get; set; } = "Open";

    public string? Description { get; set; }

    public double? Latitude { get; set; }

    public double? Longitude { get; set; }
}