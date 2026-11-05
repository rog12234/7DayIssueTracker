using System.Text.Json.Serialization;
namespace MunicipalIssueTracker.Api.Models;

public class Issue
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Title { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string Status { get; set; } = "Open";

    public string? Description { get; set; }

    public double? Latitude { get; set; }

    public double? Longitude { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
    = DateTimeOffset.UtcNow;

    [JsonIgnore]
    public List<IssueComment> Comments { get; set; } = new();
}