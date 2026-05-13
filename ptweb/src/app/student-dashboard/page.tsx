"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import { User, Calendar as CalendarIcon, Loader2, Sparkles, AlertCircle, Clock, Ruler } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/tr";

dayjs.locale("tr");

const API_BASE = "http://localhost:5064/api";

export default function StudentDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("userId");
    setUserId(id);
    if (id) {
      fetchData(id);
    } else {
      setError("Kullanıcı kimliği bulunamadı.");
      setLoading(false);
    }
  }, []);

  const fetchData = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Get profile
      const profileRes = await axios.get(`${API_BASE}/users/students/${id}`, { headers });
      setProfile(profileRes.data);

      // Get upcoming sessions (next 30 days)
      const startDate = new Date().toISOString();
      const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      
      const sessionsRes = await axios.get(`${API_BASE}/appointments/my-sessions`, {
        headers,
        params: { startDate, endDate }
      });
      
      // Sadece yaklaşanları filtrele (geçmiş saatleri gizle)
      const now = new Date().getTime();
      const upcoming = sessionsRes.data.filter((s: any) => new Date(s.scheduledAt).getTime() > now);
      setSessions(upcoming);

    } catch (err: any) {
      console.error(err);
      setError("Veriler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <Loader2 className="animate-spin" size={40} color="#4f46e5" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: "#fef2f2", padding: "20px", borderRadius: "16px", border: "1px solid #fee2e2", textAlign: "center", color: "#ef4444" }}>
        <AlertCircle size={32} style={{ margin: "0 auto 12px" }} />
        <div style={{ fontWeight: 800 }}>{error}</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "600px", margin: "0 auto" }}>
      
      {/* ── PROFILE & MEMBERSHIP CARD ── */}
      <div style={{ background: "white", borderRadius: "24px", padding: "24px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
          <div style={{ width: "56px", height: "56px", background: "#f1f5f9", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", color: "#4f46e5" }}>
            <User size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 900, color: "#0f172a", marginBottom: "4px" }}>
              {profile?.firstName} {profile?.lastName}
            </h2>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#64748b" }}>
              Eğitmen: {profile?.assignedTrainerName || "Atanmadı"}
            </div>
          </div>
        </div>

        {profile?.activeMembership && (
          <div style={{ background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)", borderRadius: "16px", padding: "20px", color: "white" }}>
            <div style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.8, marginBottom: "8px" }}>
              Aktif Paket
            </div>
            <div style={{ fontSize: "20px", fontWeight: 900, marginBottom: "16px" }}>
              {profile.activeMembership.packageName}
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <div style={{ fontSize: "11px", opacity: 0.8, marginBottom: "2px" }}>Kalan Seans</div>
                <div style={{ fontSize: "28px", fontWeight: 900, display: "flex", alignItems: "center", gap: "6px" }}>
                  {profile.activeMembership.remainingSessions}
                  <Sparkles size={20} color="#fcd34d" />
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "11px", opacity: 0.8, marginBottom: "2px" }}>Geçerlilik</div>
                <div style={{ fontSize: "14px", fontWeight: 700 }}>
                  {dayjs(profile.activeMembership.endDate).format("DD MMMM YYYY")}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── MEASUREMENTS CARD ── */}
      {profile?.measurements && profile.measurements.length > 0 && (
        <div style={{ background: "white", borderRadius: "24px", padding: "24px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "36px", height: "36px", background: "#f0fdf4", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981" }}>
                <Ruler size={18} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 900, color: "#0f172a" }}>Son Ölçümlerim</h3>
            </div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b" }}>
              {dayjs(profile.measurements[0].recordedAt).format("DD MMM YYYY")}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {profile.measurements[0].weightKg && (
              <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: "4px" }}>Kilo</div>
                <div style={{ fontSize: "20px", fontWeight: 900, color: "#0f172a" }}>{profile.measurements[0].weightKg} <span style={{ fontSize: "14px", fontWeight: 700, color: "#94a3b8" }}>kg</span></div>
              </div>
            )}
            {profile.measurements[0].bodyFatPercentage && (
              <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: "4px" }}>Yağ Oranı</div>
                <div style={{ fontSize: "20px", fontWeight: 900, color: "#0f172a" }}>%{profile.measurements[0].bodyFatPercentage}</div>
              </div>
            )}
            {profile.measurements[0].waistCm && (
              <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: "4px" }}>Bel</div>
                <div style={{ fontSize: "20px", fontWeight: 900, color: "#0f172a" }}>{profile.measurements[0].waistCm} <span style={{ fontSize: "14px", fontWeight: 700, color: "#94a3b8" }}>cm</span></div>
              </div>
            )}
            {profile.measurements[0].chestCm && (
              <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: "4px" }}>Göğüs</div>
                <div style={{ fontSize: "20px", fontWeight: 900, color: "#0f172a" }}>{profile.measurements[0].chestCm} <span style={{ fontSize: "14px", fontWeight: 700, color: "#94a3b8" }}>cm</span></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── QR CODE CARD (CHECK-IN) ── */}
      <div style={{ background: "white", borderRadius: "24px", padding: "32px 24px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0", textAlign: "center" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 900, color: "#0f172a", marginBottom: "8px" }}>
          Check-in QR Kodunuz
        </h3>
        <p style={{ fontSize: "13px", color: "#64748b", fontWeight: 600, marginBottom: "24px" }}>
          Stüdyoya geldiğinizde bu kodu eğitmeninize okutunuz.
        </p>
        
        {userId ? (
          <div style={{ background: "white", padding: "16px", borderRadius: "24px", display: "inline-block", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", border: "1px solid #f1f5f9" }}>
            <QRCodeSVG 
              value={userId} 
              size={200}
              bgColor={"#ffffff"}
              fgColor={"#0f172a"}
              level={"H"}
            />
          </div>
        ) : (
          <div style={{ padding: "40px", background: "#f1f5f9", borderRadius: "16px", color: "#94a3b8" }}>
            QR Kod Oluşturulamadı
          </div>
        )}
      </div>

      {/* ── UPCOMING SESSIONS ── */}
      <div style={{ background: "white", borderRadius: "24px", padding: "24px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <div style={{ width: "36px", height: "36px", background: "#eff6ff", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6" }}>
            <CalendarIcon size={18} />
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: 900, color: "#0f172a" }}>Yaklaşan Seanslarınız</h3>
        </div>

        {sessions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: "#94a3b8", fontSize: "14px", fontWeight: 600 }}>
            Yaklaşan bir seansınız bulunmuyor.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {sessions.map((session: any) => (
              <div key={session.id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", background: "#f8fafc", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
                <div style={{ background: "white", padding: "10px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", textAlign: "center", minWidth: "70px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>
                    {dayjs(session.scheduledAt).format("MMM")}
                  </div>
                  <div style={{ fontSize: "20px", fontWeight: 900, color: "#0f172a" }}>
                    {dayjs(session.scheduledAt).format("DD")}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a", marginBottom: "4px" }}>
                    {dayjs(session.scheduledAt).format("dddd")} Seansı
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, color: "#64748b" }}>
                    <Clock size={14} />
                    {dayjs(session.scheduledAt).format("HH:mm")} ({session.durationMinutes} dk)
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
