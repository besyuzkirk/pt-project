using System;
using PtApp.Domain.Common;
using PtApp.Domain.Enums;

namespace PtApp.Domain.Entities;

public class Payment : BaseEntity
{
    public Guid MembershipId { get; set; }
    public Membership Membership { get; set; } = null!;

    public Guid StudentId { get; set; }
    public AppUser Student { get; set; } = null!;

    public decimal Amount { get; set; }
    public string Currency { get; set; } = "TRY";
    
    public PaymentMethod PaymentMethod { get; set; }
    public PaymentStatus Status { get; set; }
    
    public DateTimeOffset? PaidAt { get; set; }
    public DateOnly? DueDate { get; set; }
    
    public string? Notes { get; set; }
}
