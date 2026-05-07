using MediatR;
using Microsoft.EntityFrameworkCore;
using PtApp.Application.Common.Interfaces;
using PtApp.Domain.Enums;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace PtApp.Application.Features.Users.Commands;

public record UpdateStudentCommand(
    Guid StudentId,
    decimal? HeightCm,
    string? PhoneNumber,
    Guid? AssignedTrainerId,
    bool? IsActive
) : IRequest<bool>;

public class UpdateStudentCommandHandler : IRequestHandler<UpdateStudentCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public UpdateStudentCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpdateStudentCommand request, CancellationToken cancellationToken)
    {
        var student = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.StudentId && !u.IsDeleted && u.Role == Role.Student, cancellationToken);

        if (student == null)
        {
            throw new Exception("Danışan bulunamadı.");
        }

        if (request.AssignedTrainerId.HasValue)
        {
            var trainer = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == request.AssignedTrainerId.Value && u.Role == Role.Trainer && !u.IsDeleted, cancellationToken);
            if (trainer == null)
            {
                throw new Exception("Atanmak istenen eğitmen bulunamadı.");
            }
        }

        student.HeightCm = request.HeightCm;
        if (!string.IsNullOrEmpty(request.PhoneNumber))
        {
            student.PhoneNumber = request.PhoneNumber;
        }
        student.AssignedTrainerId = request.AssignedTrainerId;
        
        if (request.IsActive.HasValue)
        {
            student.IsActive = request.IsActive.Value;
        }
        
        student.UpdatedAt = DateTimeOffset.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
