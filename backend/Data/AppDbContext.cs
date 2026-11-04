using Microsoft.EntityFrameworkCore;
using MunicipalIssueTracker.Api.Models;

namespace MunicipalIssueTracker.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Issue> Issues { get; set; } = null!;

    public DbSet<IssueComment> IssueComments { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Issue>()
            .HasMany(issue => issue.Comments)
            .WithOne()
            .HasForeignKey(comment => comment.IssueId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<IssueComment>()
            .Property(comment => comment.Text)
            .HasMaxLength(2000)
            .IsRequired();
    }
}