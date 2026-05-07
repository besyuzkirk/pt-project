"use client";

import { useEffect, useState } from "react";
import { Users, Dumbbell, TrendingUp, Calendar, Loader2, Clock, CheckCircle, Award, Sparkles } from "lucide-react";
import axios from "axios";
import { useRole } from "../lib/useRole";

const API_BASE = "http://localhost:5064/api";

interface DashboardAppointment {
  id: string;
  studentName: string;
  trainerName: string;
  scheduledAt: string;
  durationMinutes: number;
  status: string;
}

interface DashboardWorkoutSession {
  id: string;
  studentName: string;
  trainerName: string;
  notes: string;
  date: string;
  status: string;
}

interface TrainerLessonCount {
  trainerName: string;
  lessonCount: number;
}

interface DashboardData {
  activeMembersCount: number;
  thisMonthWorkoutsCount: number;
  monthlyRevenue: number;
  allTimeRevenue: number;
  pendingProgramsCount: number;
  todayAppointments: DashboardAppointment[];
  recentCompletedSessions: DashboardWorkoutSession[];
  trainerLessonCounts: TrainerLessonCount[];
}

export default function DashboardOverview() {
  const { isAdmin, isTrainer, isLoading: roleLoading } = useRole();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revenueFilter, setRevenueFilter] = useState<"monthly" | "allTime">("monthly");

  useEffect(() => {
    if (roleLoading) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err: any) {
        console.error(err);
        setError("Gösterge paneli verileri yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [roleLoading]);

  if (loading || roleLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "16px" }}>
        <Loader2 size={40} className="animate-spin" color="#4f46e5" />
        <p style={{ color: "#64748b", fontWeight: 700, fontSize: "15px" }}>Veriler yükleniyor, lütfen bekleyin...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ padding: "24px", background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: "16px", textAlign: "center" }}>
        <p style={{ color: "#ef4444", fontWeight: 800 }}>{error || "Veriler alınamadı."}</p>
      </div>
    );
  }

  const currentRevenue = revenueFilter === "monthly" ? data.monthlyRevenue : data.allTimeRevenue;

  const stats = [
    { 
      label: "Aktif Üyeler", 
      value: data.activeMembersCount, 
      icon: Users, 
      color: "#4f46e5", 
      bgColor: "#eff6ff", 
      desc: isAdmin ? "Toplam aktif kayıtlı üye" : "Sorumlu olduğunuz üyeler" 
    },
    { 
      label: "Bu Ayki Antrenman", 
      value: `${data.thisMonthWorkoutsCount} Seans`, 
      icon: Dumbbell, 
      color: "#ec4899", 
      bgColor: "#fdf2f8", 
      desc: "Tamamlanan toplam ders" 
    },
    { 
      label: "Toplam Gelir", 
      value: new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(currentRevenue), 
      icon: TrendingUp, 
      color: "#10b981", 
      bgColor: "#f0fdf4", 
      desc: revenueFilter === "monthly" ? "Bu ayki paket satış tutarı" : "Tüm zamanlar satış tutarı",
      isRevenue: true
    },
    { 
      label: "Kalan Seanslar", 
      value: `${data.pendingProgramsCount} Seans`, 
      icon: Calendar, 
      color: "#8b5cf6", 
      bgColor: "#f5f3ff", 
      desc: "Aktif paketlerin kalan toplam ders sayısı" 
    },
  ];

  const formatTime = (dateTimeStr: string) => {
    return new Date(dateTimeStr).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("tr-TR", { day: "2-digit", month: "short" });
  };

  return (
    <div>
      {/* Page Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <h1 style={{ fontSize: "32px", fontWeight: 900, color: "#0f172a", letterSpacing: "-1px" }}>
              Genel Bakış 👋
            </h1>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "#f5f3ff", color: "#8b5cf6", fontSize: "11px", fontWeight: 800, padding: "4px 10px", borderRadius: "10px" }}>
              <Sparkles size={12} /> Canlı Veri
            </span>
          </div>
          <p style={{ fontSize: "16px", color: "#64748b", fontWeight: 500 }}>
            {isAdmin ? "Yönetici paneli kulüp özetine hoş geldin." : "Eğitmen performans özetine hoş geldin."}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stat-box-grid">
        {stats.map((stat) => (
          <div key={stat.label} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "20px", padding: "24px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01)", position: "relative", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div style={{ width: "48px", height: "48px", background: stat.bgColor, borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <stat.icon size={22} color={stat.color} />
              </div>
              
              {stat.isRevenue && (
                <div style={{ display: "flex", background: "#f1f5f9", borderRadius: "10px", padding: "2px" }}>
                  <button 
                    onClick={() => setRevenueFilter("monthly")}
                    style={{ border: "none", background: revenueFilter === "monthly" ? "white" : "transparent", color: revenueFilter === "monthly" ? "#0f172a" : "#64748b", fontSize: "10px", fontWeight: 800, padding: "4px 8px", borderRadius: "8px", cursor: "pointer", boxShadow: revenueFilter === "monthly" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>
                    Aylık
                  </button>
                  <button 
                    onClick={() => setRevenueFilter("allTime")}
                    style={{ border: "none", background: revenueFilter === "allTime" ? "white" : "transparent", color: revenueFilter === "allTime" ? "#0f172a" : "#64748b", fontSize: "10px", fontWeight: 800, padding: "4px 8px", borderRadius: "8px", cursor: "pointer", boxShadow: revenueFilter === "allTime" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>
                    Tümü
                  </button>
                </div>
              )}
            </div>
            <div style={{ fontSize: "28px", fontWeight: 900, color: "#0f172a", marginBottom: "4px", letterSpacing: "-0.5px" }}>{stat.value}</div>
            <div style={{ fontSize: "12px", fontWeight: 800, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>{stat.label}</div>
            <p style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600, margin: 0 }}>{stat.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isAdmin ? "1.5fr 1fr" : "1fr 1fr", gap: "32px", marginTop: "32px" }}>
        {/* Today's Appointments (Bugün Gelecekler) */}
        <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "24px", padding: "28px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.3px" }}>Bugün Salona Gelecekler</h2>
              <p style={{ fontSize: "13px", color: "#94a3b8", fontWeight: 600, marginTop: "2px" }}>Bugün için planlanmış antrenman takvimi</p>
            </div>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#4f46e5", background: "#f5f3ff", padding: "4px 12px", borderRadius: "10px" }}>
              {data.todayAppointments.length} Rezervasyon
            </span>
          </div>

          {data.todayAppointments.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", border: "1px dashed #e2e8f0", borderRadius: "18px" }}>
              <Clock size={36} color="#94a3b8" style={{ marginBottom: "12px" }} />
              <p style={{ fontSize: "14px", fontWeight: 700, color: "#64748b", margin: 0 }}>Bugün için programlanmış bir randevu bulunmuyor.</p>
              <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px", margin: 0 }}>Yeni randevu eklemek için Takvim alanını kullanabilirsiniz.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {data.todayAppointments.map((app) => (
                <div key={app.id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", border: "1px solid #f1f5f9", borderRadius: "16px", background: "#fafafa" }}>
                  <div style={{ padding: "10px 14px", background: "#eff6ff", borderRadius: "12px", textAlign: "center", minWidth: "64px" }}>
                    <div style={{ fontSize: "14px", fontWeight: 900, color: "#2563eb" }}>{formatTime(app.scheduledAt)}</div>
                    <div style={{ fontSize: "9px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", marginTop: "2px" }}>{app.durationMinutes} Dk</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a" }}>{app.studentName}</div>
                    <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600, marginTop: "2px" }}>Eğitmen: <strong style={{ color: "#475569" }}>{app.trainerName}</strong></div>
                  </div>
                  <span style={{ 
                    fontSize: "11px", 
                    fontWeight: 800, 
                    padding: "4px 10px", 
                    borderRadius: "8px",
                    background: app.status === "Completed" ? "#f0fdf4" : app.status === "Booked" ? "#fffbeb" : "#fef2f2",
                    color: app.status === "Completed" ? "#16a34a" : app.status === "Booked" ? "#d97706" : "#dc2626"
                  }}>
                    {app.status === "Booked" ? "Planlandı" : app.status === "Completed" ? "Tamamlandı" : "İptal"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Completed Sessions (Son Yapılan Dersler) */}
        <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "24px", padding: "28px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.3px" }}>Son Yapılan Dersler</h2>
              <p style={{ fontSize: "13px", color: "#94a3b8", fontWeight: 600, marginTop: "2px" }}>En son tamamlanan antrenman özetleri</p>
            </div>
          </div>

          {data.recentCompletedSessions.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", border: "1px dashed #e2e8f0", borderRadius: "18px" }}>
              <CheckCircle size={36} color="#94a3b8" style={{ marginBottom: "12px" }} />
              <p style={{ fontSize: "14px", fontWeight: 700, color: "#64748b", margin: 0 }}>Henüz tamamlanmış bir ders kaydı bulunmuyor.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {data.recentCompletedSessions.map((session) => (
                <div key={session.id} style={{ padding: "16px", border: "1px solid #f1f5f9", borderRadius: "16px", background: "#fff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <div>
                      <span style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a" }}>{session.studentName}</span>
                      {isAdmin && (
                        <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 700, marginTop: "2px" }}>Eğitmen: {session.trainerName}</div>
                      )}
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 800, color: "#64748b", background: "#f1f5f9", padding: "4px 8px", borderRadius: "8px" }}>
                      {formatDate(session.date)}
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", color: "#64748b", fontWeight: 600, margin: 0, fontStyle: "italic", background: "#f8fafc", padding: "8px 12px", borderRadius: "8px" }}>
                    "{session.notes}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Admin Only: Trainer Monthly Performance (Tüm Eğitmenlerin Ders Performansı) */}
      {isAdmin && (
        <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "24px", padding: "28px", marginTop: "32px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.3px" }}>Bu Ayki Eğitmen Ders Performansları</h2>
              <p style={{ fontSize: "13px", color: "#94a3b8", fontWeight: 600, marginTop: "2px" }}>Eğitmenlerin ve yöneticilerin bu ay verdiği toplam ders sayıları</p>
            </div>
            <Award size={24} color="#eab308" />
          </div>

          {data.trainerLessonCounts.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px", border: "1px dashed #e2e8f0", borderRadius: "18px" }}>
              <p style={{ fontSize: "14px", fontWeight: 700, color: "#64748b", margin: 0 }}>Bu ay tamamlanmış ders kaydı henüz oluşmadı.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
              {data.trainerLessonCounts.map((t, idx) => {
                const maxLessons = Math.max(...data.trainerLessonCounts.map(tc => tc.lessonCount), 1);
                const percent = (t.lessonCount / maxLessons) * 100;
                return (
                  <div key={idx} style={{ padding: "18px", border: "1px solid #f1f5f9", borderRadius: "16px", background: "#fcfcfc" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 800, color: "#1e293b" }}>{t.trainerName}</span>
                      <span style={{ fontSize: "13px", fontWeight: 900, color: "#4f46e5", background: "#e0e7ff", padding: "4px 10px", borderRadius: "8px" }}>
                        {t.lessonCount} Seans
                      </span>
                    </div>
                    <div style={{ width: "100%", height: "8px", background: "#f1f5f9", borderRadius: "99px", overflow: "hidden" }}>
                      <div style={{ height: "100%", background: "linear-gradient(90deg, #4f46e5 0%, #818cf8 100%)", width: `${percent}%`, borderRadius: "99px" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
