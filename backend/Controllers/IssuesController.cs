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

    //IActionResult tells ASP.NET Core that the endpoint handles POST requests
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
        // 1. Find the existing issue
        var existingIssue = await _context.Issues.FindAsync(id);

        if (existingIssue == null)
        {
            return NotFound("Issue not found.");
        }

        // 2. Validate required fields
        if (string.IsNullOrWhiteSpace(request.Title) ||
            string.IsNullOrWhiteSpace(request.Category))
        {
            return BadRequest("Title and Category are required.");
        }

        // 3. Validate and normalize status
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

        // 4. Validate optional progress comment
        var progressComment = request.ProgressComment?.Trim();

        if (progressComment?.Length > 2000)
        {
            return BadRequest(
                "Progress comment cannot exceed 2000 characters."
            );
        }

        // 5. Check whether the status actually changed
        var previousStatus = existingIssue.Status;

        bool statusChanged = !string.Equals(
            previousStatus,
            status,
            StringComparison.Ordinal
        );

        // Comments without a status change use the POST comments endpoint
        if (!statusChanged &&
            !string.IsNullOrWhiteSpace(progressComment))
        {
            return BadRequest(
                "Use POST /api/issues/{id}/comments to add a comment without changing status."
            );
        }

        // 6. Update issue properties
        existingIssue.Title = request.Title.Trim();
        existingIssue.Category = request.Category.Trim();
        existingIssue.Status = status;
        existingIssue.Description = request.Description;
        existingIssue.Latitude = request.Latitude;
        existingIssue.Longitude = request.Longitude;

        // 7. Record status changes in progress history
        if (statusChanged)
        {
            var newComment = new IssueComment
            {
                IssueId = existingIssue.Id,
                Author = string.IsNullOrWhiteSpace(request.Author)
                ? null
                : request.Author.Trim(),
                Text = !string.IsNullOrWhiteSpace(progressComment)
                    ? progressComment
                    : $"Status changed from {previousStatus} to {status}.",

                PreviousStatus = previousStatus,
                NewStatus = status,
                CreatedAt = DateTimeOffset.UtcNow
            };

            _context.IssueComments.Add(newComment);
        }

        // 8. Save the issue and history entry together
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

    // GET: api/issues/{id}/comments
    [HttpGet("{id:guid}/comments")]
    public async Task<IActionResult> GetIssueComments(Guid id)
    {
        var issueExists = await _context.Issues
            .AnyAsync(issue => issue.Id == id); //AnyAsync() Checks whether an issue exists without retrieving the entire issue object.

        if (!issueExists)
        {
            return NotFound("Issue not found.");
        }

        var comments = await _context.IssueComments
            .AsNoTracking()
            .Where(comment => comment.IssueId == id) //Where() Retrieves only comments where IssueId matches the issue in the URL.
            .OrderByDescending(comment => comment.CreatedAt) //OrderBy() Sorts the comments chronologically, showing the oldest progress updates first.
            .ToListAsync(); // Executes the database query and retrieves the results.

        return Ok(comments);
    }

    // GET: api/issues/{id}/comments/{commentId}
    [HttpGet("{id:guid}/comments/{commentId:guid}")]
    public async Task<IActionResult> GetCommentById(
        Guid id,
        Guid commentId)
    {
        var comment = await _context.IssueComments
            .AsNoTracking()
            .FirstOrDefaultAsync(c =>
                c.Id == commentId && c.IssueId == id
            );

        if (comment == null)
        {
            return NotFound("Comment not found.");
        }

        return Ok(comment);
    }

    // POST: api/issues/{id}/comments
    [HttpPost("{id:guid}/comments")]
    public async Task<IActionResult> CreateIssueComment(
        Guid id,
        [FromBody] IssueCommentRequest request)
    {
        var issueExists = await _context.Issues
            .AnyAsync(issue => issue.Id == id);

        if (!issueExists)
        {
            return NotFound("Issue not found.");
        }

        if (string.IsNullOrWhiteSpace(request.Text))
        {
            return BadRequest("Comment text cannot be empty.");
        }

        if (request.Text.Trim().Length > 2000)
        {
            return BadRequest(
                "Comment cannot exceed 2000 characters."
            );
        }

        var newComment = new IssueComment
        {
            IssueId = id,
            Text = request.Text.Trim(),
            Author = string.IsNullOrWhiteSpace(request.Author)
                ? null
                : request.Author.Trim(),
            CreatedAt = DateTimeOffset.UtcNow
        };

        _context.IssueComments.Add(newComment);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetCommentById),
            new { id, commentId = newComment.Id },
            newComment
        );
    }


}