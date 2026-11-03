using Microsoft.AspNetCore.Mvc;
using MunicipalIssueTracker.Api.Models;

namespace MunicipalIssueTracker.Api.Controllers;

[ApiController]
[Route("api/issues")]
public class IssuesController : ControllerBase
{
    private static readonly string[] ValidStatuses =
    {
        "Open",
        "In Progress",
        "Closed"
    };

    private static readonly List<Issue> Issues = new()
    {
        new Issue
        {
            Title = "Pothole on the main road",
            Category = "Infrastructure",
            Status = "Open",
            Description = "Large pothole affecting traffic."
        },
        new Issue
        {
            Title = "Broken Streetlight",
            Category = "Electrical",
            Status = "Closed",
            Description = "Streetlight is not functioning."
        },
        new Issue
        {
            Title = "GEBE left road unpaved",
            Category = "Infrastructure",
            Status = "In Progress",
            Description = "GEBE fixed some cables, and cut the pavement to get to them but only filled it with sand. They repatched the other roads but not within this alley.",
        },
        new Issue
        {
            Title = "Dog waste creating a puddle on the road",
            Category = "Waste Management",
            Status = "Open",
            Description = "Urine and fecal matter from the security company's kennels are running into the street when they clean them, causing a large puddle of it on the road side.",
        },
    };

    // GET: api/issues
    [HttpGet]
    public IActionResult GetAllIssues()
    {
        return Ok(Issues);
    }

    // GET: api/issues/{id}
    [HttpGet("{id:guid}")]
    public IActionResult GetIssueById(Guid id)
    {
        var issue = Issues.FirstOrDefault(
            issue => issue.Id == id
        );

        if (issue == null)
        {
            return NotFound("Issue not found.");
        }

        return Ok(issue);
    }

    // POST: api/issues
    [HttpPost] //tells ASP.NET Core that the endpoint handles POST requests
    public IActionResult CreateIssue(
        [FromBody] IssueRequest request) //[FromBody] converts the incoming JSON data into an IssueRequest object
    {
        if (string.IsNullOrWhiteSpace(request.Title) ||
            string.IsNullOrWhiteSpace(request.Category))
        {
            return BadRequest(
                "Title and Category are required."
            );
        }

        if (!ValidStatuses.Contains(request.Status, StringComparer.OrdinalIgnoreCase)) //StringComparer.OrdinalIgnoreCase, ignores case-sensitivity
        {
            return BadRequest(
                "Invalid Status, use 'Open', 'In Progress', or 'Closed'."
            );
        }

        var newIssue = new Issue
        {
            Title = request.Title.Trim(),
            Category = request.Category.Trim(),
            Status = request.Status,
            Description = request.Description,
            Latitude = request.Latitude,
            Longitude = request.Longitude
        };

        Issues.Add(newIssue);

        return CreatedAtAction(
            nameof(GetIssueById),
            new { id = newIssue.Id },
            newIssue
        );
    }

    // PUT: api/issues/{id}
    [HttpPut("{id:guid}")]
    public IActionResult UpdateIssue(
        Guid id,
        [FromBody] IssueRequest request)
    {
        var existingIssue = Issues.FirstOrDefault(
            issue => issue.Id == id
        );

        if (existingIssue == null)
        {
            return NotFound("Issue not found.");
        }

        if (string.IsNullOrWhiteSpace(request.Title) ||
            string.IsNullOrWhiteSpace(request.Category))
        {
            return BadRequest(
                "Title and Category are required."
            );
        }

        if (!ValidStatuses.Contains(request.Status, StringComparer.OrdinalIgnoreCase)) //StringComparer.OrdinalIgnoreCase, ignores case-sensitivity
        {
            return BadRequest(
                "Invalid Status, use 'Open', 'In Progress', or 'Closed'."
            );
        }

        existingIssue.Title = request.Title.Trim();
        existingIssue.Category = request.Category.Trim();
        existingIssue.Status = request.Status;
        existingIssue.Description = request.Description;
        existingIssue.Latitude = request.Latitude;
        existingIssue.Longitude = request.Longitude;

        return NoContent();
    }

    // DELETE: api/issues/{id}
    [HttpDelete("{id:guid}")]
    public IActionResult DeleteIssue(Guid id)
    {
        var existingIssue = Issues.FirstOrDefault(
            issue => issue.Id == id
        );

        if (existingIssue == null)
        {
            return NotFound("Issue not found.");
        }

        Issues.Remove(existingIssue);

        return NoContent();
    }
}