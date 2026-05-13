using MediatR;
using Microsoft.EntityFrameworkCore;
using PtApp.Application.Common.Interfaces;
using PtApp.Domain.Enums;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace PtApp.Application.Features.Payments.Commands;

public record UpdatePaymentStatusCommand(Guid PaymentId, string Status) : IRequest<bool>;

public class UpdatePaymentStatusCommandHandler : IRequestHandler<UpdatePaymentStatusCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public UpdatePaymentStatusCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpdatePaymentStatusCommand request, CancellationToken cancellationToken)
    {
        var payment = await _context.Payments
            .FirstOrDefaultAsync(p => p.Id == request.PaymentId, cancellationToken);

        if (payment == null)
            throw new Exception("Ödeme kaydı bulunamadı.");

        if (Enum.TryParse<PaymentStatus>(request.Status, true, out var newStatus))
        {
            payment.Status = newStatus;
            
            if (newStatus == PaymentStatus.Paid)
            {
                payment.PaidAt = DateTimeOffset.UtcNow;
            }
            else if (newStatus == PaymentStatus.Pending)
            {
                payment.PaidAt = null;
            }

            _context.Payments.Update(payment);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }

        throw new Exception("Geçersiz ödeme durumu.");
    }
}
