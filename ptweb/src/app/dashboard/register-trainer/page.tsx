"use client";

import { useState, useEffect } from "react";
import { Save, ArrowLeft, ShieldCheck, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useRole } from "../../lib/useRole";

const API_BASE = "http://localhost:5064/api";

export default function RegisterTrainerPage() {
  const { isAdmin, isLoading: roleLoading } = useRole();
  const router = useRouter();

  // Guard: only admins can access this page
  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [isAdmin, roleLoading, router]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    notes: "",
    dateOfBirth: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE}/auth/register-phone`,
        {
          phoneNumber: form.phoneNumber,
          firstName: form.firstName,
          lastName: form.lastName,
          role: 1, // Role.Trainer = 1
          notes: form.notes || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setForm({ firstName: "", lastName: "", phoneNumber: "", notes: "", dateOfBirth: "", emergencyContactName: "", emergencyContactPhone: "" });
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data || "Kayıt sırasında bir hata oluştu.";
      setError(typeof msg === "string" ? msg : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
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
          <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px" }}>Trainer Kaydı</h1>
          <p style={{ fontSize: "15px", color: "#64748b", fontWeight: 500, marginTop: "4px" }}>Sisteme yeni bir uzman eğitmen tanımlayın</p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "14px", padding: "16px 20px", marginBottom: "24px" }}>
          <CheckCircle size={22} color="#10b981" />
          <p style={{ fontSize: "14px", color: "#064e3b", fontWeight: 700 }}>Trainer başarıyla sisteme kaydedildi! OTP ile giriş yapabilir.</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: "14px", padding: "16px 20px", marginBottom: "24px" }}>
          <p style={{ fontSize: "14px", color: "#dc2626", fontWeight: 700 }}>{error}</p>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "20px", padding: "40px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        {/* Info Box */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", background: "#eff6ff", border: "1px solid #dbeafe", borderRadius: "14px", padding: "16px 20px", marginBottom: "36px" }}>
          <ShieldCheck size={22} color="#4f46e5" />
          <p style={{ fontSize: "14px", color: "#475569", fontWeight: 600, lineHeight: 1.5 }}>
            Bu işlem için <strong style={{ color: "#4f46e5" }}>yönetici yetkisi</strong> gereklidir. Kaydedilen trainer kendi telefon numarasıyla OTP ile giriş yapabilecektir.
          </p>
        </div>

        {/* Section: Temel Bilgiler */}
        <div style={{ marginBottom: "32px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "20px" }}>Temel Bilgiler</h3>
          <div className="form-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 32px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Ad <span style={{ color: "#ef4444" }}>*</span></label>
              <input name="firstName" value={form.firstName} onChange={handleChange} type="text" placeholder="Örn: Ahmet" required style={{ width: "100%", height: "52px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "0 16px", fontSize: "15px", outline: "none", color: "#0f172a", fontFamily: "inherit" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Soyad <span style={{ color: "#ef4444" }}>*</span></label>
              <input name="lastName" value={form.lastName} onChange={handleChange} type="text" placeholder="Örn: Yılmaz" required style={{ width: "100%", height: "52px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "0 16px", fontSize: "15px", outline: "none", color: "#0f172a", fontFamily: "inherit" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Telefon Numarası <span style={{ color: "#ef4444" }}>*</span></label>
              <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} type="tel" placeholder="5xx xxx xx xx" required style={{ width: "100%", height: "52px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "0 16px", fontSize: "15px", outline: "none", color: "#0f172a", fontFamily: "inherit" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Doğum Tarihi</label>
              <input name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} type="date" style={{ width: "100%", height: "52px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "0 16px", fontSize: "15px", outline: "none", color: "#0f172a", fontFamily: "inherit" }} />
            </div>
          </div>
        </div>

        {/* Section: Acil Durum */}
        <div style={{ marginBottom: "32px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "20px" }}>Acil Durum İletişim</h3>
          <div className="form-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 32px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Acil Durum Kişisi</label>
              <input name="emergencyContactName" value={form.emergencyContactName} onChange={handleChange} type="text" placeholder="Ad Soyad" style={{ width: "100%", height: "52px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "0 16px", fontSize: "15px", outline: "none", color: "#0f172a", fontFamily: "inherit" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Acil Durum Telefonu</label>
              <input name="emergencyContactPhone" value={form.emergencyContactPhone} onChange={handleChange} type="tel" placeholder="5xx xxx xx xx" style={{ width: "100%", height: "52px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "0 16px", fontSize: "15px", outline: "none", color: "#0f172a", fontFamily: "inherit" }} />
            </div>
          </div>
        </div>

        {/* Section: Notlar */}
        <div style={{ marginBottom: "40px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "20px" }}>Ek Bilgiler</h3>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Notlar / Uzmanlık Alanı</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Örn: Pilates, Fonksiyonel Antrenman, Powerlifting..." style={{ width: "100%", height: "120px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "14px 16px", fontSize: "15px", outline: "none", color: "#0f172a", resize: "none", fontFamily: "inherit" }} />
          </div>
        </div>

        {/* Submit */}
        <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "32px", display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" disabled={loading} className="btn-action-primary" style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {loading ? "Kaydediliyor..." : "Eğitmeni Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}
