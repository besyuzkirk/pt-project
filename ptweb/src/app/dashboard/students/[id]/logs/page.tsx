"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle, ArrowLeft, Loader2, Package, Calendar, User } from "lucide-react";
import Link from "next/link";
import axios from "axios";

const API_BASE = "http://localhost:5064/api";

interface WorkoutSession {
  id: string;
  startedAt?: string;
  durationMinutes?: number;
  trainerName: string;
  status: string;
  notes?: string;
  packageName?: string;
  totalSessions?: number;
  usedSessions?: number;
}

interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  workoutSessions: WorkoutSession[];
}

export default function StudentLogsPage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/users/students/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
      } catch (err: any) {
        setError("Kayıtlar yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
        <Loader2 className="animate-spin" size={32} />
        <span style={{ marginLeft: "12px", fontWeight: 600 }}>Seans kayıtları yükleniyor...</span>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <p style={{ color: "#ef4444", fontWeight: 700 }}>{error || "Kayıt bulunamadı."}</p>
        <Link href={`/dashboard/students/${id}`}>
          <button style={{ marginTop: "20px", padding: "10px 20px", background: "#f1f5f9", border: "none", borderRadius: "10px", fontWeight: 700, cursor: "pointer" }}>
            Danışan Detayına Dön
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      
      {/* Header / Back Navigation */}
      <div style={{ marginBottom: "32px" }}>
        <Link href={`/dashboard/students/${profile.id}`} style={{ display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "none", color: "#64748b", fontWeight: 600, fontSize: "14px", marginBottom: "16px" }}>
          <ArrowLeft size={16} />
          Danışan Detayına Dön
        </Link>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
              <div style={{ padding: "6px 12px", background: "#eff6ff", color: "#3b82f6", borderRadius: "8px", fontSize: "12px", fontWeight: 800, textTransform: "uppercase" }}>
                Tüm Giriş Logları
              </div>
            </div>
            <h1 style={{ fontSize: "32px", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px" }}>
              {profile.firstName} {profile.lastName}
            </h1>
            <p style={{ fontSize: "14px", color: "#64748b", fontWeight: 600, marginTop: "4px" }}>
              Bugüne kadar yapılmış olan tüm tamamlanmış giriş ve seans kayıtları listelenmektedir.
            </p>
          </div>

          <div style={{ background: "white", border: "1px solid #e2e8f0", padding: "12px 20px", borderRadius: "16px", textAlign: "right", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: "11px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", marginBottom: "2px" }}>Toplam Seans</div>
            <div style={{ fontSize: "24px", fontWeight: 900, color: "#10b981" }}>{profile.workoutSessions.length} Kayıt</div>
          </div>
        </div>
      </div>

      {/* Main Content Table Wrapper */}
      <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "24px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        
        {profile.workoutSessions.length === 0 ? (
          <div style={{ padding: "80px 40px", textAlign: "center" }}>
            <div style={{ width: "64px", height: "64px", background: "#f1f5f9", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", marginBottom: "16px" }}>
              <Calendar size={32} />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#334155", marginBottom: "4px" }}>Kayıt Bulunamadı</h3>
            <p style={{ color: "#64748b", fontSize: "14px", fontWeight: 500 }}>Bu danışana ait geçmişte kaydedilmiş bir giriş/seans kaydı bulunmuyor.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f1f5f9", background: "#f8fafc" }}>
                  <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Tarih / Saat</th>
                  <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>İlgili Paket</th>
                  <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Seans Sırası</th>
                  <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Eğitmen</th>
                  <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Süre / Durum</th>
                </tr>
              </thead>
              <tbody>
                {profile.workoutSessions.map((session, idx) => (
                  <tr key={session.id || idx} style={{ borderBottom: "1px solid #f1f5f9", background: idx % 2 === 0 ? "white" : "#fcfdfe" }}>
                    <td style={{ padding: "18px 24px", fontSize: "14px", fontWeight: 800, color: "#0f172a" }}>
                      {session.startedAt ? new Date(session.startedAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                    </td>
                    <td style={{ padding: "18px 24px" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 700, color: "#334155" }}>
                        <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Package size={14} color="#2563eb" />
                        </div>
                        {session.packageName || "Serbest Giriş"}
                      </div>
                    </td>
                    <td style={{ padding: "18px 24px" }}>
                      {session.totalSessions ? (
                        <span style={{ background: "#f0fdf4", color: "#15803d", border: "1px solid #dcfce7", fontSize: "12px", fontWeight: 800, padding: "6px 12px", borderRadius: "8px", display: "inline-flex", gap: "4px" }}>
                          <strong>{session.usedSessions}</strong> / <span>{session.totalSessions} seans</span>
                        </span>
                      ) : (
                        <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: 600 }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: "18px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <User size={14} color="#64748b" />
                        </div>
                        <span style={{ fontSize: "14px", fontWeight: 600, color: "#475569" }}>{session.trainerName}</span>
                      </div>
                    </td>
                    <td style={{ padding: "18px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ fontSize: "11px", fontWeight: 800, color: "#16a34a", background: "#dcfce7", padding: "4px 10px", borderRadius: "20px", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <CheckCircle size={12} />
                          {session.status === "Completed" ? "Tamamlandı" : session.status}
                        </span>
                        {session.durationMinutes && (
                          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 700 }}>
                            {session.durationMinutes} dk
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
