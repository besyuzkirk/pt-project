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
  trainerId: string;
  trainerName: string;
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
  const [confirmingStatus, setConfirmingStatus] = useState<string | null>(null);
  const [confirmReschedule, setConfirmReschedule] = useState(false);
  
  const [now, setNow] = useState<Date | null>(null); // Init null to avoid hydration mismatch

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => {
      setNow(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

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
    setConfirmingStatus(null);
    setConfirmReschedule(false);
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "8px" }}>
            <h1 style={{ fontSize: "clamp(22px, 5vw, 32px)", fontWeight: 900, color: "#0f172a", letterSpacing: "-1px" }}>Takvim</h1>
            {now && (
              <div style={{ 
                background: "#eff6ff", 
                border: "1px solid #dbeafe", 
                color: "#1e40af", 
                fontSize: "13px", 
                fontWeight: 800, 
                borderRadius: "30px", 
                padding: "6px 14px", 
                display: "flex", 
                alignItems: "center", 
                gap: "8px",
                boxShadow: "0 1px 2px rgba(59,130,246,0.05)"
              }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3b82f6", animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}></span>
                <span>{now.toLocaleDateString("tr-TR", { day: "numeric", month: "long", weekday: "long" })}</span>
                <span style={{ opacity: 0.4 }}>•</span>
                <span style={{ color: "#2563eb" }}>{now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            )}
          </div>
          <p style={{ fontSize: "clamp(13px, 2.5vw, 16px)", color: "#64748b", fontWeight: 500 }}>
            Haftalık seanslarınızı görüntüleyin ve yönetin.
          </p>
        </div>
        
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
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

      <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "24px", overflow: "auto", boxShadow: "0 4px 24px rgba(0,0,0,0.04)", margin: "16px 0" }}>
        {/* Calendar scroll wrapper for mobile */}
        <div style={{ minWidth: "800px" }}>
          {/* Calendar Header */}
          <div style={{ display: "grid", gridTemplateColumns: "80px repeat(7, 1fr)", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
            <div style={{ padding: "16px", borderRight: "1px solid #e2e8f0" }}></div>
            {days.map((day, i) => {
              const isToday = new Date().toDateString() === day.toDateString();
              return (
                <div key={i} style={{ padding: "20px 16px", textAlign: "center", borderRight: i < 6 ? "1px solid #e2e8f0" : "none", background: isToday ? "#eff6ff" : "transparent" }}>
                  <div style={{ fontSize: "11px", fontWeight: 800, color: isToday ? "#3b82f6" : "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{day.toLocaleDateString("tr-TR", { weekday: "short" })}</div>
                  <div style={{ 
                    fontSize: "22px", 
                    fontWeight: 900, 
                    color: isToday ? "#1d4ed8" : "#0f172a", 
                    marginTop: "6px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: isToday ? "#3b82f61a" : "transparent"
                  }}>
                    {day.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Calendar Grid */}
          <div style={{ position: "relative" }}>
            {hours.map(hour => (
              <div key={hour} style={{ display: "grid", gridTemplateColumns: "80px repeat(7, 1fr)" }}>
                <div style={{ 
                  borderRight: "1px solid #e2e8f0", 
                  borderBottom: "1px solid #f1f5f9", 
                  padding: "12px 8px", 
                  textAlign: "right", 
                  fontSize: "13px", 
                  fontWeight: 800, 
                  color: "#64748b", 
                  background: "#fcfcfd",
                  display: "flex", 
                  justifyContent: "flex-end" 
                }}>
                  {hour}:00
                </div>
                {days.map((day, dayIndex) => (
                  <div key={dayIndex} style={{ 
                    minHeight: "80px", 
                    borderRight: dayIndex < 6 ? "1px solid #f1f5f9" : "none", 
                    borderBottom: "1px solid #f1f5f9", 
                    position: "relative", 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: "6px", 
                    padding: "8px", 
                    background: "transparent" 
                  }}>
                    {appointments.filter(a => {
                      const d = new Date(a.scheduledAt);
                      return d.getDay() === (dayIndex + 1) % 7 && d.getHours() === hour;
                    }).map(appt => {
                      const isCancelled = appt.status === "Cancelled";
                      const isCompleted = appt.status === "Completed";
                      
                      let bgColor = "#eff6ff";
                      let borderColor = "#dbeafe";
                      let textColor = "#1e40af";
                      let indicatorColor = "#3b82f6";
                      
                      if (isCancelled) {
                        bgColor = "#fef2f2";
                        borderColor = "#fee2e2";
                        textColor = "#991b1b";
                        indicatorColor = "#ef4444";
                      } else if (isCompleted) {
                        bgColor = "#f0fdf4";
                        borderColor = "#dcfce7";
                        textColor = "#166534";
                        indicatorColor = "#10b981";
                      }

                      return (
                        <div 
                          key={appt.id} 
                          onClick={() => openEditModal(appt)}
                          style={{ 
                            background: bgColor, 
                            border: `1px solid ${borderColor}`,
                            borderLeft: `4px solid ${indicatorColor}`,
                            borderRadius: "10px", 
                            padding: "8px 12px", 
                            cursor: "pointer", 
                            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                            position: "relative",
                            zIndex: 1
                          }}
                        >
                          <div style={{ fontSize: "12px", fontWeight: 800, color: textColor, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "normal" }}>
                            {appt.studentName}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: 700, color: textColor, opacity: 0.8 }}>
                            <Clock size={10} />
                            {new Date(appt.scheduledAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>{/* end min-width wrapper */}
      </div>

      {/* Edit Modal */}
      {selectedAppt && (() => {
        // Find client-side overlapping appointments for selected date/time in existing week
        const overlappingAppts = appointments.filter(a => {
          if (a.id === selectedAppt.id) return false;
          if (a.status === "Cancelled") return false;
          if (a.trainerId !== selectedAppt.trainerId) return false;
          
          try {
            const targetDate = new Date(`${editDate}T${editTime}:00`);
            const apptDate = new Date(a.scheduledAt);
            
            const tStart = targetDate.getTime();
            const tEnd = tStart + (selectedAppt.durationMinutes || 60) * 60 * 1000;
            const aStart = apptDate.getTime();
            const aEnd = aStart + (a.durationMinutes || 60) * 60 * 1000;
            
            return tStart < aEnd && aStart < tEnd;
          } catch {
            return false;
          }
        });

        // Strict duplicate prevention: Ensure this EXACT student doesn't have another overlapping session
        const studentConflict = appointments.find(a => {
          if (a.id === selectedAppt.id) return false;
          if (a.status === "Cancelled") return false;
          if (a.studentId !== selectedAppt.studentId) return false;

          try {
            const targetDate = new Date(`${editDate}T${editTime}:00`);
            const apptDate = new Date(a.scheduledAt);
            
            const tStart = targetDate.getTime();
            const tEnd = tStart + (selectedAppt.durationMinutes || 60) * 60 * 1000;
            const aStart = apptDate.getTime();
            const aEnd = aStart + (a.durationMinutes || 60) * 60 * 1000;

            return tStart < aEnd && aStart < tEnd;
          } catch {
            return false;
          }
        });

        return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: "white", borderRadius: "24px", width: "100%", maxWidth: "480px", padding: "32px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 900, color: "#0f172a" }}>Seans Detayı</h2>
                <p style={{ fontSize: "14px", color: "#64748b", fontWeight: 500, marginTop: "4px" }}>
                  {selectedAppt.studentName} - {selectedAppt.packageName}
                </p>
                <p style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600, marginTop: "2px" }}>
                  Eğitmen: {selectedAppt.trainerName}
                </p>
              </div>
              <button onClick={() => setSelectedAppt(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={24} color="#94a3b8" /></button>
            </div>

            {studentConflict ? (
              <div style={{ 
                background: "#fef2f2", 
                border: "1px solid #fecaca", 
                borderRadius: "14px", 
                padding: "12px 16px", 
                marginBottom: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "4px"
              }}>
                <div style={{ fontSize: "13px", fontWeight: 800, color: "#991b1b", display: "flex", alignItems: "center", gap: "6px" }}>
                  🚫 Çakışma Engellendi
                </div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#ef4444", lineHeight: 1.4 }}>
                  Bu danışanın seçilen saatte zaten aktif bir seansı bulunuyor. Aynı kişiye aynı saatte birden fazla seans atanamaz!
                </div>
              </div>
            ) : (overlappingAppts.length > 0 && (
              <div style={{ 
                background: "#fffbeb", 
                border: "1px solid #fef3c7", 
                borderRadius: "14px", 
                padding: "12px 16px", 
                marginBottom: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) 1"
              }}>
                <div style={{ fontSize: "13px", fontWeight: 800, color: "#b45309", display: "flex", alignItems: "center", gap: "6px" }}>
                  ⚠️ Saat Çakışması
                </div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#d97706", lineHeight: 1.4 }}>
                  Seçilen saatte eğitmenin başka seansı bulunuyor: 
                  <strong style={{ color: "#92400e" }}> {overlappingAppts.map(a => a.studentName).join(", ")}</strong>
                </div>
              </div>
            ))}

            <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "24px" }}>
              <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", marginBottom: "6px" }}>Yeni Tarih</label>
                  <input type="date" value={editDate} onChange={e => { setEditDate(e.target.value); setConfirmReschedule(false); }} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
                </div>
                <div style={{ width: "120px" }}>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", marginBottom: "6px" }}>Yeni Saat</label>
                  <input type="time" value={editTime} onChange={e => { setEditTime(e.target.value); setConfirmReschedule(false); }} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
                </div>
              </div>
              {studentConflict ? (
                <button 
                  disabled={true}
                  style={{ width: "100%", padding: "12px", background: "#f1f5f9", color: "#94a3b8", border: "none", borderRadius: "8px", fontWeight: 800, cursor: "not-allowed", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
                  🚫 Geçersiz Saat Seçimi
                </button>
              ) : confirmReschedule ? (() => {
                const formattedDateStr = (() => {
                  try {
                    const d = new Date(`${editDate}T${editTime}:00`);
                    const datePart = d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", weekday: "long" });
                    return `${datePart} saat ${editTime}`;
                  } catch {
                    return `${editDate} ${editTime}`;
                  }
                })();

                const hasConflict = overlappingAppts.length > 0;
                const boxBg = hasConflict ? "#fffbeb" : "#eff6ff";
                const boxBorder = hasConflict ? "#fde68a" : "#dbeafe";
                const textColor = hasConflict ? "#92400e" : "#1e40af";
                const btnBg = hasConflict ? "#d97706" : "#4f46e5";

                return (
                  <div style={{ 
                    background: boxBg, 
                    border: `1px solid ${boxBorder}`, 
                    borderRadius: "10px", 
                    padding: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginTop: "8px"
                  }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: textColor, textAlign: "center", lineHeight: 1.5 }}>
                      {hasConflict ? "⚠️ Saat Çakışması Var! " : ""}
                      Seansı <strong>{formattedDateStr}</strong> tarihine güncellemek istediğinize emin misiniz?
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button 
                        onClick={() => {
                          setConfirmReschedule(false);
                          handleUpdate();
                        }}
                        disabled={editLoading}
                        style={{ 
                          flex: 1, padding: "8px", background: btnBg, color: "white", 
                          border: "none", borderRadius: "6px", fontWeight: 800, fontSize: "12px", cursor: "pointer",
                          display: "flex", justifyContent: "center", alignItems: "center", gap: "4px"
                        }}
                      >
                        {editLoading ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                        Evet, Güncelle
                      </button>
                      <button 
                        onClick={() => setConfirmReschedule(false)}
                        disabled={editLoading}
                        style={{ 
                          flex: 1, padding: "8px", background: "white", border: "1px solid #d1d5db", 
                          color: "#4b5563", borderRadius: "6px", fontWeight: 700, fontSize: "12px", cursor: "pointer" 
                        }}
                      >
                        Vazgeç
                      </button>
                    </div>
                  </div>
                );
              })() : (
                <button 
                  onClick={() => setConfirmReschedule(true)}
                  disabled={editLoading}
                  style={{ width: "100%", padding: "12px", background: "#4f46e5", color: "white", border: "none", borderRadius: "8px", fontWeight: 800, cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
                  {editLoading ? <RefreshCw size={18} className="animate-spin" /> : <Edit2 size={18} />}
                  Tarih/Saati Güncelle (Ertele)
                </button>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {!confirmingStatus ? (
                <div style={{ display: "flex", gap: "12px" }}>
                  <button 
                    onClick={() => setConfirmingStatus("Completed")}
                    disabled={editLoading || selectedAppt.status === "Completed"}
                    style={{ flex: 1, padding: "12px", background: "white", border: "1px solid #10b981", color: "#10b981", borderRadius: "10px", fontWeight: 800, cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "6px" }}>
                    <CheckCircle size={18} /> Tamamlandı Yap
                  </button>
                  <button 
                    onClick={() => setConfirmingStatus("Cancelled")}
                    disabled={editLoading || selectedAppt.status === "Cancelled"}
                    style={{ flex: 1, padding: "12px", background: "white", border: "1px solid #ef4444", color: "#ef4444", borderRadius: "10px", fontWeight: 800, cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "6px" }}>
                    <XCircle size={18} /> İptal Et
                  </button>
                </div>
              ) : (
                <div style={{ 
                  background: confirmingStatus === "Completed" ? "#f0fdf4" : "#fef2f2", 
                  border: `1px solid ${confirmingStatus === "Completed" ? "#bbf7d0" : "#fecaca"}`,
                  padding: "16px", borderRadius: "14px", display: "flex", flexDirection: "column", gap: "12px" 
                }}>
                  <p style={{ fontSize: "14px", fontWeight: 800, color: confirmingStatus === "Completed" ? "#166534" : "#991b1b", textAlign: "center", margin: 0 }}>
                    {confirmingStatus === "Completed" ? "Bu seansı tamamlandı olarak işaretlemek istediğinize emin misiniz?" : "Bu seansı iptal etmek istediğinize emin misiniz?"}
                  </p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button 
                      onClick={() => handleUpdate(confirmingStatus)}
                      disabled={editLoading}
                      style={{ 
                        flex: 1, padding: "10px", 
                        background: confirmingStatus === "Completed" ? "#10b981" : "#ef4444", 
                        color: "white", border: "none", borderRadius: "10px", fontWeight: 800, cursor: "pointer",
                        display: "flex", justifyContent: "center", alignItems: "center", gap: "6px"
                      }}
                    >
                      {editLoading ? <RefreshCw size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                      Evet, Eminim
                    </button>
                    <button 
                      onClick={() => setConfirmingStatus(null)}
                      disabled={editLoading}
                      style={{ 
                        flex: 1, padding: "10px", background: "white", 
                        border: "1px solid #cbd5e1", color: "#475569", borderRadius: "10px", 
                        fontWeight: 800, cursor: "pointer" 
                      }}
                    >
                      Vazgeç
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        );
      })()}
    </div>
  );
}
