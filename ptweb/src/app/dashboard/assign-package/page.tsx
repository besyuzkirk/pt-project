"use client";

import { useEffect, useState, Suspense } from "react";
import { Plus, Users, Package, Calendar, Loader2, CheckCircle, Clock, Trash2, ArrowLeft, CreditCard } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useRole } from "../../lib/useRole";

const API_BASE = "http://localhost:5064/api";

interface UserItem {
  id: string;
  fullName: string;
}

interface PackageItem {
  id: string;
  name: string;
  totalSessions: number;
  price: number;
  currency: string;
}

function AssignPackageForm() {
  const searchParams = useSearchParams();
  const preselectedStudentId = searchParams.get("studentId") || "";

  const [students, setStudents] = useState<UserItem[]>([]);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const { isAdmin, isLoading: roleLoading } = useRole();
  
  const [form, setForm] = useState({
    studentId: preselectedStudentId,
    packageId: "",
    startDate: new Date().toISOString().split("T")[0],
    discountAmount: "0",
    paymentMethod: "Cash",
    paymentStatus: "Paid"
  });

  useEffect(() => {
    if (preselectedStudentId) {
      setForm(prev => ({ ...prev, studentId: preselectedStudentId }));
    }
  }, [preselectedStudentId]);

  const [schedule, setSchedule] = useState<{ dayOfWeek: number, time: string }[]>([]);
  const [dayInput, setDayInput] = useState("1"); // 1 = Monday
  const [timeInput, setTimeInput] = useState("10:00");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (roleLoading) return;
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const hdrs = { headers: { Authorization: `Bearer ${token}` } };
        
        // Trainer → only own students; Admin → all students
        const studentEndpoint = isAdmin
          ? `${API_BASE}/users/students`
          : `${API_BASE}/users/my-students`;

        const [uRes, pRes] = await Promise.all([
          axios.get(studentEndpoint, hdrs),
          axios.get(`${API_BASE}/packages`, hdrs)
        ]);

        setStudents(uRes.data);
        setPackages(pRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [isAdmin, roleLoading]);


  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addScheduleItem = () => {
    setSchedule(prev => [...prev, { dayOfWeek: parseInt(dayInput), time: timeInput }]);
  };

  const removeScheduleItem = (index: number) => {
    setSchedule(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentId || !form.packageId || !form.startDate) {
      setError("Lütfen gerekli alanları doldurun.");
      return;
    }
    if (schedule.length === 0) {
      setError("Lütfen en az bir haftalık program ekleyin.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE}/memberships/assign`, {
        studentId: form.studentId,
        packageId: form.packageId,
        startDate: form.startDate,
        discountAmount: parseFloat(form.discountAmount) || 0,
        paymentMethod: form.paymentMethod,
        paymentStatus: form.paymentStatus,
        weeklySchedule: schedule.map(s => ({
            dayOfWeek: s.dayOfWeek,
            time: s.time + ":00" // TimeSpan format "hh:mm:ss"
        }))
      }, { headers: { Authorization: `Bearer ${token}` } });

      setSuccess("Paket başarıyla atandı ve seanslar planlandı!");
      setForm({
        studentId: preselectedStudentId,
        packageId: "",
        startDate: new Date().toISOString().split("T")[0],
        discountAmount: "0",
        paymentMethod: "Cash",
        paymentStatus: "Paid"
      });
      setSchedule([]);
    } catch (err: any) {
      setError(err.response?.data || "Paket atanırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", height: "48px", background: "#f8fafc", border: "1px solid #e2e8f0",
    borderRadius: "10px", padding: "0 14px", fontSize: "14px", outline: "none",
    color: "#0f172a", fontFamily: "inherit", cursor: "pointer"
  };

  const labelStyle = {
    display: "block", fontSize: "11px", fontWeight: 800, color: "#64748b",
    textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: "6px",
  };

  const dayNames = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "40px" }}>
        <Link href={preselectedStudentId ? `/dashboard/students/${preselectedStudentId}` : "/dashboard/students"} style={{ textDecoration: "none" }}>
          <button type="button" style={{ display: "flex", alignItems: "center", gap: "8px", background: "white", border: "1px solid #cbd5e1", padding: "12px 20px", borderRadius: "12px", color: "#475569", fontWeight: 700, fontSize: "14px", cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }} onMouseOver={(e) => e.currentTarget.style.background = "#f8fafc"} onMouseOut={(e) => e.currentTarget.style.background = "white"}>
            <ArrowLeft size={16} />
            Geri Dön
          </button>
        </Link>
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: 900, color: "#0f172a", letterSpacing: "-1px", marginBottom: "4px" }}>Paket Atama & Planlama</h1>
          <p style={{ fontSize: "16px", color: "#64748b", fontWeight: 500 }}>
            Danışana paket tanımlayın ve seans takvimini otomatik oluşturun.
          </p>
        </div>
      </div>

      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: "14px", padding: "16px 20px", marginBottom: "24px" }}>
          <p style={{ color: "#dc2626", fontWeight: 700, fontSize: "14px" }}>{error}</p>
        </div>
      )}

      {success && (
        <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "14px", padding: "16px 20px", marginBottom: "24px" }}>
          <CheckCircle size={20} color="#10b981" />
          <span style={{ fontSize: "14px", color: "#064e3b", fontWeight: 700 }}>{success}</span>
        </div>
      )}

      <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "20px", padding: "32px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", maxWidth: "800px" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <label style={labelStyle}><Users size={12} style={{ display: "inline", marginRight: 4 }}/> Danışan</label>
              <select name="studentId" value={form.studentId} onChange={handleChange} style={{ ...inputStyle, opacity: preselectedStudentId ? 0.75 : 1, pointerEvents: preselectedStudentId ? "none" : "auto", background: preselectedStudentId ? "#e2e8f0" : "#f8fafc" }} required>
                <option value="">Danışan Seçin</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}><Package size={12} style={{ display: "inline", marginRight: 4 }}/> Paket</label>
              <select name="packageId" value={form.packageId} onChange={handleChange} style={inputStyle} required>
                <option value="">Paket Seçin</option>
                {packages.map(p => <option key={p.id} value={p.id}>{p.name} ({p.totalSessions ?? "Sınırsız"} Seans) - {p.price} {p.currency}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <label style={labelStyle}><Calendar size={12} style={{ display: "inline", marginRight: 4 }}/> Başlangıç Tarihi</label>
              <input type="date" name="startDate" value={form.startDate} onChange={handleChange} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}><CreditCard size={12} style={{ display: "inline", marginRight: 4 }}/> İndirim Tutarı ({packages.find(p => p.id === form.packageId)?.currency || "TRY"})</label>
              <input type="number" name="discountAmount" value={form.discountAmount} onChange={handleChange} min="0" max={packages.find(p => p.id === form.packageId)?.price || 999999} style={inputStyle} placeholder="İndirim Tutarını girin" />
            </div>
          </div>

          {form.packageId && (
            <div style={{ background: "#f0f9ff", padding: "20px", borderRadius: "14px", border: "1px solid #bae6fd", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "12px", fontWeight: 800, color: "#0369a1", textTransform: "uppercase" }}>Ücret Özeti</span>
                <div style={{ display: "flex", gap: "16px", marginTop: "4px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#0284c7" }}>Orijinal Tutar: {packages.find(p => p.id === form.packageId)?.price} {packages.find(p => p.id === form.packageId)?.currency}</span>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#ef4444" }}>İndirim: -{form.discountAmount || 0} {packages.find(p => p.id === form.packageId)?.currency}</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#0369a1", textTransform: "uppercase" }}>Net Ödenecek</span>
                <div style={{ fontSize: "24px", fontWeight: 900, color: "#0369a1" }}>
                  {Math.max(0, (packages.find(p => p.id === form.packageId)?.price || 0) - (parseFloat(form.discountAmount) || 0))} {packages.find(p => p.id === form.packageId)?.currency}
                </div>
              </div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <label style={labelStyle}>Ödeme Yöntemi</label>
              <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} style={inputStyle} required>
                <option value="Cash">Nakit</option>
                <option value="Card">Kredi Kartı</option>
                <option value="Transfer">Havale / EFT</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Ödeme Durumu</label>
              <select name="paymentStatus" value={form.paymentStatus} onChange={handleChange} style={inputStyle} required>
                <option value="Paid">Ödendi</option>
                <option value="Pending">Ödenecek (Beklemede)</option>
              </select>
            </div>
          </div>

          <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#0f172a", marginBottom: "16px" }}>Haftalık Program (Örn: Pzt 10:00)</h3>
            
            <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
              <select value={dayInput} onChange={(e) => setDayInput(e.target.value)} style={{ ...inputStyle, flex: 1 }}>
                <option value="1">Pazartesi</option>
                <option value="2">Salı</option>
                <option value="3">Çarşamba</option>
                <option value="4">Perşembe</option>
                <option value="5">Cuma</option>
                <option value="6">Cumartesi</option>
                <option value="0">Pazar</option>
              </select>
              <input type="time" value={timeInput} onChange={(e) => setTimeInput(e.target.value)} style={{ ...inputStyle, width: "120px" }} />
              <button type="button" onClick={addScheduleItem} style={{ background: "#4f46e5", color: "white", border: "none", borderRadius: "10px", padding: "0 20px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                <Plus size={16} /> Ekle
              </button>
            </div>

            {schedule.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {schedule.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "white", padding: "12px 16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <Clock size={16} color="#64748b" />
                      <span style={{ fontWeight: 700, color: "#0f172a" }}>{dayNames[item.dayOfWeek]}</span>
                      <span style={{ color: "#64748b", fontWeight: 600 }}>{item.time}</span>
                    </div>
                    <button type="button" onClick={() => removeScheduleItem(idx)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "4px" }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#94a3b8", fontSize: "13px", fontWeight: 500 }}>Henüz program eklenmedi.</p>
            )}
          </div>

          <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "24px", display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" disabled={loading} className="btn-action-primary" style={{ opacity: loading ? 0.7 : 1, width: "100%", justifyContent: "center", height: "54px", fontSize: "16px" }}>
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Calendar size={20} />}
              {loading ? "Planlanıyor..." : "Paketi Ata ve Planla"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AssignPackagePage() {
  return (
    <Suspense fallback={
      <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
        <Loader2 className="animate-spin" size={32} />
        <span style={{ marginLeft: "12px", fontWeight: 600 }}>Yükleniyor...</span>
      </div>
    }>
      <AssignPackageForm />
    </Suspense>
  );
}
