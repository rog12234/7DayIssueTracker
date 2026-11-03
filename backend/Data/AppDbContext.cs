using Microsoft.EntityFrameworkCore;
using MunicipalIssueTracker.Api.Models;

namespace MunicipalIssueTracker.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Issue> Issues { get; set; }
        = null!;
}