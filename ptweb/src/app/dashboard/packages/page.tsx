"use client";

import { useEffect, useState } from "react";
import { Plus, Package, Clock, Users, Wifi, MapPin, CheckCircle, XCircle, Loader2, X } from "lucide-react";
import axios from "axios";

const API_BASE = "http://localhost:5064/api";

interface PackageItem {
  id: string;
  name: string;
  description?: string;
  packageType: string;
  sessionType: string;
  totalSessions?: number;
  sessionDurationMinutes: number;
  maxParticipants?: number;
  validityDays: number;
  price: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
}

const emptyForm = {
  name: "",
  description: "",
  packageType: "0",       // 0=Individual, 1=Group
  sessionType: "0",       // 0=InPerson, 1=Remote
  totalSessions: "",
  sessionDurationMinutes: "60",
  maxParticipants: "",
  validityDays: "30",
  price: "",
  currency: "TRY",
};

export default function PackagesPage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchPackages = async () => {
    try {
      const res = await axios.get(`${API_BASE}/packages`);
      setPackages(res.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPackages(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE}/packages`, {
        name: form.name,
        description: form.description || null,
        packageType: parseInt(form.packageType),
        sessionType: parseInt(form.sessionType),
        totalSessions: form.totalSessions ? parseInt(form.totalSessions) : null,
        sessionDurationMinutes: parseInt(form.sessionDurationMinutes),
        maxParticipants: form.packageType === "1" && form.maxParticipants ? parseInt(form.maxParticipants) : null,
        validityDays: parseInt(form.validityDays),
        price: parseFloat(form.price),
        currency: form.currency,
      }, { headers: { Authorization: `Bearer ${token}` } });

      setSuccess("Paket başarıyla oluşturuldu!");
      setShowModal(false);
      setForm(emptyForm);
      fetchPackages();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data || "Bir hata oluştu.";
      setError(typeof msg === "string" ? msg : "Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%", height: "48px", background: "#f8fafc", border: "1px solid #e2e8f0",
    borderRadius: "10px", padding: "0 14px", fontSize: "14px", outline: "none",
    color: "#0f172a", fontFamily: "inherit",
  };
  const labelStyle = {
    display: "block", fontSize: "11px", fontWeight: 800, color: "#64748b",
    textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "6px",
  };

  const sessionTypeLabel = (t: string) => t === "Remote" ? "Uzaktan" : "Yüz Yüze";
  const packageTypeLabel = (t: string) => t === "Group" ? "Grup" : "Bireysel";

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "clamp(20px, 4vw, 40px)", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "clamp(22px, 5vw, 32px)", fontWeight: 900, color: "#0f172a", letterSpacing: "-1px", marginBottom: "8px" }}>Paket Yönetimi</h1>
          <p style={{ fontSize: "clamp(13px, 2.5vw, 16px)", color: "#64748b", fontWeight: 500 }}>
            Eğitim paketleri oluşturun ve yönetin
          </p>
        </div>
        <button className="btn-action-primary" onClick={() => { setShowModal(true); setError(""); }}>
          <Plus size={18} />
          Yeni Paket Oluştur
        </button>
      </div>

      {/* Success Toast */}
      {success && (
        <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "14px", padding: "16px 20px", marginBottom: "24px" }}>
          <CheckCircle size={20} color="#10b981" />
          <span style={{ fontSize: "14px", color: "#064e3b", fontWeight: 700 }}>{success}</span>
        </div>
      )}

      {/* Packages Grid */}
      {loading ? (
        <div style={{ padding: "80px", textAlign: "center", color: "#94a3b8", fontWeight: 600 }}>Yükleniyor...</div>
      ) : packages.length === 0 ? (
        <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "20px", padding: "80px", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📦</div>
          <div style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>Henüz paket yok</div>
          <div style={{ fontSize: "14px", color: "#94a3b8", fontWeight: 500, marginBottom: "24px" }}>İlk eğitim paketinizi oluşturun</div>
          <button className="btn-action-primary" onClick={() => setShowModal(true)} style={{ margin: "0 auto" }}>
            <Plus size={18} /> Paket Oluştur
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {packages.map((pkg) => (
            <div key={pkg.id} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "20px", padding: "28px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Card Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ width: "48px", height: "48px", background: "#eff6ff", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Package size={24} color="#4f46e5" />
                </div>
                <span style={{ padding: "4px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: 800, background: pkg.isActive ? "#f0fdf4" : "#f8fafc", color: pkg.isActive ? "#10b981" : "#94a3b8" }}>
                  {pkg.isActive ? "Aktif" : "Pasif"}
                </span>
              </div>

              {/* Name */}
              <div>
                <div style={{ fontSize: "18px", fontWeight: 900, color: "#0f172a", marginBottom: "4px" }}>{pkg.name}</div>
                {pkg.description && <div style={{ fontSize: "13px", color: "#64748b", fontWeight: 500, lineHeight: 1.5 }}>{pkg.description}</div>}
              </div>

              {/* Tags */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 10px", background: "#eff6ff", borderRadius: "8px", fontSize: "11px", fontWeight: 700, color: "#4f46e5" }}>
                  {pkg.sessionType === "Remote" ? <Wifi size={12} /> : <MapPin size={12} />}
                  {sessionTypeLabel(pkg.sessionType)}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 10px", background: "#f5f3ff", borderRadius: "8px", fontSize: "11px", fontWeight: 700, color: "#8b5cf6" }}>
                  <Users size={12} />
                  {packageTypeLabel(pkg.packageType)}
                </span>
              </div>

              {/* Details */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "12px" }}>
                  <div style={{ fontSize: "10px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", marginBottom: "4px" }}>Seans Sayısı</div>
                  <div style={{ fontSize: "20px", fontWeight: 900, color: "#0f172a" }}>{pkg.totalSessions ?? "∞"}</div>
                </div>
                <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "12px" }}>
                  <div style={{ fontSize: "10px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", marginBottom: "4px" }}>Seans Süresi</div>
                  <div style={{ fontSize: "20px", fontWeight: 900, color: "#0f172a" }}>{pkg.sessionDurationMinutes}<span style={{ fontSize: "12px", fontWeight: 600, color: "#64748b" }}>dk</span></div>
                </div>
                <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "12px" }}>
                  <div style={{ fontSize: "10px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", marginBottom: "4px" }}>Geçerlilik</div>
                  <div style={{ fontSize: "20px", fontWeight: 900, color: "#0f172a" }}>{pkg.validityDays}<span style={{ fontSize: "12px", fontWeight: 600, color: "#64748b" }}>gün</span></div>
                </div>
                {pkg.maxParticipants && (
                  <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "12px" }}>
                    <div style={{ fontSize: "10px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", marginBottom: "4px" }}>Maks. Kişi</div>
                    <div style={{ fontSize: "20px", fontWeight: 900, color: "#0f172a" }}>{pkg.maxParticipants}</div>
                  </div>
                )}
              </div>

              {/* Price */}
              <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: "28px", fontWeight: 900, color: "#4f46e5" }}>
                  {pkg.price.toLocaleString("tr-TR")}
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "#94a3b8", marginLeft: "4px" }}>{pkg.currency}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "24px" }}>
          <div style={{ background: "white", borderRadius: "24px", width: "100%", maxWidth: "640px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
            {/* Modal Header */}
            <div style={{ padding: "28px 32px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "22px", fontWeight: 900, color: "#0f172a" }}>Yeni Paket Oluştur</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: "32px" }}>
              {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: "10px", padding: "12px 16px", marginBottom: "24px" }}>
                  <p style={{ color: "#dc2626", fontWeight: 700, fontSize: "13px" }}>{error}</p>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Paket Adı */}
                <div>
                  <label style={labelStyle}>Paket Adı <span style={{ color: "#ef4444" }}>*</span></label>
                  <input name="name" value={form.name} onChange={handleChange} type="text" placeholder="Örn: Aylık Bireysel PT" required style={inputStyle} />
                </div>

                {/* Açıklama */}
                <div>
                  <label style={labelStyle}>Açıklama</label>
                  <textarea name="description" value={form.description} onChange={handleChange} placeholder="Paket hakkında kısa açıklama..." style={{ ...inputStyle, height: "80px", padding: "12px 14px", resize: "none" }} />
                </div>

                {/* Tür Seçimleri */}
                <div className="form-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}>Paket Tipi <span style={{ color: "#ef4444" }}>*</span></label>
                    <select name="packageType" value={form.packageType} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }}>
                      <option value="0">👤 Bireysel</option>
                      <option value="1">👥 Grup</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Seans Tipi <span style={{ color: "#ef4444" }}>*</span></label>
                    <select name="sessionType" value={form.sessionType} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }}>
                      <option value="0">📍 Yüz Yüze</option>
                      <option value="1">💻 Uzaktan</option>
                    </select>
                  </div>
                </div>

                {/* Grup ise max katılımcı */}
                {form.packageType === "1" && (
                  <div>
                    <label style={labelStyle}>Maksimum Katılımcı Sayısı <span style={{ color: "#ef4444" }}>*</span></label>
                    <input name="maxParticipants" value={form.maxParticipants} onChange={handleChange} type="number" min="2" placeholder="Örn: 8" required={form.packageType === "1"} style={inputStyle} />
                  </div>
                )}

                {/* Sayısal Alanlar */}
                <div className="form-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={labelStyle}>Toplam Seans Sayısı</label>
                    <input name="totalSessions" value={form.totalSessions} onChange={handleChange} type="number" min="1" placeholder="Boş = sınırsız" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Seans Süresi (dk) <span style={{ color: "#ef4444" }}>*</span></label>
                    <select name="sessionDurationMinutes" value={form.sessionDurationMinutes} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }}>
                      <option value="30">30 dakika</option>
                      <option value="45">45 dakika</option>
                      <option value="60">60 dakika</option>
                      <option value="90">90 dakika</option>
                      <option value="120">120 dakika</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Geçerlilik (gün) <span style={{ color: "#ef4444" }}>*</span></label>
                    <select name="validityDays" value={form.validityDays} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }}>
                      <option value="7">7 gün (1 hafta)</option>
                      <option value="14">14 gün (2 hafta)</option>
                      <option value="30">30 gün (1 ay)</option>
                      <option value="60">60 gün (2 ay)</option>
                      <option value="90">90 gün (3 ay)</option>
                      <option value="180">180 gün (6 ay)</option>
                      <option value="365">365 gün (1 yıl)</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Fiyat <span style={{ color: "#ef4444" }}>*</span></label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", fontWeight: 700, color: "#64748b" }}>₺</span>
                      <input name="price" value={form.price} onChange={handleChange} type="number" min="0" step="0.01" placeholder="0.00" required style={{ ...inputStyle, paddingLeft: "28px" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ borderTop: "1px solid #f1f5f9", marginTop: "32px", paddingTop: "24px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: "12px 24px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", fontWeight: 700, color: "#64748b", cursor: "pointer", fontSize: "14px" }}>
                  İptal
                </button>
                <button type="submit" disabled={saving} className="btn-action-primary" style={{ opacity: saving ? 0.7 : 1 }}>
                  {saving ? <Loader2 size={18} /> : <Plus size={18} />}
                  {saving ? "Oluşturuluyor..." : "Paketi Oluştur"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
