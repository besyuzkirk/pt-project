"use client";

import { useState, useRef, use } from "react";
import { ArrowLeft, UploadCloud, Save, CheckCircle, Ruler, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

const API_BASE = "http://localhost:5064/api";

export default function NewMeasurementPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const studentId = resolvedParams.id;

  const [form, setForm] = useState({
    heightCm: "",
    weightKg: "",
    bodyFatPercentage: "",
    shoulderCm: "",
    chestCm: "",
    waistCm: "",
    hipCm: "",
    armLeftCm: "",
    armRightCm: "",
    legLeftCm: "",
    legRightCm: "",
    notes: ""
  });

  const [photos, setPhotos] = useState<{
    front: File | null;
    side: File | null;
    back: File | null;
  }>({
    front: null,
    side: null,
    back: null,
  });

  const [photoPreviews, setPhotoPreviews] = useState<{
    front: string | null;
    side: string | null;
    back: string | null;
  }>({
    front: null,
    side: null,
    back: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, position: "front" | "side" | "back") => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotos(prev => ({ ...prev, [position]: file }));
      setPhotoPreviews(prev => ({ ...prev, [position]: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      
      const formData = new FormData();
      formData.append("StudentId", studentId);
      
      // Append fields only if they have a value
      Object.entries(form).forEach(([key, value]) => {
        if (value.trim() !== "") {
          // Capitalize first letter to match command properties exactly
          const csharpKey = key.charAt(0).toUpperCase() + key.slice(1);
          formData.append(csharpKey, value);
        }
      });

      if (photos.front) formData.append("frontPhoto", photos.front);
      if (photos.side) formData.append("sidePhoto", photos.side);
      if (photos.back) formData.append("backPhoto", photos.back);

      await axios.post(`${API_BASE}/measurements`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        }
      });

      setSuccess(true);
      setShowSuccessModal(true);
      setTimeout(() => {
        router.push(`/dashboard/students/${studentId}`);
      }, 2500);
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data || "Ölçüm kaydedilirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", height: "48px", background: "#f8fafc", border: "1px solid #e2e8f0",
    borderRadius: "12px", padding: "0 16px", fontSize: "15px", color: "#0f172a",
    outline: "none", transition: "all 0.2s"
  };
  const labelStyle = { display: "block", fontSize: "13px", fontWeight: 700, color: "#475569", marginBottom: "8px" };

  const PhotoUploadBox = ({ title, position }: { title: string, position: "front" | "side" | "back" }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    return (
      <div 
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: "2px dashed #cbd5e1", borderRadius: "16px", height: "240px",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          background: "#f8fafc", cursor: "pointer", position: "relative", overflow: "hidden",
          transition: "all 0.2s"
        }}
        onMouseOver={(e) => { e.currentTarget.style.borderColor = "#4f46e5"; e.currentTarget.style.background = "#eff6ff"; }}
        onMouseOut={(e) => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.background = "#f8fafc"; }}
      >
        <input type="file" ref={fileInputRef} onChange={(e) => handleFileChange(e, position)} style={{ display: "none" }} accept="image/*" />
        {photoPreviews[position] ? (
          <img src={photoPreviews[position]!} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <UploadCloud size={24} color="#64748b" />
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#475569" }}>{title}</div>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>Tıkla ve fotoğraf seç</div>
          </>
        )}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: "1000px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "40px" }}>
        <Link href={`/dashboard/students/${studentId}`}>
          <button style={{ width: "44px", height: "44px", background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b" }}>
            <ArrowLeft size={20} />
          </button>
        </Link>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px" }}>Yeni Ölçüm Ekle</h1>
          <p style={{ fontSize: "15px", color: "#64748b", fontWeight: 500, marginTop: "4px" }}>Vücut ölçülerini ve gelişim fotoğraflarını kaydet</p>
        </div>
      </div>

      {success && (
        <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "14px", padding: "16px 20px", marginBottom: "24px" }}>
          <CheckCircle size={22} color="#10b981" />
          <p style={{ fontSize: "14px", color: "#064e3b", fontWeight: 700 }}>Ölçüm ve fotoğraflar başarıyla kaydedildi!</p>
        </div>
      )}

      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: "14px", padding: "16px 20px", marginBottom: "24px" }}>
          <p style={{ fontSize: "14px", color: "#dc2626", fontWeight: 700 }}>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "20px", padding: "40px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        
        {/* Temel Ölçümler */}
        <div style={{ marginBottom: "40px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "24px", paddingBottom: "12px", borderBottom: "1px solid #f1f5f9" }}>
            Vücut Kompozisyonu
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px 32px" }}>
            <div>
              <label style={labelStyle}>Boy (cm)</label>
              <input name="heightCm" value={form.heightCm} onChange={handleInputChange} type="number" step="0.1" placeholder="Örn: 180" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Kilo (kg)</label>
              <input name="weightKg" value={form.weightKg} onChange={handleInputChange} type="number" step="0.1" placeholder="Örn: 75.5" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Yağ Oranı (%)</label>
              <input name="bodyFatPercentage" value={form.bodyFatPercentage} onChange={handleInputChange} type="number" step="0.1" placeholder="Örn: 15.2" style={inputStyle} />
            </div>
          </div>
        </div>

        {/* Çevre Ölçümleri */}
        <div style={{ marginBottom: "40px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "24px", paddingBottom: "12px", borderBottom: "1px solid #f1f5f9" }}>
            Çevre Ölçümleri (cm)
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px 24px" }}>
            <div>
              <label style={labelStyle}>Omuz</label>
              <input name="shoulderCm" value={form.shoulderCm} onChange={handleInputChange} type="number" step="0.1" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Göğüs</label>
              <input name="chestCm" value={form.chestCm} onChange={handleInputChange} type="number" step="0.1" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Bel</label>
              <input name="waistCm" value={form.waistCm} onChange={handleInputChange} type="number" step="0.1" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Kalça</label>
              <input name="hipCm" value={form.hipCm} onChange={handleInputChange} type="number" step="0.1" style={inputStyle} />
            </div>
          </div>
        </div>

        {/* Kol ve Bacak */}
        <div style={{ marginBottom: "40px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "24px", paddingBottom: "12px", borderBottom: "1px solid #f1f5f9" }}>
            Kol & Bacak (cm)
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "20px 24px" }}>
            <div>
              <label style={labelStyle}>Sol Kol</label>
              <input name="armLeftCm" value={form.armLeftCm} onChange={handleInputChange} type="number" step="0.1" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Sağ Kol</label>
              <input name="armRightCm" value={form.armRightCm} onChange={handleInputChange} type="number" step="0.1" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Sol Bacak</label>
              <input name="legLeftCm" value={form.legLeftCm} onChange={handleInputChange} type="number" step="0.1" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Sağ Bacak</label>
              <input name="legRightCm" value={form.legRightCm} onChange={handleInputChange} type="number" step="0.1" style={inputStyle} />
            </div>
          </div>
        </div>

        {/* Fotoğraflar */}
        <div style={{ marginBottom: "40px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "24px", paddingBottom: "12px", borderBottom: "1px solid #f1f5f9" }}>
            Gelişim Fotoğrafları
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>
            <PhotoUploadBox title="Ön Cephe" position="front" />
            <PhotoUploadBox title="Yan Cephe" position="side" />
            <PhotoUploadBox title="Arka Cephe" position="back" />
          </div>
        </div>

        {/* Notlar */}
        <div style={{ marginBottom: "40px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "24px", paddingBottom: "12px", borderBottom: "1px solid #f1f5f9" }}>
            Ek Notlar
          </h3>
          <textarea 
            name="notes" value={form.notes} onChange={handleInputChange} 
            placeholder="Ölçümle ilgili değerlendirmeleriniz..."
            style={{ ...inputStyle, height: "120px", paddingTop: "16px", resize: "vertical" }} 
          />
        </div>

        <button type="submit" disabled={loading} className="btn-action-primary" style={{ width: "100%", height: "56px", fontSize: "16px", justifyContent: "center" }}>
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          {loading ? "Kaydediliyor..." : "Ölçümleri Kaydet"}
        </button>

      </form>

      {showSuccessModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
        }}>
          <div style={{
            background: "white", padding: "40px", borderRadius: "24px", maxWidth: "440px", width: "90%",
            textAlign: "center", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)"
          }}>
            <div style={{
              width: "72px", height: "72px", background: "#ecfdf5", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px"
            }}>
              <CheckCircle size={40} color="#10b981" />
            </div>
            <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a", marginBottom: "12px" }}>Ölçüm Kaydedildi!</h3>
            <p style={{ fontSize: "15px", color: "#64748b", lineHeight: "1.6", marginBottom: "28px" }}>
              Danışanın vücut ölçüleri ve fotoğrafları başarıyla sisteme işlendi. Profil sayfasına yönlendiriliyorsunuz...
            </p>
            <button 
              onClick={() => router.push(`/dashboard/students/${studentId}`)}
              className="btn-action-primary" 
              style={{ width: "100%", height: "48px", justifyContent: "center" }}
            >
              Hemen Git
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
