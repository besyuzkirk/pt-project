using PtApp.Domain.Common;
using PtApp.Domain.Enums;

namespace PtApp.Domain.Entities;

/// <summary>
/// Yeniden kullanılabilir paket şablonları. Bir üyeye atanırken Membership oluşturulur.
/// </summary>
public class Package : BaseEntity
{
    /// <summary>Paketin görünen adı. Örn: "Aylık Bireysel PT"</summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>Kısa açıklama</summary>
    public string? Description { get; set; }

    /// <summary>Bireysel mi, Grup mu?</summary>
    public PackageType PackageType { get; set; }

    /// <summary>Yüz yüze mi, Uzaktan mı?</summary>
    public SessionType SessionType { get; set; }

    /// <summary>Toplam seans sayısı. Null = sınırsız (süre bazlı)</summary>
    public int? TotalSessions { get; set; }

    /// <summary>Her seansın süresi (dakika)</summary>
    public int SessionDurationMinutes { get; set; }

    /// <summary>Grup paketi ise maksimum katılımcı sayısı</summary>
    public int? MaxParticipants { get; set; }

    /// <summary>Paketin geçerlilik süresi (gün). Örn: 30 = 1 aylık</summary>
    public int ValidityDays { get; set; }

    /// <summary>Fiyat</summary>
    public decimal Price { get; set; }

    /// <summary>Para birimi</summary>
    public string Currency { get; set; } = "TRY";

    /// <summary>Paket satışa açık mı?</summary>
    public bool IsActive { get; set; } = true;
}
