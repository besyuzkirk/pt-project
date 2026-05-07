"use client";

import { useState, useEffect } from "react";
import { Save, ArrowLeft, Loader2, CheckCircle, UserPlus, ShieldCheck } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useRole } from "../../lib/useRole";

const API_BASE = "http://localhost:5064/api";

interface TrainerItem {
  id: string;
  fullName: string;
}

export default function RegisterStudentPage() {
  const { isAdmin, trainerId, isLoading: roleLoading } = useRole();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    bloodType: "",
    notes: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    selectedTrainerId: "",
    assignToMe: true,
  });
  
  const [trainers, setTrainers] = useState<TrainerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successName, setSuccessName] = useState<string | null>(null); // null = no popup

  useEffect(() => {
    // If Admin, fetch all trainers so they can assign the student to someone
    if (!roleLoading && isAdmin) {
      const fetchTrainers = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(`${API_BASE}/users/trainers`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setTrainers(res.data);
        } catch (err) {
          console.error("Trainerlar alınamadı", err);
        }
      };
      fetchTrainers();
    }
  }, [isAdmin, roleLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessName(null);

    try {
      const token = localStorage.getItem("token");
      
      // If user is Admin, use the selectedTrainerId from the dropdown (if any)
      // If user is Trainer, use trainerId if assignToMe is true
      const assignedTrainerId = isAdmin ? (form.selectedTrainerId || null) : (form.assignToMe ? trainerId : null);

      await axios.post(
        `${API_BASE}/auth/register-phone`,
        {
          phoneNumber: form.phoneNumber,
          firstName: form.firstName,
          lastName: form.lastName,
          role: 2, // Role.Student = 2
          trainerId: assignedTrainerId,
          gender: form.gender !== "" ? parseInt(form.gender) : null,
          bloodType: form.bloodType !== "" ? parseInt(form.bloodType) : null,
          dateOfBirth: form.dateOfBirth || null,
          notes: form.notes || null,
          emergencyContactName: form.emergencyContactName || null,
          emergencyContactPhone: form.emergencyContactPhone || null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessName(`${form.firstName} ${form.lastName}`);
      setForm({ firstName: "", lastName: "", phoneNumber: "", dateOfBirth: "", gender: "", bloodType: "", notes: "", emergencyContactName: "", emergencyContactPhone: "", selectedTrainerId: "", assignToMe: true });

    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data || "Kayıt sırasında bir hata oluştu.";
      setError(typeof msg === "string" ? msg : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    height: "52px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "0 16px",
    fontSize: "15px",
    outline: "none",
    color: "#0f172a",
    fontFamily: "inherit",
  };

  const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontWeight: 800,
    color: "#64748b",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    marginBottom: "8px",
  };

  return (
    <div style={{ maxWidth: "900px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "40px" }}>
        <Link href="/dashboard">
          <button style={{ width: "44px", height: "44px", background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b" }}>
            <ArrowLeft size={20} />
          </button>
        </Link>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px" }}>Danışan Kaydı</h1>
          <p style={{ fontSize: "15px", color: "#64748b", fontWeight: 500, marginTop: "4px" }}>Sisteme yeni bir üye ekleyin</p>
        </div>
      </div>

      {/* ── SUCCESS POPUP MODAL ── */}
      {successName && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(15,23,42,0.45)",
          backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, padding: "24px"
        }}>
          <div style={{
            background: "white", borderRadius: "28px",
            padding: "48px 40px", maxWidth: "440px", width: "100%",
            boxShadow: "0 32px 64px -12px rgba(0,0,0,0.25)",
            textAlign: "center", animation: "popIn 0.25s ease"
          }}>
            {/* Icon */}
            <div style={{
              width: "80px", height: "80px",
              background: "linear-gradient(135deg, #10b981, #059669)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px",
              boxShadow: "0 12px 24px rgba(16,185,129,0.35)"
            }}>
              <CheckCircle size={40} color="white" strokeWidth={2.5} />
            </div>

            {/* Title */}
            <h2 style={{ fontSize: "24px", fontWeight: 900, color: "#0f172a", marginBottom: "8px" }}>
              Kayıt Başarılı! 🎉
            </h2>

            {/* Message */}
            <p style={{ fontSize: "16px", color: "#475569", fontWeight: 500, lineHeight: 1.6, marginBottom: "8px" }}>
              <strong style={{ color: "#0f172a" }}>{successName}</strong> sisteme başarıyla kaydedildi.
            </p>
            <p style={{ fontSize: "14px", color: "#64748b", fontWeight: 500, lineHeight: 1.5, marginBottom: "32px" }}>
              Danışan artık kendi telefon numarasıyla OTP ile giriş yapabilir.
            </p>

            {/* Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button
                onClick={() => setSuccessName(null)}
                className="btn-action-primary"
                style={{ width: "100%", justifyContent: "center", height: "52px", fontSize: "15px" }}
              >
                <UserPlus size={18} />
                Yeni Danışan Ekle
              </button>
              <button
                onClick={() => { setSuccessName(null); window.location.href = "/dashboard/students"; }}
                style={{
                  width: "100%", height: "52px", background: "#f8fafc",
                  border: "1px solid #e2e8f0", borderRadius: "12px",
                  fontSize: "15px", fontWeight: 700, color: "#64748b",
                  cursor: "pointer"
                }}
              >
                Danışan Listesine Git
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: "14px", padding: "16px 20px", marginBottom: "24px" }}>
          <p style={{ fontSize: "14px", color: "#dc2626", fontWeight: 700 }}>{error}</p>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "20px", padding: "40px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        
        {/* Info Box */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", background: isAdmin ? "#eff6ff" : "#f0fdf4", border: isAdmin ? "1px solid #dbeafe" : "1px solid #bbf7d0", borderRadius: "14px", padding: "16px 20px", marginBottom: "36px" }}>
          {isAdmin ? <ShieldCheck size={22} color="#4f46e5" /> : <UserPlus size={22} color="#10b981" />}
          <p style={{ fontSize: "14px", color: "#475569", fontWeight: 600, lineHeight: 1.5 }}>
            {isAdmin 
              ? "Kayıt sonrası danışan kendi telefon numarasıyla OTP ile giriş yapabilecektir. İsterseniz hemen bir eğitmen atayabilirsiniz."
              : "Kaydettiğiniz danışan otomatik olarak size atanacaktır. Kayıt sonrası kendi telefon numarasıyla OTP ile giriş yapabilir."}
          </p>
        </div>

        {/* Temel Bilgiler */}
        <div style={{ marginBottom: "32px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid #f1f5f9" }}>Temel Bilgiler</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 32px" }}>
            <div>
              <label style={labelStyle}>Ad <span style={{ color: "#ef4444" }}>*</span></label>
              <input name="firstName" value={form.firstName} onChange={handleChange} type="text" placeholder="Örn: Caner" required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Soyad <span style={{ color: "#ef4444" }}>*</span></label>
              <input name="lastName" value={form.lastName} onChange={handleChange} type="text" placeholder="Örn: Yıldız" required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Telefon Numarası <span style={{ color: "#ef4444" }}>*</span></label>
              <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} type="tel" placeholder="5xx xxx xx xx" required style={inputStyle} />
            </div>
            {isAdmin && (
              <div>
                <label style={labelStyle}>Eğitmen Ataması (İsteğe Bağlı)</label>
                <select name="selectedTrainerId" value={form.selectedTrainerId} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="">Sonra Ata (Havuzda Beklesin)</option>
                  {trainers.map(t => <option key={t.id} value={t.id}>{t.fullName}</option>)}
                </select>
              </div>
            )}
            {!isAdmin && (
              <div style={{ display: "flex", alignItems: "center", height: "100%", paddingTop: "14px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "14px", fontWeight: 700, color: "#475569" }}>
                  <input 
                    type="checkbox" 
                    checked={form.assignToMe} 
                    onChange={(e) => setForm(prev => ({ ...prev, assignToMe: e.target.checked }))}
                    style={{ width: "20px", height: "20px", cursor: "pointer", accentColor: "#10b981" }}
                  />
                  Bu danışanı direkt bana ata
                </label>
              </div>
            )}
            <div>
              <label style={labelStyle}>Cinsiyet</label>
              <select name="gender" value={form.gender} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="">Seçiniz</option>
                <option value="0">Erkek</option>
                <option value="1">Kadın</option>
                <option value="2">Diğer</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Doğum Tarihi</label>
              <input name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} type="date" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Kan Grubu</label>
              <select name="bloodType" value={form.bloodType} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="">Seçiniz</option>
                <option value="0">A RH +</option>
                <option value="1">A RH -</option>
                <option value="2">B RH +</option>
                <option value="3">B RH -</option>
                <option value="4">AB RH +</option>
                <option value="5">AB RH -</option>
                <option value="6">0 RH +</option>
                <option value="7">0 RH -</option>
              </select>
            </div>
          </div>
        </div>

        {/* Acil Durum */}
        <div style={{ marginBottom: "32px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid #f1f5f9" }}>Acil Durum İletişim</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 32px" }}>
            <div>
              <label style={labelStyle}>Acil Durum Kişisi</label>
              <input name="emergencyContactName" value={form.emergencyContactName} onChange={handleChange} type="text" placeholder="Ad Soyad" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Acil Durum Telefonu</label>
              <input name="emergencyContactPhone" value={form.emergencyContactPhone} onChange={handleChange} type="tel" placeholder="5xx xxx xx xx" style={inputStyle} />
            </div>
          </div>
        </div>

        {/* Notlar */}
        <div style={{ marginBottom: "40px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid #f1f5f9" }}>Ek Notlar</h3>
          <div>
            <label style={labelStyle}>Notlar</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Sağlık geçmişi, özel durumlar, hedefler..." style={{ width: "100%", height: "120px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "14px 16px", fontSize: "15px", outline: "none", color: "#0f172a", resize: "none", fontFamily: "inherit" }} />
          </div>
        </div>

        {/* Submit */}
        <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "32px", display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" disabled={loading} className="btn-action-primary" style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? <Loader2 size={18} /> : <Save size={18} />}
            {loading ? "Kaydediliyor..." : "Danışanı Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}
