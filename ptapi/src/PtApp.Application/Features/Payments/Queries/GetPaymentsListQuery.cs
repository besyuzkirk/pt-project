using MediatR;
using Microsoft.EntityFrameworkCore;
using PtApp.Application.Common.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace PtApp.Application.Features.Payments.Queries;

public record PaymentListItemDto
{
    public Guid Id { get; set; }
    public string StudentName { get; set; } = null!;
    public string PackageName { get; set; } = null!;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "TRY";
    public string PaymentMethod { get; set; } = null!;
    public string Status { get; set; } = null!;
    public DateOnly? DueDate { get; set; }
    public DateTimeOffset? PaidAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}

public record GetPaymentsListQuery : IRequest<List<PaymentListItemDto>>;

public class GetPaymentsListQueryHandler : IRequestHandler<GetPaymentsListQuery, List<PaymentListItemDto>>
{
    private readonly IApplicationDbContext _context;

    public GetPaymentsListQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<PaymentListItemDto>> Handle(GetPaymentsListQuery request, CancellationToken cancellationToken)
    {
        return await _context.Payments
            .Include(p => p.Student)
            .Include(p => p.Membership)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new PaymentListItemDto
            {
                Id = p.Id,
                StudentName = p.Student.FirstName + " " + p.Student.LastName,
                PackageName = p.Membership.PackageName,
                Amount = p.Amount,
                Currency = p.Currency,
                PaymentMethod = p.PaymentMethod.ToString(),
                Status = p.Status.ToString(),
                DueDate = p.DueDate,
                PaidAt = p.PaidAt,
                CreatedAt = p.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }
}
