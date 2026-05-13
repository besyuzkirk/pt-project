"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  User, Phone, Mail, Calendar, Ruler, Info,
  Package, CheckCircle, XCircle, Clock,
  ChevronRight, ArrowLeft, Loader2, Plus, X, Image as ImageIcon,
  Trash2, CreditCard
} from "lucide-react";
import Link from "next/link";
import axios from "axios";

const API_BASE = "http://localhost:5064/api";

const translateGender = (gender: string | undefined) => {
  if (!gender) return "—";
  const g = gender.toLowerCase();
  if (g === "male") return "Erkek";
  if (g === "female") return "Kadın";
  if (g === "other") return "Diğer";
  return gender;
};

const translateBloodType = (bloodType: string | undefined) => {
  if (!bloodType) return "—";
  const b = bloodType.toLowerCase();
  if (b === "apositive") return "A RH +";
  if (b === "anegative") return "A RH -";
  if (b === "bpositive") return "B RH +";
  if (b === "bnegative") return "B RH -";
  if (b === "abpositive") return "AB RH +";
  if (b === "abnegative") return "AB RH -";
  if (b === "opositive") return "0 RH +";
  if (b === "onegative") return "0 RH -";
  return bloodType;
};

interface Membership {
  id: string;
  packageName: string;
  trainerName: string;
  totalSessions?: number;
  usedSessions: number;
  startDate: string;
  endDate?: string;
  status: string;
}

interface Measurement {
  id: string;
  recordedAt: string;
  weightKg?: number;
  bodyFatPercentage?: number;
  shoulderCm?: number;
  chestCm?: number;
  waistCm?: number;
  hipCm?: number;
  armLeftCm?: number;
  armRightCm?: number;
  legLeftCm?: number;
  legRightCm?: number;
  notes?: string;
  frontPhotoUrl?: string;
  sidePhotoUrl?: string;
  backPhotoUrl?: string;
}

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
  email: string;
  phoneNumber: string;
  dateOfBirth?: string;
  gender?: string;
  bloodType?: string;
  heightCm?: number;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  notes?: string;
  assignedTrainerId?: string;
  assignedTrainerName?: string;
  lastLoginAt?: string;
  createdAt: string;
  memberships: Membership[];
  measurements: Measurement[];
  workoutSessions: WorkoutSession[];
}

export default function StudentDetailPage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMeasurement, setSelectedMeasurement] = useState<Measurement | null>(null);

  // --- States for Integrated Package Assignment Modal ---
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [packages, setPackages] = useState<any[]>([]);
  const [packageForm, setPackageForm] = useState({
    packageId: "",
    startDate: new Date().toISOString().split("T")[0],
    discountAmount: "0",
    paymentMethod: "Cash",
    paymentStatus: "Paid"
  });
  const [schedule, setSchedule] = useState<{ dayOfWeek: number, time: string }[]>([]);
  const [dayInput, setDayInput] = useState("1");
  const [timeInput, setTimeInput] = useState("10:00");
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState("");
  
  const dayNames = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

  const fetchProfile = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/users/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
    } catch (err: any) {
      setError("Profil yüklenirken bir hata oluştu.");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProfile();
  }, [id]);

  useEffect(() => {
    if (showAssignModal && packages.length === 0) {
      const fetchPackages = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(`${API_BASE}/packages`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setPackages(res.data);
        } catch (err) {
          console.error("Paketler alınamadı", err);
        }
      };
      fetchPackages();
    }
  }, [showAssignModal, packages.length]);

  const handlePackageChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setPackageForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addScheduleItem = () => {
    setSchedule(prev => [...prev, { dayOfWeek: parseInt(dayInput), time: timeInput }]);
  };

  const removeScheduleItem = (index: number) => {
    setSchedule(prev => prev.filter((_, i) => i !== index));
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageForm.packageId || !packageForm.startDate) {
      setAssignError("Lütfen gerekli alanları doldurun.");
      return;
    }
    if (schedule.length === 0) {
      setAssignError("Lütfen en az bir haftalık program ekleyin.");
      return;
    }

    setAssignLoading(true);
    setAssignError("");

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE}/memberships/assign`, {
        studentId: id,
        packageId: packageForm.packageId,
        startDate: packageForm.startDate,
        discountAmount: parseFloat(packageForm.discountAmount) || 0,
        paymentMethod: packageForm.paymentMethod,
        paymentStatus: packageForm.paymentStatus,
        weeklySchedule: schedule.map(s => ({
            dayOfWeek: s.dayOfWeek,
            time: s.time + ":00"
        }))
      }, { headers: { Authorization: `Bearer ${token}` } });

      setShowAssignModal(false);
      setPackageForm({
        packageId: "",
        startDate: new Date().toISOString().split("T")[0],
        discountAmount: "0",
        paymentMethod: "Cash",
        paymentStatus: "Paid"
      });
      setSchedule([]);
      fetchProfile(true); // Silent Refresh update
    } catch (err: any) {
      setAssignError(err.response?.data || "Paket atanırken bir hata oluştu.");
    } finally {
      setAssignLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
        <Loader2 className="animate-spin" size={32} />
        <span style={{ marginLeft: "12px", fontWeight: 600 }}>Danışan profili yükleniyor...</span>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <p style={{ color: "#ef4444", fontWeight: 700 }}>{error || "Profil bulunamadı."}</p>
        <Link href="/dashboard/students">
          <button style={{ marginTop: "20px", padding: "10px 20px", background: "#f1f5f9", border: "none", borderRadius: "10px", fontWeight: 700, cursor: "pointer" }}>
            Geri Dön
          </button>
        </Link>
      </div>
    );
  }

  const activeMemberships = profile.memberships.filter(m => m.status === "Active");
  const pastMemberships = profile.memberships.filter(m => m.status !== "Active");
  const latestMeasurement = profile.measurements.length > 0 ? profile.measurements[0] : null;

  const cardStyle = {
    background: "white", border: "1px solid #e2e8f0", borderRadius: "20px", padding: "28px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
  };

  const inputStyle = {
    width: "100%", height: "48px", background: "#f8fafc", border: "1px solid #e2e8f0",
    borderRadius: "10px", padding: "0 14px", fontSize: "14px", outline: "none",
    color: "#0f172a", fontFamily: "inherit", cursor: "pointer"
  };

  const labelStyle = {
    fontSize: "11px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "4px"
  };

  const infoItemStyle = {
    display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px"
  };

  return (
    <div>
      {/* Navigation */}
      <Link href="/dashboard/students" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", color: "#64748b", fontWeight: 600, fontSize: "14px", marginBottom: "24px" }}>
        <ArrowLeft size={16} />
        Tüm Danışanlara Dön
      </Link>

      {/* Profile Header */}
      <div className="student-header-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
        <div className="student-header-info" style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div style={{ width: "80px", height: "80px", background: "#eff6ff", color: "#4f46e5", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "28px" }}>
            {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
          </div>
          <div>
            <h1 style={{ fontSize: "36px", fontWeight: 900, color: "#0f172a", letterSpacing: "-1px", marginBottom: "4px" }}>
              {profile.firstName} {profile.lastName}
            </h1>
            <div style={{ display: "flex", gap: "16px", color: "#64748b", fontWeight: 500, fontSize: "14px", marginBottom: "8px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Phone size={14} /> {profile.phoneNumber}</span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Mail size={14} /> {profile.email}</span>
            </div>
            {profile.assignedTrainerName && (
              <div style={{ display: "inline-flex", alignItems: "center", background: "#f0fdf4", color: "#16a34a", padding: "4px 10px", borderRadius: "10px", fontSize: "12px", fontWeight: 700 }}>
                Eğitmen: {profile.assignedTrainerName}
              </div>
            )}
          </div>
        </div>
        <div className="student-header-actions" style={{ display: "flex", gap: "12px" }}>
          <button 
            onClick={() => setShowAssignModal(true)}
            className="btn-action-primary" 
            style={{ background: "#4f46e5" }} 
            onMouseOver={(e) => e.currentTarget.style.background = "#4338ca"} 
            onMouseOut={(e) => e.currentTarget.style.background = "#4f46e5"}
          >
            <Package size={18} />
            Paket Ata
          </button>
          <Link href={`/dashboard/students/${profile.id}/measurements/new`} style={{ textDecoration: "none" }}>
            <button className="btn-action-primary">
              <Ruler size={18} />
              Ölçü Gir
            </button>
          </Link>
        </div>
      </div>

      <div className="student-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "32px" }}>
        {/* Left Column: Personal Info & Stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

          {/* Stats Summary */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ ...cardStyle, padding: "20px", background: "#f8fafc" }}>
              <div style={labelStyle}>Aktif Paket</div>
              <div style={{ fontSize: "24px", fontWeight: 900, color: "#0f172a" }}>{activeMemberships.length}</div>
            </div>
            <div style={{ ...cardStyle, padding: "20px", background: "#f8fafc" }}>
              <div style={labelStyle}>Toplam Ölçüm</div>
              <div style={{ fontSize: "24px", fontWeight: 900, color: "#0f172a" }}>{profile.measurements.length}</div>
            </div>
          </div>

          {/* Personal Information */}
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
              <Info size={18} color="#4f46e5" />
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>Kişisel Bilgiler</h3>
            </div>

            <div style={infoItemStyle}>
              <div style={{ width: "36px", height: "36px", background: "#f1f5f9", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}><Calendar size={18} color="#64748b" /></div>
              <div>
                <div style={labelStyle}>Doğum Tarihi</div>
                <div style={{ fontWeight: 700, color: "#334155" }}>{profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString("tr-TR") : "—"}</div>
              </div>
            </div>

            <div style={infoItemStyle}>
              <div style={{ width: "36px", height: "36px", background: "#f1f5f9", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}><User size={18} color="#64748b" /></div>
              <div>
                <div style={labelStyle}>Cinsiyet / Kan Grubu</div>
                <div style={{ fontWeight: 700, color: "#334155" }}>{translateGender(profile.gender)} / {translateBloodType(profile.bloodType)}</div>
              </div>
            </div>

            <div style={infoItemStyle}>
              <div style={{ width: "36px", height: "36px", background: "#f1f5f9", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}><Ruler size={18} color="#64748b" /></div>
              <div>
                <div style={labelStyle}>Boy</div>
                <div style={{ fontWeight: 700, color: "#334155" }}>{profile.heightCm ? `${profile.heightCm} cm` : "—"}</div>
              </div>
            </div>

            <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #f1f5f9" }}>
              <div style={labelStyle}>Notlar</div>
              <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.6, fontWeight: 500 }}>
                {profile.notes || "Bu danışan hakkında henüz bir not bulunmuyor."}
              </p>
            </div>
          </div>

          {/* Emergency Contact */}
          <div style={{ ...cardStyle, background: "#fef2f2", borderColor: "#fee2e2" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#991b1b", textTransform: "uppercase", marginBottom: "16px" }}>Acil Durum Kişisi</h3>
            <div style={{ fontWeight: 800, color: "#0f172a", marginBottom: "4px" }}>{profile.emergencyContactName || "—"}</div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#ef4444" }}>{profile.emergencyContactPhone || "—"}</div>
          </div>

          {/* Workout Session Logs (Last 3) */}
          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle size={18} color="#10b981" />
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>Son Girişler / Loglar</h3>
              </div>
              <span style={{ fontSize: "11px", fontWeight: 800, color: "#10b981", background: "#f0fdf4", padding: "4px 10px", borderRadius: "20px" }}>
                {profile.workoutSessions.length} Giriş
              </span>
            </div>

            {profile.workoutSessions.length === 0 ? (
              <p style={{ color: "#94a3b8", fontSize: "13px", fontWeight: 500, textAlign: "center", padding: "20px 0" }}>Henüz giriş kaydı bulunmuyor.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {profile.workoutSessions.slice(0, 3).map((session, idx) => (
                  <div key={session.id || idx} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                    <div style={{ width: "36px", height: "36px", background: "#d1fae5", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981" }}>
                      <CheckCircle size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a" }}>
                        {session.startedAt ? new Date(session.startedAt).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                      </div>
                      <div style={{ fontSize: "11px", fontWeight: 600, color: "#64748b" }}>Eğitmen: {session.trainerName}</div>
                    </div>
                  </div>
                ))}

                <Link href={`/dashboard/students/${profile.id}/logs`} style={{ textDecoration: "none" }}>
                  <button
                    style={{ width: "100%", marginTop: "8px", padding: "10px", background: "#f1f5f9", border: "none", borderRadius: "10px", color: "#475569", fontSize: "13px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                    onMouseOver={(e) => e.currentTarget.style.background = "#e2e8f0"}
                    onMouseOut={(e) => e.currentTarget.style.background = "#f1f5f9"}
                  >
                    Tüm Girişleri Gör ({profile.workoutSessions.length}) <ChevronRight size={14} />
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Packages & Measurements */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

          {/* Active Packages */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: 900, color: "#0f172a" }}>Aktif Paketler</h3>
              <span style={{ fontSize: "12px", fontWeight: 800, color: "#10b981", background: "#f0fdf4", padding: "4px 12px", borderRadius: "20px" }}>
                {activeMemberships.length} Aktif
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {activeMemberships.length === 0 ? (
                <div style={{ ...cardStyle, padding: "40px", textAlign: "center", color: "#94a3b8" }}>
                  Aktif paket bulunmuyor.
                </div>
              ) : (
                activeMemberships.map(m => (
                  <div key={m.id} style={cardStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <Package size={18} color="#4f46e5" />
                          <h4 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>{m.packageName}</h4>
                        </div>
                        <div style={{ fontSize: "13px", color: "#64748b", fontWeight: 600 }}>Eğitmen: {m.trainerName}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "20px", fontWeight: 900, color: "#4f46e5" }}>
                          {m.usedSessions} / {m.totalSessions || "∞"}
                        </div>
                        <div style={labelStyle}>Seans Tamamlandı</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {m.totalSessions && (
                      <div style={{ height: "10px", background: "#f1f5f9", borderRadius: "10px", overflow: "hidden", marginBottom: "16px" }}>
                        <div style={{ width: `${(m.usedSessions / m.totalSessions) * 100}%`, height: "100%", background: "linear-gradient(90deg, #4f46e5, #818cf8)", borderRadius: "10px" }}></div>
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", fontWeight: 600, color: "#64748b" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><Clock size={14} /> Başlangıç: {new Date(m.startDate).toLocaleDateString("tr-TR")}</div>
                      {m.endDate && <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><Calendar size={14} /> Bitiş: {new Date(m.endDate).toLocaleDateString("tr-TR")}</div>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Latest Measurement Widget */}
          {latestMeasurement && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: 900, color: "#0f172a" }}>Son Ölçüm Bilgileri</h3>
                <span style={{ fontSize: "12px", fontWeight: 800, color: "#6366f1", background: "#e0e7ff", padding: "4px 12px", borderRadius: "20px" }}>
                  {new Date(latestMeasurement.recordedAt).toLocaleDateString("tr-TR")}
                </span>
              </div>
              <div style={cardStyle}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
                  <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "14px", textAlign: "center" }}>
                    <div style={labelStyle}>Kilo</div>
                    <div style={{ fontSize: "22px", fontWeight: 900, color: "#0f172a" }}>{latestMeasurement.weightKg ? `${latestMeasurement.weightKg} kg` : "—"}</div>
                  </div>
                  <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "14px", textAlign: "center" }}>
                    <div style={labelStyle}>Yağ Oranı</div>
                    <div style={{ fontSize: "22px", fontWeight: 900, color: "#0f172a" }}>{latestMeasurement.bodyFatPercentage ? `%${latestMeasurement.bodyFatPercentage}` : "—"}</div>
                  </div>
                  <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "14px", textAlign: "center" }}>
                    <div style={labelStyle}>Bel</div>
                    <div style={{ fontSize: "22px", fontWeight: 900, color: "#0f172a" }}>{latestMeasurement.waistCm ? `${latestMeasurement.waistCm} cm` : "—"}</div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                  {[
                    { title: "Ön Cephe", url: latestMeasurement.frontPhotoUrl },
                    { title: "Yan Cephe", url: latestMeasurement.sidePhotoUrl },
                    { title: "Arka Cephe", url: latestMeasurement.backPhotoUrl }
                  ].map((photo, idx) => (
                    <div key={idx} style={{ height: "160px", background: "#f1f5f9", borderRadius: "12px", overflow: "hidden", position: "relative", border: "1px solid #e2e8f0" }}>
                      {photo.url ? (
                        <img src={`${API_BASE.replace('/api', '')}${photo.url}`} alt={photo.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
                          <ImageIcon size={24} style={{ marginBottom: "8px" }} />
                          <span style={{ fontSize: "11px", fontWeight: 700 }}>Fotoğraf Yok</span>
                        </div>
                      )}
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(15, 23, 42, 0.7)", color: "white", fontSize: "11px", fontWeight: 700, padding: "6px", textAlign: "center", backdropFilter: "blur(4px)" }}>
                        {photo.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Measurements History */}
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: 900, color: "#0f172a", marginBottom: "16px" }}>Ölçüm Geçmişi</h3>
            <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
              {profile.measurements.length === 0 ? (
                <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
                  Kayıtlı ölçüm bulunmuyor.
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                      <th style={{ padding: "14px 24px", textAlign: "left", ...labelStyle }}>Tarih</th>
                      <th style={{ padding: "14px 24px", textAlign: "left", ...labelStyle }}>Ağırlık</th>
                      <th style={{ padding: "14px 24px", textAlign: "left", ...labelStyle }}>Yağ %</th>
                      <th style={{ padding: "14px 24px", textAlign: "left", ...labelStyle }}>Bel</th>
                      <th style={{ padding: "14px 24px", textAlign: "right", ...labelStyle }}>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.measurements.map(meas => (
                      <tr key={meas.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                        <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>
                          {new Date(meas.recordedAt).toLocaleDateString("tr-TR")}
                        </td>
                        <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: 600, color: "#475569" }}>
                          {meas.weightKg ? `${meas.weightKg} kg` : "—"}
                        </td>
                        <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: 600, color: "#475569" }}>
                          {meas.bodyFatPercentage ? `%${meas.bodyFatPercentage}` : "—"}
                        </td>
                        <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: 600, color: "#475569" }}>
                          {meas.waistCm ? `${meas.waistCm} cm` : "—"}
                        </td>
                        <td style={{ padding: "16px 24px", textAlign: "right" }}>
                          <button
                            onClick={() => setSelectedMeasurement(meas)}
                            style={{ background: "#e0e7ff", border: "none", color: "#4f46e5", cursor: "pointer", fontWeight: 800, fontSize: "12px", padding: "6px 14px", borderRadius: "8px" }}
                          >
                            Detay
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Past Packages */}
          {pastMemberships.length > 0 && (
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#64748b", marginBottom: "16px" }}>Geçmiş Paketler</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {pastMemberships.map(m => (
                  <div key={m.id} style={{ ...cardStyle, padding: "16px 24px", background: "#f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <Package size={16} color="#94a3b8" />
                      <div>
                        <div style={{ fontSize: "15px", fontWeight: 700, color: "#475569" }}>{m.packageName}</div>
                        <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}>{new Date(m.startDate).toLocaleDateString("tr-TR")} - {m.endDate ? new Date(m.endDate).toLocaleDateString("tr-TR") : "Bilinmiyor"}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#94a3b8" }}>
                      <CheckCircle size={16} />
                      <span style={{ fontSize: "12px", fontWeight: 700 }}>{m.status === "Completed" ? "Tamamlandı" : "İptal"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Measurement Detail Modal */}
      {selectedMeasurement && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
          <div style={{ background: "white", width: "90%", maxWidth: "800px", maxHeight: "90vh", borderRadius: "24px", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}>

            {/* Modal Header */}
            <div style={{ padding: "24px 32px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc" }}>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 900, color: "#0f172a", marginBottom: "4px" }}>Ölçüm Detayları</h2>
                <div style={{ fontSize: "13px", color: "#64748b", fontWeight: 600 }}>Tarih: {new Date(selectedMeasurement.recordedAt).toLocaleDateString("tr-TR")}</div>
              </div>
              <button
                onClick={() => setSelectedMeasurement(null)}
                style={{ width: "36px", height: "36px", borderRadius: "10px", background: "white", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "clamp(16px, 4vw, 32px)", overflowY: "auto" }}>

              <div className="measurement-modal-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(16px, 4vw, 32px)" }}>

                {/* Left side: Measurements */}
                <div>
                  <h4 style={{ fontSize: "12px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>Vücut Kompozisyonu</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
                    <div style={{ background: "#f1f5f9", padding: "12px", borderRadius: "10px" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b" }}>Kilo</div>
                      <div style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>{selectedMeasurement.weightKg ? `${selectedMeasurement.weightKg} kg` : "—"}</div>
                    </div>
                    <div style={{ background: "#f1f5f9", padding: "12px", borderRadius: "10px" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b" }}>Yağ Oranı</div>
                      <div style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>{selectedMeasurement.bodyFatPercentage ? `%${selectedMeasurement.bodyFatPercentage}` : "—"}</div>
                    </div>
                  </div>

                  <h4 style={{ fontSize: "12px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>Çevre Ölçümleri (cm)</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", borderBottom: "1px solid #e2e8f0" }}>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "#475569" }}>Omuz</span>
                      <span style={{ fontSize: "14px", fontWeight: 800, color: "#0f172a" }}>{selectedMeasurement.shoulderCm || "—"}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", borderBottom: "1px solid #e2e8f0" }}>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "#475569" }}>Göğüs</span>
                      <span style={{ fontSize: "14px", fontWeight: 800, color: "#0f172a" }}>{selectedMeasurement.chestCm || "—"}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", borderBottom: "1px solid #e2e8f0" }}>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "#475569" }}>Bel</span>
                      <span style={{ fontSize: "14px", fontWeight: 800, color: "#0f172a" }}>{selectedMeasurement.waistCm || "—"}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", borderBottom: "1px solid #e2e8f0" }}>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "#475569" }}>Kalça</span>
                      <span style={{ fontSize: "14px", fontWeight: 800, color: "#0f172a" }}>{selectedMeasurement.hipCm || "—"}</span>
                    </div>
                  </div>

                  <h4 style={{ fontSize: "12px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>Kol & Bacak (cm)</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "10px", display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748b" }}>Sol Kol</span>
                      <span style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a" }}>{selectedMeasurement.armLeftCm || "—"}</span>
                    </div>
                    <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "10px", display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748b" }}>Sağ Kol</span>
                      <span style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a" }}>{selectedMeasurement.armRightCm || "—"}</span>
                    </div>
                    <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "10px", display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748b" }}>Sol Bacak</span>
                      <span style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a" }}>{selectedMeasurement.legLeftCm || "—"}</span>
                    </div>
                    <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "10px", display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748b" }}>Sağ Bacak</span>
                      <span style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a" }}>{selectedMeasurement.legRightCm || "—"}</span>
                    </div>
                  </div>

                  {selectedMeasurement.notes && (
                    <div style={{ marginTop: "24px", padding: "16px", background: "#fdf8f6", borderRadius: "12px", border: "1px solid #fce7f3" }}>
                      <div style={{ fontSize: "11px", fontWeight: 800, color: "#db2777", textTransform: "uppercase", marginBottom: "8px" }}>Ek Notlar</div>
                      <div style={{ fontSize: "13px", color: "#475569", lineHeight: 1.5 }}>{selectedMeasurement.notes}</div>
                    </div>
                  )}

                </div>

                {/* Right side: Photos */}
                <div>
                  <h4 style={{ fontSize: "12px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>Gelişim Fotoğrafları</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {[
                      { title: "Ön Cephe", url: selectedMeasurement.frontPhotoUrl },
                      { title: "Yan Cephe", url: selectedMeasurement.sidePhotoUrl },
                      { title: "Arka Cephe", url: selectedMeasurement.backPhotoUrl }
                    ].map((photo, idx) => (
                      <div key={idx} style={{ height: "160px", background: "#f1f5f9", borderRadius: "14px", overflow: "hidden", position: "relative", border: "1px solid #e2e8f0" }}>
                        {photo.url ? (
                          <img src={`${API_BASE.replace('/api', '')}${photo.url}`} alt={photo.title} style={{ width: "100%", height: "100%", objectFit: "contain", background: "black" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
                            <ImageIcon size={24} style={{ marginBottom: "8px" }} />
                            <span style={{ fontSize: "11px", fontWeight: 700 }}>{photo.title} Yok</span>
                          </div>
                        )}
                        <div style={{ position: "absolute", top: 8, left: 8, background: "rgba(15, 23, 42, 0.7)", color: "white", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "20px", backdropFilter: "blur(4px)" }}>
                          {photo.title}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}



      {/* Assign Package Modal */}
      {showAssignModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
          <div style={{ background: "white", width: "90%", maxWidth: "650px", maxHeight: "95vh", borderRadius: "24px", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}>
            {/* Modal Header */}
            <div style={{ padding: "24px 32px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc" }}>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 900, color: "#0f172a", marginBottom: "4px" }}>Yeni Paket Tanımla</h2>
                <div style={{ fontSize: "13px", color: "#64748b", fontWeight: 600 }}>{profile.firstName} {profile.lastName} için paket planlayın.</div>
              </div>
              <button
                onClick={() => setShowAssignModal(false)}
                style={{ width: "36px", height: "36px", borderRadius: "10px", background: "white", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "32px", overflowY: "auto" }}>
              {assignError && (
                <div style={{ background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: "12px", padding: "14px 16px", marginBottom: "20px" }}>
                  <p style={{ color: "#dc2626", fontWeight: 700, fontSize: "13px" }}>{assignError}</p>
                </div>
              )}

              <form onSubmit={handleAssignSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div className="form-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}><Package size={12} style={{ display: "inline", marginRight: 4 }}/> Paket</label>
                    <select name="packageId" value={packageForm.packageId} onChange={handlePackageChange} style={inputStyle} required>
                      <option value="">Paket Seçin</option>
                      {packages.map(p => <option key={p.id} value={p.id}>{p.name} ({p.totalSessions ?? "Sınırsız"} Seans) - {p.price} {p.currency}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}><Calendar size={12} style={{ display: "inline", marginRight: 4 }}/> Başlangıç Tarihi</label>
                    <input type="date" name="startDate" value={packageForm.startDate} onChange={handlePackageChange} style={inputStyle} required />
                  </div>
                </div>

                <div className="form-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}><CreditCard size={12} style={{ display: "inline", marginRight: 4 }}/> İndirim Tutarı ({packages.find(p => p.id === packageForm.packageId)?.currency || "TRY"})</label>
                    <input type="number" name="discountAmount" value={packageForm.discountAmount} onChange={handlePackageChange} min="0" style={inputStyle} />
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end" }}>
                    {packageForm.packageId && (
                      <div style={{ width: "100%", background: "#f0f9ff", padding: "12px 16px", borderRadius: "10px", border: "1px solid #bae6fd", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: "11px", fontWeight: 800, color: "#0369a1" }}>NET ÖDENECEK</div>
                        <div style={{ fontSize: "18px", fontWeight: 900, color: "#0369a1" }}>
                          {Math.max(0, (packages.find(p => p.id === packageForm.packageId)?.price || 0) - (parseFloat(packageForm.discountAmount) || 0))} {packages.find(p => p.id === packageForm.packageId)?.currency}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}>Ödeme Yöntemi</label>
                    <select name="paymentMethod" value={packageForm.paymentMethod} onChange={handlePackageChange} style={inputStyle} required>
                      <option value="Cash">Nakit</option>
                      <option value="Card">Kredi Kartı</option>
                      <option value="Transfer">Havale / EFT</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Ödeme Durumu</label>
                    <select name="paymentStatus" value={packageForm.paymentStatus} onChange={handlePackageChange} style={inputStyle} required>
                      <option value="Paid">Ödendi</option>
                      <option value="Pending">Ödenecek (Beklemede)</option>
                    </select>
                  </div>
                </div>

                <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                  <h3 style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a", marginBottom: "12px" }}>Haftalık Program Planı</h3>
                  
                  <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                    <select value={dayInput} onChange={(e) => setDayInput(e.target.value)} style={{ ...inputStyle, flex: 1 }}>
                      <option value="1">Pazartesi</option>
                      <option value="2">Salı</option>
                      <option value="3">Çarşamba</option>
                      <option value="4">Perşembe</option>
                      <option value="5">Cuma</option>
                      <option value="6">Cumartesi</option>
                      <option value="0">Pazar</option>
                    </select>
                    <input type="time" value={timeInput} onChange={(e) => setTimeInput(e.target.value)} style={{ ...inputStyle, width: "100px" }} />
                    <button type="button" onClick={addScheduleItem} style={{ background: "#4f46e5", color: "white", border: "none", borderRadius: "10px", padding: "0 16px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "13px" }}>
                      <Plus size={14} /> Ekle
                    </button>
                  </div>

                  {schedule.length > 0 ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {schedule.map((item, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", background: "white", padding: "6px 12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                          <span style={{ fontWeight: 700, fontSize: "12px", color: "#0f172a" }}>{dayNames[item.dayOfWeek]} {item.time}</span>
                          <button type="button" onClick={() => removeScheduleItem(idx)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "2px" }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: "#94a3b8", fontSize: "12px", fontWeight: 500 }}>Haftalık seans programı seçilmedi.</p>
                  )}
                </div>

                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "16px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                  <button type="button" onClick={() => setShowAssignModal(false)} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "12px 24px", color: "#475569", fontWeight: 700, cursor: "pointer" }}>
                    İptal
                  </button>
                  <button type="submit" disabled={assignLoading} className="btn-action-primary" style={{ opacity: assignLoading ? 0.7 : 1, padding: "12px 28px" }}>
                    {assignLoading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                    {assignLoading ? "Tanımlanıyor..." : "Paketi Tanımla"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
