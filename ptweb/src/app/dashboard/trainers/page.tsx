"use client";

import { useEffect, useState } from "react";
import { Search, UserCog, MoreVertical, Phone, Calendar, Star, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useRole } from "../../lib/useRole";

const API_BASE = "http://localhost:5064/api";

interface Trainer {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string;
  isActive: boolean;
  createdAt: string;
}

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [filtered, setFiltered] = useState<Trainer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAdmin, isLoading: roleLoading } = useRole();
  const router = useRouter();

  // Guard: only admins can access this page
  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [isAdmin, roleLoading, router]);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/users/trainers`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTrainers(res.data);
        setFiltered(res.data);
      } catch (err: any) {
        setError("Trainerlar yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };
    fetchTrainers();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(trainers.filter(t =>
      t.fullName.toLowerCase().includes(q) ||
      (t.phoneNumber || "").includes(q)
    ));
  }, [search, trainers]);

  const getInitials = (firstName: string, lastName: string) =>
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: 900, color: "#0f172a", letterSpacing: "-1px", marginBottom: "8px" }}>Eğitmen Kadrosu</h1>
          <p style={{ fontSize: "16px", color: "#64748b", fontWeight: 500 }}>
            Sistemde kayıtlı <strong style={{ color: "#0f172a" }}>{trainers.length}</strong> eğitmen bulunuyor
          </p>
        </div>
        <Link href="/dashboard/register-trainer">
          <button className="btn-action-primary">
            <UserCog size={18} />
            Yeni Eğitmen Ekle
          </button>
        </Link>
      </div>

      {/* Search */}
      <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "16px 20px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
        <div className="header-search-bar" style={{ width: "360px" }}>
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="İsim veya telefon ile ara..."
            className="header-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏋️</div>
            <div style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>Eğitmen bulunamadı</div>
            <div style={{ fontSize: "14px", color: "#94a3b8", fontWeight: 500 }}>
              {search ? "Arama kriterini değiştir" : "Henüz eğitmen kaydı yok"}
            </div>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "16px 24px", textAlign: "left", fontSize: "11px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>Eğitmen</th>
                <th style={{ padding: "16px 24px", textAlign: "left", fontSize: "11px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>Telefon</th>
                <th style={{ padding: "16px 24px", textAlign: "left", fontSize: "11px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>Sisteme Katılım</th>
                <th style={{ padding: "16px 24px", textAlign: "left", fontSize: "11px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>Durum</th>
                <th style={{ padding: "16px 24px", textAlign: "right", fontSize: "11px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((trainer, idx) => (
                <tr key={trainer.id} style={{ borderBottom: idx < filtered.length - 1 ? "1px solid #f8fafc" : "none" }}>
                  <td style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div style={{ width: "44px", height: "44px", background: "#0f172a", color: "white", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "14px" }}>
                        {getInitials(trainer.firstName, trainer.lastName)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: "#0f172a", fontSize: "15px" }}>{trainer.fullName}</div>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "2px" }}>Kıdemli Trainer</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Phone size={14} color="#94a3b8" />
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "#475569" }}>{trainer.phoneNumber || "—"}</span>
                    </div>
                  </td>
                  <td style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Calendar size={14} color="#94a3b8" />
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "#475569" }}>{formatDate(trainer.createdAt)}</span>
                    </div>
                  </td>
                  <td style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      {trainer.isActive ? (
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
                    <button style={{ background: "none", border: "none", color: "#cbd5e1", cursor: "pointer", padding: "4px" }}>
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
