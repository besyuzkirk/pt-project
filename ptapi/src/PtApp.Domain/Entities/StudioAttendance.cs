using System;
using PtApp.Domain.Common;
using PtApp.Domain.Enums;

namespace PtApp.Domain.Entities;

public class StudioAttendance : BaseEntity
{
    public Guid UserId { get; set; }
    public AppUser User { get; set; } = null!;

    public Guid? MembershipId { get; set; }
    public Membership? Membership { get; set; }

    public DateTimeOffset CheckInAt { get; set; }
    public DateTimeOffset? CheckOutAt { get; set; }
    
    public int? DurationMinutes { get; set; }
    public string QrTokenUsed { get; set; } = string.Empty;
    public string? ScannedByDevice { get; set; }
    
    public EntryType EntryType { get; set; }
    public string? Notes { get; set; }
}
