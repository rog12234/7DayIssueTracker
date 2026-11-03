using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MunicipalIssueTracker.Api.Data;
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

    private readonly AppDbContext _context;

    public IssuesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/issues
    [HttpGet]
    public async Task<IActionResult> GetAllIssues()
    {
        var issues = await _context.Issues
            .AsNoTracking()
            .ToListAsync();

        return Ok(issues);
    }

    // GET: api/issues/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetIssueById(Guid id)
    {
        var issue = await _context.Issues
            .AsNoTracking()
            .FirstOrDefaultAsync(i => i.Id == id);

        if (issue == null)
        {
            return NotFound("Issue not found.");
        }

        return Ok(issue);
    }
    //tells ASP.NET Core that the endpoint handles POST requests
    //[FromBody] converts the incoming JSON data into an IssueRequest object
    //StringComparer.OrdinalIgnoreCase, ignores case-sensitivity
    // POST: api/issues
    [HttpPost]
    public async Task<IActionResult> CreateIssue(
    [FromBody] IssueRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title) ||
            string.IsNullOrWhiteSpace(request.Category))
        {
            return BadRequest("Title and Category are required.");
        }

        var status = ValidStatuses.FirstOrDefault(
            s => string.Equals(
                s,
                request.Status?.Trim(),
                StringComparison.OrdinalIgnoreCase
            )
        );

        if (status == null)
        {
            return BadRequest("Invalid issue status.");
        }

        var newIssue = new Issue
        {
            Title = request.Title.Trim(),
            Category = request.Category.Trim(),
            Status = status,
            Description = request.Description,
            Latitude = request.Latitude,
            Longitude = request.Longitude
        };

        _context.Issues.Add(newIssue);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetIssueById),
            new { id = newIssue.Id },
            newIssue
        );
    }

    //StringComparer.OrdinalIgnoreCase, ignores case-sensitivity
    // PUT: api/issues/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateIssue(
     Guid id,
     [FromBody] IssueRequest request)
    {
        var existingIssue = await _context.Issues.FindAsync(id);

        if (existingIssue == null)
        {
            return NotFound("Issue not found.");
        }

        if (string.IsNullOrWhiteSpace(request.Title) ||
            string.IsNullOrWhiteSpace(request.Category))
        {
            return BadRequest("Title and Category are required.");
        }

        var status = ValidStatuses.FirstOrDefault(
            s => string.Equals(
                s,
                request.Status?.Trim(),
                StringComparison.OrdinalIgnoreCase
            )
        );

        if (status == null)
        {
            return BadRequest("Invalid issue status.");
        }

        existingIssue.Title = request.Title.Trim();
        existingIssue.Category = request.Category.Trim();
        existingIssue.Status = status;
        existingIssue.Description = request.Description;
        existingIssue.Latitude = request.Latitude;
        existingIssue.Longitude = request.Longitude;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/issues/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteIssue(Guid id)
    {
        var existingIssue = await _context.Issues.FindAsync(id);

        if (existingIssue == null)
        {
            return NotFound("Issue not found.");
        }

        _context.Issues.Remove(existingIssue);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}