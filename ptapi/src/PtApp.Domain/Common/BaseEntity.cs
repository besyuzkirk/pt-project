using System;
using PtApp.Domain.Common.Interfaces;

namespace PtApp.Domain.Common;

public abstract class BaseEntity : IAuditableEntity, ISoftDeletable
{
    public Guid Id { get; set; }
    
    // Audit Fields
    public DateTimeOffset CreatedAt { get; set; }
    public Guid? CreatedBy { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
    public Guid? UpdatedBy { get; set; }
    
    // Soft Delete Fields
    public bool IsDeleted { get; set; }
    public DateTimeOffset? DeletedAt { get; set; }
    public Guid? DeletedBy { get; set; }
}
