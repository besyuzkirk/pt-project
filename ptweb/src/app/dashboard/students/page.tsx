"use client";

import { useEffect, useState } from "react";
import { Search, UserPlus, MoreVertical, Phone, Calendar, CheckCircle, XCircle, Ruler, Loader2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useRole } from "../../lib/useRole";

const API_BASE = "http://localhost:5064/api";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string;
  isActive: boolean;
  createdAt: string;
  activePackageName?: string;
  remainingSessions?: number;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filtered, setFiltered] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAdmin, isLoading: roleLoading } = useRole();
  const [adminTab, setAdminTab] = useState<"all" | "my">("all");
  const [sessionFilter, setSessionFilter] = useState<"all" | "active" | "low" | "none">("all");

  // Update Modal State
  const [selectedStudentForUpdate, setSelectedStudentForUpdate] = useState<Student | null>(null);
  const [updateForm, setUpdateForm] = useState({ heightCm: "", phoneNumber: "", assignedTrainerId: "", isActive: true });
  const [trainers, setTrainers] = useState<{id: string, fullName: string}[]>([]);
  const [updating, setUpdating] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Fetch trainers for the dropdown
  useEffect(() => {
    if (isAdmin && !roleLoading) {
      axios.get(`${API_BASE}/users/trainers`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }})
        .then(res => setTrainers(res.data))
        .catch(err => console.error(err));
    }
  }, [isAdmin, roleLoading]);

  const handleOpenUpdateModal = async (student: Student) => {
    setSelectedStudentForUpdate(student);
    setFetchingDetails(true);
    try {
      const res = await axios.get(`${API_BASE}/users/students/${student.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const profile = res.data;
      setUpdateForm({
        heightCm: profile.heightCm?.toString() || "",
        phoneNumber: profile.phoneNumber || "",
        assignedTrainerId: profile.assignedTrainerId || "",
        isActive: profile.isActive ?? true
      });
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingDetails(false);
    }
  };

  const submitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForUpdate) return;
    setUpdating(true);
    try {
      await axios.put(`${API_BASE}/users/students/${selectedStudentForUpdate.id}`, {
        studentId: selectedStudentForUpdate.id,
        heightCm: updateForm.heightCm ? parseFloat(updateForm.heightCm) : null,
        phoneNumber: updateForm.phoneNumber,
        assignedTrainerId: updateForm.assignedTrainerId || null,
        isActive: updateForm.isActive
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      
      // Update local list
      setStudents(prev => prev.map(s => s.id === selectedStudentForUpdate.id ? { ...s, phoneNumber: updateForm.phoneNumber, isActive: updateForm.isActive } : s));
      setSelectedStudentForUpdate(null);
    } catch (err) {
      alert("Güncelleme sırasında hata oluştu.");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (roleLoading) return; // wait until role is resolved
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        // Admin tab'a göre endpoint seçimi, Trainer ise hep my-students
        let endpoint = `${API_BASE}/users/my-students`;
        if (isAdmin && adminTab === "all") {
          endpoint = `${API_BASE}/users/students`;
        }
        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudents(res.data);
        setFiltered(res.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          setError("Oturum süreniz dolmuş veya geçersiz. Lütfen tekrar giriş yapın.");
        } else {
          setError("Danışanlar yüklenirken bir hata oluştu: " + (err.response?.data?.message || err.message));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [isAdmin, roleLoading, adminTab]);


  useEffect(() => {
    const q = search.toLowerCase();
    let res = students.filter(s =>
      s.fullName.toLowerCase().includes(q) ||
      (s.phoneNumber || "").includes(q)
    );

    if (sessionFilter === "active") {
      res = res.filter(s => s.activePackageName !== null && s.activePackageName !== undefined);
    } else if (sessionFilter === "low") {
      res = res.filter(s => s.activePackageName !== null && s.activePackageName !== undefined && s.remainingSessions !== undefined && s.remainingSessions <= 2);
    } else if (sessionFilter === "none") {
      res = res.filter(s => !s.activePackageName);
    }

    setFiltered(res);
  }, [search, sessionFilter, students]);

  const getInitials = (firstName: string, lastName: string) =>
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: 900, color: "#0f172a", letterSpacing: "-1px", marginBottom: "8px" }}>
            {isAdmin ? "Danışan Yönetimi" : "Danışanlarım"}
          </h1>
          <p style={{ fontSize: "16px", color: "#64748b", fontWeight: 500 }}>
            <strong style={{ color: "#0f172a" }}>{students.length}</strong> danışan listeleniyor
          </p>
        </div>
        {/* Only admins can register new students */}
        {isAdmin && (
          <Link href="/dashboard/register-student">
            <button className="btn-action-primary">
              <UserPlus size={18} />
              Yeni Danışan Ekle
            </button>
          </Link>
        )}
      </div>


      {/* Admin Tabs */}
      {isAdmin && (
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", borderBottom: "1px solid #e2e8f0", paddingBottom: "16px" }}>
          <button 
            onClick={() => setAdminTab("all")}
            style={{ padding: "8px 16px", borderRadius: "10px", fontWeight: 800, fontSize: "14px", cursor: "pointer", border: "none", transition: "all 0.2s", background: adminTab === "all" ? "#eff6ff" : "transparent", color: adminTab === "all" ? "#4f46e5" : "#64748b" }}>
            Tüm Danışanlar
          </button>
          <button 
            onClick={() => setAdminTab("my")}
            style={{ padding: "8px 16px", borderRadius: "10px", fontWeight: 800, fontSize: "14px", cursor: "pointer", border: "none", transition: "all 0.2s", background: adminTab === "my" ? "#f0fdf4" : "transparent", color: adminTab === "my" ? "#10b981" : "#64748b" }}>
            Bana Atananlar
          </button>
        </div>
      )}

      {/* Search */}
      <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "16px 20px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
        <div className="header-search-bar" style={{ width: "320px" }}>
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="İsim veya telefon ile ara..."
            className="header-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <select 
            value={sessionFilter} 
            onChange={(e: any) => setSessionFilter(e.target.value)} 
            style={{ 
              background: "#f8fafc", 
              border: "1px solid #e2e8f0", 
              padding: "8px 12px", 
              borderRadius: "10px", 
              fontWeight: 700, 
              fontSize: "13px", 
              color: "#475569", 
              outline: "none", 
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            <option value="all">Tüm Seans Durumları 📊</option>
            <option value="active">Aktif Paketi Olanlar 🟢</option>
            <option value="low">Seansı Azalanlar (≤2) ⚠️</option>
            <option value="none">Paketi Olmayanlar ⚪</option>
          </select>
        </div>

        <div style={{ marginLeft: "auto", fontSize: "13px", color: "#94a3b8", fontWeight: 600 }}>
          {filtered.length} sonuç
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: "14px", padding: "16px 20px", marginBottom: "24px" }}>
          <p style={{ color: "#dc2626", fontWeight: 700, fontSize: "14px" }}>{error}</p>
        </div>
      )}

      {/* Table */}
      <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "20px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        {loading ? (
          <div style={{ padding: "80px", textAlign: "center", color: "#94a3b8", fontWeight: 600 }}>
            Yükleniyor...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "80px", textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>👤</div>
            <div style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>Danışan bulunamadı</div>
            <div style={{ fontSize: "14px", color: "#94a3b8", fontWeight: 500 }}>
              {search ? "Arama kriterini değiştir" : "Henüz danışan kaydı yok"}
            </div>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "16px 24px", textAlign: "left", fontSize: "11px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>Danışan</th>
                <th style={{ padding: "16px 24px", textAlign: "left", fontSize: "11px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>Telefon</th>
                <th style={{ padding: "16px 24px", textAlign: "left", fontSize: "11px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>Aktif Paket / Seans</th>
                <th style={{ padding: "16px 24px", textAlign: "left", fontSize: "11px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>Kayıt Tarihi</th>
                <th style={{ padding: "16px 24px", textAlign: "left", fontSize: "11px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>Durum</th>
                <th style={{ padding: "16px 24px", textAlign: "right", fontSize: "11px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student, idx) => (
                <tr key={student.id} style={{ borderBottom: idx < filtered.length - 1 ? "1px solid #f8fafc" : "none" }}>
                  <td style={{ padding: "20px 24px" }}>
                      <Link href={`/dashboard/students/${student.id}`} style={{ display: "flex", alignItems: "center", gap: "14px", textDecoration: "none" }}>
                        <div style={{ width: "44px", height: "44px", background: "#eff6ff", color: "#4f46e5", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "14px" }}>
                          {getInitials(student.firstName, student.lastName)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: "#0f172a", fontSize: "15px" }}>{student.fullName}</div>
                          <div style={{ fontSize: "11px", fontWeight: 700, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "2px" }}>Danışan</div>
                        </div>
                      </Link>
                  </td>
                  <td style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Phone size={14} color="#94a3b8" />
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "#475569" }}>{student.phoneNumber || "—"}</span>
                    </div>
                  </td>
                  <td style={{ padding: "20px 24px" }}>
                    {student.activePackageName ? (
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>
                          {student.activePackageName}
                        </div>
                        <div style={{ fontSize: "11px", fontWeight: 800, color: student.remainingSessions !== undefined && student.remainingSessions <= 2 ? "#ef4444" : "#8b5cf6", marginTop: "2px" }}>
                          {student.remainingSessions !== undefined ? `${student.remainingSessions} Seans Kaldı` : "—"}
                        </div>
                      </div>
                    ) : (
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#94a3b8" }}>Paket Atanmamış</span>
                    )}
                  </td>
                  <td style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Calendar size={14} color="#94a3b8" />
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "#475569" }}>{formatDate(student.createdAt)}</span>
                    </div>
                  </td>
                  <td style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      {student.isActive ? (
                        <>
                          <CheckCircle size={16} color="#10b981" />
                          <span style={{ fontSize: "12px", fontWeight: 800, color: "#10b981", background: "#f0fdf4", padding: "4px 10px", borderRadius: "8px" }}>Aktif</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={16} color="#94a3b8" />
                          <span style={{ fontSize: "12px", fontWeight: 800, color: "#94a3b8", background: "#f8fafc", padding: "4px 10px", borderRadius: "8px" }}>Pasif</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "20px 24px", textAlign: "right" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
                      
                      <Link href={`/dashboard/students/${student.id}/measurements/new`} title="Ölçüm Ekle">
                        <button style={{ 
                          width: "36px", height: "36px", borderRadius: "10px", border: "1px solid #e2e8f0", 
                          background: "white", display: "flex", alignItems: "center", justifyContent: "center", 
                          cursor: "pointer", color: "#64748b", transition: "all 0.2s" 
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.borderColor = "#4f46e5"; e.currentTarget.style.color = "#4f46e5"; }}
                        onMouseOut={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#64748b"; }}
                        >
                          <Ruler size={16} />
                        </button>
                      </Link>

                      {activeDropdown === student.id && (
                        <div 
                          onClick={() => setActiveDropdown(null)} 
                          style={{ position: "fixed", inset: 0, zIndex: 90 }} 
                        />
                      )}

                      <div style={{ position: "relative" }}>
                        <button 
                          onClick={() => setActiveDropdown(activeDropdown === student.id ? null : student.id)}
                          style={{ 
                            width: "36px", height: "36px", borderRadius: "10px", border: "1px solid #e2e8f0",
                            background: "white", display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer", color: "#64748b", transition: "all 0.2s"
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.borderColor = "#4f46e5"; e.currentTarget.style.color = "#4f46e5"; }}
                          onMouseOut={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#64748b"; }}
                          title="İşlemler"
                        >
                          <MoreVertical size={18} />
                        </button>
                        
                        {activeDropdown === student.id && (
                          <div style={{ 
                            position: "absolute", right: 0, top: "100%", marginTop: "6px",
                            width: "180px", background: "white", border: "1px solid #e2e8f0",
                            borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
                            zIndex: 100, overflow: "hidden", textAlign: "left"
                          }}>
                            <button 
                              onClick={() => { setActiveDropdown(null); handleOpenUpdateModal(student); }}
                              style={{ width: "100%", padding: "10px 16px", background: "none", border: "none", fontSize: "13px", fontWeight: 700, color: "#334155", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                              onMouseOver={(e) => { e.currentTarget.style.background = "#f1f5f9"; }}
                              onMouseOut={(e) => { e.currentTarget.style.background = "none"; }}
                            >
                              Bilgileri Güncelle
                            </button>
                            
                            <Link href={`/dashboard/students/${student.id}/measurements/new`} onClick={() => setActiveDropdown(null)} style={{ textDecoration: "none", display: "block" }}>
                              <div 
                                style={{ width: "100%", padding: "10px 16px", fontSize: "13px", fontWeight: 700, color: "#334155", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                                onMouseOver={(e) => { e.currentTarget.style.background = "#f1f5f9"; }}
                                onMouseOut={(e) => { e.currentTarget.style.background = "none"; }}
                              >
                                Ölçü Gir
                              </div>
                            </Link>
                            
                            <button 
                              onClick={async () => { 
                                setActiveDropdown(null); 
                                if (confirm(`${student.fullName} adlı danışanı ${student.isActive ? "inaktif" : "aktif"} yapmak istediğinize emin misiniz?`)) {
                                  try {
                                    await axios.put(`${API_BASE}/users/students/${student.id}`, {
                                      studentId: student.id,
                                      isActive: !student.isActive
                                    }, {
                                      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                                    });
                                    setStudents(prev => prev.map(s => s.id === student.id ? { ...s, isActive: !s.isActive } : s));
                                  } catch (err) {
                                    alert("Durum güncellenirken hata oluştu.");
                                  }
                                }
                              }}
                              style={{ width: "100%", padding: "10px 16px", background: "none", border: "none", fontSize: "13px", fontWeight: 700, color: student.isActive ? "#ef4444" : "#10b981", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", borderTop: "1px solid #f1f5f9" }}
                              onMouseOver={(e) => { e.currentTarget.style.background = student.isActive ? "#fef2f2" : "#f0fdf4"; }}
                              onMouseOut={(e) => { e.currentTarget.style.background = "none"; }}
                            >
                              {student.isActive ? "İnaktif Et" : "Aktif Et"}
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Update Modal */}
      {selectedStudentForUpdate && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "white", width: "100%", maxWidth: "480px", borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>Danışan Güncelle</h2>
              <button onClick={() => setSelectedStudentForUpdate(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}><XCircle size={24} /></button>
            </div>
            <div style={{ padding: "24px" }}>
              {fetchingDetails ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "40px", color: "#64748b" }}><Loader2 className="animate-spin" size={32} /></div>
              ) : (
                <form onSubmit={submitUpdate}>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", marginBottom: "8px" }}>Telefon Numarası</label>
                    <input type="tel" value={updateForm.phoneNumber} onChange={e => setUpdateForm({...updateForm, phoneNumber: e.target.value})} style={{ width: "100%", height: "48px", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "0 16px", outline: "none", fontSize: "15px" }} required />
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", marginBottom: "8px" }}>Durum</label>
                    <select value={updateForm.isActive ? "true" : "false"} onChange={e => setUpdateForm({...updateForm, isActive: e.target.value === "true"})} style={{ width: "100%", height: "48px", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "0 16px", outline: "none", fontSize: "15px" }}>
                      <option value="true">Aktif</option>
                      <option value="false">İnaktif</option>
                    </select>
                  </div>
                  {isAdmin && (
                    <div style={{ marginBottom: "32px" }}>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", marginBottom: "8px" }}>Atanan Eğitmen</label>
                      <select value={updateForm.assignedTrainerId} onChange={e => setUpdateForm({...updateForm, assignedTrainerId: e.target.value})} style={{ width: "100%", height: "48px", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "0 16px", outline: "none", fontSize: "15px" }}>
                        <option value="">Atama Yapılmadı</option>
                        {trainers.map(t => <option key={t.id} value={t.id}>{t.fullName}</option>)}
                      </select>
                    </div>
                  )}
                  <button type="submit" disabled={updating} className="btn-action-primary" style={{ width: "100%", height: "48px", justifyContent: "center" }}>
                    {updating ? <Loader2 size={18} className="animate-spin" /> : "Değişiklikleri Kaydet"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
