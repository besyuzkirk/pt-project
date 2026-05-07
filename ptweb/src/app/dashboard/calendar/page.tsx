"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Edit2, X, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import { useRole } from "../../lib/useRole";

const API_BASE = "http://localhost:5064/api";

interface Appointment {
  id: string;
  studentId: string;
  studentName: string;
  packageName: string;
  scheduledAt: string;
  durationMinutes: number;
  status: string;
}

export default function CalendarPage() {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getStartOfWeek(new Date()));
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { isAdmin, isLoading: roleLoading } = useRole();
  const [onlyMine, setOnlyMine] = useState(false);

  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  function getStartOfWeek(d: Date) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(date.setDate(diff));
  }

  const fetchAppointments = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const startDate = new Date(currentWeekStart);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(currentWeekStart);
      endDate.setDate(endDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);

      const res = await axios.get(`${API_BASE}/appointments/calendar`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          onlyMine: onlyMine
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(res.data);
    } catch (err: any) {
      setError("Takvim verileri alınamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentWeekStart, onlyMine]);

  const prevWeek = () => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() - 7);
    setCurrentWeekStart(d);
  };

  const nextWeek = () => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + 7);
    setCurrentWeekStart(d);
  };

  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const hours = Array.from({ length: 15 }).map((_, i) => i + 7); // 07:00 to 21:00

  const openEditModal = (appt: Appointment) => {
    setSelectedAppt(appt);
    const d = new Date(appt.scheduledAt);
    // local string parsing format
    setEditDate(d.toISOString().split("T")[0]);
    setEditTime(d.toTimeString().substring(0, 5));
  };

  const handleUpdate = async (newStatus?: string) => {
    if (!selectedAppt) return;
    setEditLoading(true);
    try {
      const token = localStorage.getItem("token");
      let payload: any = {};
      
      if (newStatus) {
        payload.newStatus = newStatus;
      } else {
        const d = new Date(`${editDate}T${editTime}:00`);
        payload.newScheduledAt = d.toISOString();
      }

      await axios.put(`${API_BASE}/appointments/${selectedAppt.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSelectedAppt(null);
      fetchAppointments();
    } catch (err) {
      alert("Güncelleme başarısız oldu.");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: 900, color: "#0f172a", letterSpacing: "-1px", marginBottom: "8px" }}>Takvim</h1>
          <p style={{ fontSize: "16px", color: "#64748b", fontWeight: 500 }}>
            Haftalık seanslarınızı görüntüleyin ve yönetin.
          </p>
        </div>
        
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button onClick={prevWeek} style={{ background: "white", border: "1px solid #e2e8f0", padding: "8px", borderRadius: "10px", cursor: "pointer", display: "flex" }}>
            <ChevronLeft size={20} color="#475569" />
          </button>
          <div style={{ background: "white", border: "1px solid #e2e8f0", padding: "8px 16px", borderRadius: "10px", fontWeight: 800, color: "#0f172a", fontSize: "14px" }}>
            {days[0].toLocaleDateString("tr-TR", { day: "numeric", month: "short" })} - {days[6].toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })}
          </div>
          <button onClick={nextWeek} style={{ background: "white", border: "1px solid #e2e8f0", padding: "8px", borderRadius: "10px", cursor: "pointer", display: "flex" }}>
            <ChevronRight size={20} color="#475569" />
          </button>
          <button onClick={fetchAppointments} disabled={loading} style={{ background: "white", border: "1px solid #e2e8f0", padding: "8px", borderRadius: "10px", cursor: "pointer", display: "flex", marginLeft: "12px" }}>
            <RefreshCw size={20} color="#4f46e5" className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {error && <p style={{ color: "red", marginBottom: "20px" }}>{error}</p>}

      {isAdmin && (
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", background: "#f1f5f9", padding: "4px", borderRadius: "12px", width: "fit-content" }}>
          <button 
            type="button"
            onClick={() => setOnlyMine(false)} 
            style={{ 
              background: !onlyMine ? "white" : "transparent", 
              border: "none", 
              borderRadius: "8px", 
              padding: "8px 16px", 
              fontWeight: 700, 
              fontSize: "13px", 
              color: !onlyMine ? "#0f172a" : "#64748b", 
              cursor: "pointer", 
              boxShadow: !onlyMine ? "0 1px 3px rgba(0,0,0,0.05)" : "none",
              transition: "all 0.2s"
            }}
          >
            Tüm Salon Takvimi
          </button>
          <button 
            type="button"
            onClick={() => setOnlyMine(true)} 
            style={{ 
              background: onlyMine ? "white" : "transparent", 
              border: "none", 
              borderRadius: "8px", 
              padding: "8px 16px", 
              fontWeight: 700, 
              fontSize: "13px", 
              color: onlyMine ? "#0f172a" : "#64748b", 
              cursor: "pointer", 
              boxShadow: onlyMine ? "0 1px 3px rgba(0,0,0,0.05)" : "none",
              transition: "all 0.2s"
            }}
          >
            Sadece Benim Seanslarım
          </button>
        </div>
      )}

      <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "20px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        {/* Calendar Header */}
        <div style={{ display: "grid", gridTemplateColumns: "80px repeat(7, 1fr)", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
          <div style={{ padding: "16px", borderRight: "1px solid #e2e8f0" }}></div>
          {days.map((day, i) => (
            <div key={i} style={{ padding: "16px", textAlign: "center", borderRight: i < 6 ? "1px solid #e2e8f0" : "none" }}>
              <div style={{ fontSize: "11px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase" }}>{day.toLocaleDateString("tr-TR", { weekday: "short" })}</div>
              <div style={{ fontSize: "20px", fontWeight: 900, color: "#0f172a", marginTop: "4px" }}>{day.getDate()}</div>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div style={{ position: "relative" }}>
          {hours.map(hour => (
            <div key={hour} style={{ display: "grid", gridTemplateColumns: "80px repeat(7, 1fr)" }}>
              <div style={{ height: "60px", borderRight: "1px solid #e2e8f0", borderBottom: "1px solid #f1f5f9", padding: "8px", textAlign: "right", fontSize: "12px", fontWeight: 700, color: "#94a3b8" }}>
                {hour}:00
              </div>
              {days.map((_, dayIndex) => (
                <div key={dayIndex} style={{ height: "60px", borderRight: dayIndex < 6 ? "1px solid #f1f5f9" : "none", borderBottom: "1px solid #f1f5f9", position: "relative" }}>
                  {/* render events here if any match */}
                  {appointments.filter(a => {
                    const d = new Date(a.scheduledAt);
                    return d.getDay() === (dayIndex + 1) % 7 && d.getHours() === hour;
                  }).map(appt => (
                    <div 
                      key={appt.id} 
                      onClick={() => openEditModal(appt)}
                      style={{ 
                        position: "absolute", top: "4px", left: "4px", right: "4px", 
                        background: appt.status === "Cancelled" ? "#fef2f2" : appt.status === "Completed" ? "#f0fdf4" : "#eff6ff", 
                        border: `1px solid ${appt.status === "Cancelled" ? "#fecaca" : appt.status === "Completed" ? "#bbf7d0" : "#bfdbfe"}`,
                        borderRadius: "8px", padding: "4px 8px", cursor: "pointer", zIndex: 10,
                        overflow: "hidden"
                      }}>
                      <div style={{ fontSize: "11px", fontWeight: 800, color: appt.status === "Cancelled" ? "#ef4444" : appt.status === "Completed" ? "#16a34a" : "#4f46e5", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                        {appt.studentName}
                      </div>
                      <div style={{ fontSize: "10px", fontWeight: 600, color: appt.status === "Cancelled" ? "#f87171" : appt.status === "Completed" ? "#4ade80" : "#60a5fa" }}>
                        {new Date(appt.scheduledAt).toTimeString().substring(0,5)} - {appt.status === "Cancelled" ? "İptal" : appt.status === "Completed" ? "Tamamlandı" : "Planlı"}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {selectedAppt && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: "white", borderRadius: "24px", width: "100%", maxWidth: "480px", padding: "32px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 900, color: "#0f172a" }}>Seans Detayı</h2>
                <p style={{ fontSize: "14px", color: "#64748b", fontWeight: 500, marginTop: "4px" }}>
                  {selectedAppt.studentName} - {selectedAppt.packageName}
                </p>
              </div>
              <button onClick={() => setSelectedAppt(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={24} color="#94a3b8" /></button>
            </div>

            <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "24px" }}>
              <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", marginBottom: "6px" }}>Yeni Tarih</label>
                  <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
                </div>
                <div style={{ width: "120px" }}>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", marginBottom: "6px" }}>Yeni Saat</label>
                  <input type="time" value={editTime} onChange={e => setEditTime(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
                </div>
              </div>
              <button 
                onClick={() => handleUpdate()}
                disabled={editLoading}
                style={{ width: "100%", padding: "12px", background: "#4f46e5", color: "white", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
                {editLoading ? <RefreshCw size={18} className="animate-spin" /> : <Edit2 size={18} />}
                Tarih/Saati Güncelle (Ertele)
              </button>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button 
                onClick={() => handleUpdate("Completed")}
                disabled={editLoading || selectedAppt.status === "Completed"}
                style={{ flex: 1, padding: "12px", background: "white", border: "1px solid #10b981", color: "#10b981", borderRadius: "8px", fontWeight: 700, cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "6px" }}>
                <CheckCircle size={18} /> Tamamlandı Yap
              </button>
              <button 
                onClick={() => handleUpdate("Cancelled")}
                disabled={editLoading || selectedAppt.status === "Cancelled"}
                style={{ flex: 1, padding: "12px", background: "white", border: "1px solid #ef4444", color: "#ef4444", borderRadius: "8px", fontWeight: 700, cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "6px" }}>
                <XCircle size={18} /> İptal Et
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
