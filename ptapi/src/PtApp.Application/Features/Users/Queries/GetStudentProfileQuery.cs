using MediatR;
using Microsoft.EntityFrameworkCore;
using PtApp.Application.Common.Interfaces;
using PtApp.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace PtApp.Application.Features.Users.Queries;

public class StudentMembershipDto
{
    public Guid Id { get; set; }
    public string PackageName { get; set; } = string.Empty;
    public string TrainerName { get; set; } = string.Empty;
    public int? TotalSessions { get; set; }
    public int UsedSessions { get; set; }
    public decimal Price { get; set; }
    public string Currency { get; set; } = "TRY";
    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class StudentMeasurementDto
{
    public Guid Id { get; set; }
    public DateTimeOffset RecordedAt { get; set; }
    public decimal? WeightKg { get; set; }
    public decimal? BodyFatPercentage { get; set; }
    public decimal? ShoulderCm { get; set; }
    public decimal? ChestCm { get; set; }
    public decimal? WaistCm { get; set; }
    public decimal? HipCm { get; set; }
    public decimal? ArmLeftCm { get; set; }
    public decimal? ArmRightCm { get; set; }
    public decimal? LegLeftCm { get; set; }
    public decimal? LegRightCm { get; set; }
    public string? Notes { get; set; }
    
    public string? FrontPhotoUrl { get; set; }
    public string? SidePhotoUrl { get; set; }
    public string? BackPhotoUrl { get; set; }
}

public class StudentProfileDto
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public DateOnly? DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string? BloodType { get; set; }
    public decimal? HeightCm { get; set; }
    public string? EmergencyContactName { get; set; }
    public string? EmergencyContactPhone { get; set; }
    public string? Notes { get; set; }
    public Guid? AssignedTrainerId { get; set; }
    public DateTimeOffset? LastLoginAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; }

    public List<StudentMembershipDto> Memberships { get; set; } = new();
    public List<StudentMeasurementDto> Measurements { get; set; } = new();
}

public record GetStudentProfileQuery(Guid StudentId) : IRequest<StudentProfileDto>;

public class GetStudentProfileQueryHandler : IRequestHandler<GetStudentProfileQuery, StudentProfileDto>
{
    private readonly IApplicationDbContext _context;

    public GetStudentProfileQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<StudentProfileDto> Handle(GetStudentProfileQuery request, CancellationToken cancellationToken)
    {
        var student = await _context.Users
            .Include(u => u.MembershipsAsStudent)
                .ThenInclude(m => m.Trainer)
            .Include(u => u.BodyMeasurementsAsStudent)
            .FirstOrDefaultAsync(u => u.Id == request.StudentId && !u.IsDeleted && u.Role == Role.Student, cancellationToken);

        if (student == null)
            throw new Exception("Danışan bulunamadı.");

        return new StudentProfileDto
        {
            Id = student.Id,
            FirstName = student.FirstName,
            LastName = student.LastName,
            Email = student.Email ?? string.Empty,
            PhoneNumber = student.PhoneNumber ?? string.Empty,
            DateOfBirth = student.DateOfBirth,
            Gender = student.Gender?.ToString(),
            BloodType = student.BloodType?.ToString(),
            HeightCm = student.HeightCm,
            EmergencyContactName = student.EmergencyContactName,
            EmergencyContactPhone = student.EmergencyContactPhone,
            Notes = student.Notes,
            AssignedTrainerId = student.AssignedTrainerId,
            LastLoginAt = student.LastLoginAt,
            CreatedAt = student.CreatedAt,
            Memberships = student.MembershipsAsStudent
                .Where(m => !string.IsNullOrEmpty(m.PackageName))
                .OrderByDescending(m => m.StartDate)
                .Select(m => new StudentMembershipDto
                {
                    Id = m.Id,
                    PackageName = m.PackageName,
                    TrainerName = m.Trainer != null ? $"{m.Trainer.FirstName} {m.Trainer.LastName}" : "",
                    TotalSessions = m.TotalSessions,
                    UsedSessions = m.UsedSessions,
                    Price = m.Price,
                    Currency = m.Currency,
                    StartDate = m.StartDate,
                    EndDate = m.EndDate,
                    Status = m.Status.ToString()
                }).ToList(),
            Measurements = student.BodyMeasurementsAsStudent.OrderByDescending(m => m.RecordedAt).Select(m => new StudentMeasurementDto
            {
                Id = m.Id,
                RecordedAt = m.RecordedAt,
                WeightKg = m.WeightKg,
                BodyFatPercentage = m.BodyFatPercentage,
                ShoulderCm = m.ShoulderCm,
                ChestCm = m.ChestCm,
                WaistCm = m.WaistCm,
                HipCm = m.HipCm,
                ArmLeftCm = m.ArmLeftCm,
                ArmRightCm = m.ArmRightCm,
                LegLeftCm = m.LegLeftCm,
                LegRightCm = m.LegRightCm,
                Notes = m.Notes,
                FrontPhotoUrl = m.FrontPhotoUrl,
                SidePhotoUrl = m.SidePhotoUrl,
                BackPhotoUrl = m.BackPhotoUrl
            }).ToList()
        };
    }
}
