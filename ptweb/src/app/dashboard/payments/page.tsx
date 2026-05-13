"use client";

import { useEffect, useState } from "react";
import { 
  CreditCard, Search, ArrowDownCircle, ArrowUpCircle, 
  DollarSign, CheckCircle, Clock, Loader2, Check, X 
} from "lucide-react";
import axios from "axios";
import { useRole } from "../../lib/useRole";
import { useRouter } from "next/navigation";

const API_BASE = "http://localhost:5064/api";

interface PaymentItem {
  id: string;
  studentName: string;
  packageName: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: string;
  dueDate?: string;
  paidAt?: string;
  createdAt: string;
}

const translateMethod = (m: string) => {
  switch (m.toLowerCase()) {
    case "cash": return "Nakit";
    case "card": return "Kredi Kartı";
    case "transfer": return "Havale / EFT";
    default: return m;
  }
};

const getMethodColor = (m: string) => {
  switch (m.toLowerCase()) {
    case "cash": return { bg: "#ecfdf5", text: "#059669" }; // Green
    case "card": return { bg: "#f5f3ff", text: "#7c3aed" }; // Purple
    case "transfer": return { bg: "#eff6ff", text: "#2563eb" }; // Blue
    default: return { bg: "#f1f5f9", text: "#64748b" };
  }
};

export default function PaymentsPage() {
  const { isAdmin, isLoading: roleLoading } = useRole();
  const router = useRouter();

  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [isAdmin, roleLoading, router]);
  
  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");

  // Action States
  const [confirmingPayment, setConfirmingPayment] = useState<PaymentItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPayments = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/payments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(res.data);
    } catch (err) {
      setError("Ödeme geçmişi yüklenirken hata oluştu.");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleMarkAsPaid = async () => {
    if (!confirmingPayment) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE}/payments/${confirmingPayment.id}/status`, 
        { status: "Paid" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setConfirmingPayment(null);
      // Silent refresh metrics & table
      await fetchPayments(true);
    } catch (err) {
      alert("Durum güncellenirken bir hata oluştu.");
    } finally {
      setActionLoading(false);
    }
  };

  // Metrics Calculation
  const paidTotal = payments.filter(p => p.status.toLowerCase() === "paid").reduce((sum, p) => sum + p.amount, 0);
  const pendingTotal = payments.filter(p => p.status.toLowerCase() === "pending").reduce((sum, p) => sum + p.amount, 0);
  const grandTotal = paidTotal + pendingTotal;

  // Filtering logic
  const filteredPayments = payments.filter(p => {
    const matchesSearch = p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.packageName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || p.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesMethod = methodFilter === "All" || p.paymentMethod.toLowerCase() === methodFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const cardStyle = {
    background: "white", border: "1px solid #e2e8f0", borderRadius: "20px", padding: "28px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
  };

  if (loading || roleLoading) {
    return (
      <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
        <Loader2 className="animate-spin" size={32} />
        <span style={{ marginLeft: "12px", fontWeight: 600 }}>Ödeme listesi yükleniyor...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 900, color: "#0f172a", letterSpacing: "-1px", marginBottom: "8px" }}>
          Kasa ve Ödemeler Yönetimi
        </h1>
        <p style={{ fontSize: "16px", color: "#64748b", fontWeight: 500 }}>
          Tüm paket tahsilatlarını, bekleyen borçları ve geçmiş kasa girişlerini bu ekrandan takip edebilirsiniz.
        </p>
      </div>

      {/* Metrics Cards Row */}
      <div className="payments-grid-3col" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginBottom: "32px" }}>
        
        {/* Paid Total Card */}
        <div style={{ ...cardStyle, background: "#f0fdf4", borderColor: "#bbf7d0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#16a34a", textTransform: "uppercase", letterSpacing: "0.05em" }}>TAHSİL EDİLEN (ÖDENDİ)</span>
            <div style={{ fontSize: "32px", fontWeight: 900, color: "#14532d", marginTop: "8px" }}>
              {paidTotal.toLocaleString("tr-TR")} <span style={{ fontSize: "18px", fontWeight: 700 }}>TRY</span>
            </div>
          </div>
          <div style={{ width: "54px", height: "54px", borderRadius: "16px", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", color: "#16a34a" }}>
            <ArrowUpCircle size={28} />
          </div>
        </div>

        {/* Pending Total Card */}
        <div style={{ ...cardStyle, background: "#fffbeb", borderColor: "#fde68a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#d97706", textTransform: "uppercase", letterSpacing: "0.05em" }}>TOPLAM ALACAK (BEKLEYEN)</span>
            <div style={{ fontSize: "32px", fontWeight: 900, color: "#78350f", marginTop: "8px" }}>
              {pendingTotal.toLocaleString("tr-TR")} <span style={{ fontSize: "18px", fontWeight: 700 }}>TRY</span>
            </div>
          </div>
          <div style={{ width: "54px", height: "54px", borderRadius: "16px", background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", color: "#d97706" }}>
            <Clock size={28} />
          </div>
        </div>

        {/* Grand Total Card */}
        <div style={{ ...cardStyle, background: "#eff6ff", borderColor: "#bfdbfe", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: "12px", fontWeight: 800, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.05em" }}>GENEL TOPLAM CİRO</span>
            <div style={{ fontSize: "32px", fontWeight: 900, color: "#1e3a8a", marginTop: "8px" }}>
              {grandTotal.toLocaleString("tr-TR")} <span style={{ fontSize: "18px", fontWeight: 700 }}>TRY</span>
            </div>
          </div>
          <div style={{ width: "54px", height: "54px", borderRadius: "16px", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563eb" }}>
            <DollarSign size={28} />
          </div>
        </div>
      </div>

      {/* Filters & Controls Row */}
      <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "20px", display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", marginBottom: "24px", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" }}>
        
        {/* Search Bar */}
        <div style={{ flex: 2, minWidth: "240px", position: "relative" }}>
          <Search size={18} color="#94a3b8" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
          <input 
            type="text" 
            placeholder="Danışan veya paket ismiyle ara..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", height: "46px", paddingLeft: "44px", paddingRight: "16px", border: "1px solid #e2e8f0", borderRadius: "10px", outline: "none", background: "#f8fafc", fontSize: "14px" }} 
          />
        </div>

        {/* Status Select */}
        <div style={{ flex: 1, minWidth: "160px" }}>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: "100%", height: "46px", padding: "0 12px", border: "1px solid #e2e8f0", borderRadius: "10px", outline: "none", background: "#f8fafc", fontSize: "14px", color: "#475569", fontWeight: 600 }}
          >
            <option value="All">Tüm Durumlar</option>
            <option value="Paid">Ödenenler</option>
            <option value="Pending">Ödenecekler (Bekleyen)</option>
          </select>
        </div>

        {/* Method Select */}
        <div style={{ flex: 1, minWidth: "160px" }}>
          <select 
            value={methodFilter} 
            onChange={(e) => setMethodFilter(e.target.value)}
            style={{ width: "100%", height: "46px", padding: "0 12px", border: "1px solid #e2e8f0", borderRadius: "10px", outline: "none", background: "#f8fafc", fontSize: "14px", color: "#475569", fontWeight: 600 }}
          >
            <option value="All">Tüm Yöntemler</option>
            <option value="Cash">Nakit</option>
            <option value="Card">Kredi Kartı</option>
            <option value="Transfer">Havale / EFT</option>
          </select>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
        {filteredPayments.length === 0 ? (
          <div style={{ padding: "60px 40px", textAlign: "center", color: "#94a3b8" }}>
            <CreditCard size={48} style={{ margin: "0 auto 16px", opacity: 0.4 }} />
            <p style={{ fontSize: "16px", fontWeight: 600 }}>Eşleşen bir ödeme kaydı bulunamadı.</p>
            <p style={{ fontSize: "13px", marginTop: "4px" }}>Filtreleri temizlemeyi deneyebilirsiniz.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  <th style={{ padding: "16px 24px", textAlign: "left", fontSize: "11px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Kayıt Tarihi</th>
                  <th style={{ padding: "16px 24px", textAlign: "left", fontSize: "11px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Danışan & Paket</th>
                  <th style={{ padding: "16px 24px", textAlign: "left", fontSize: "11px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Tutar</th>
                  <th style={{ padding: "16px 24px", textAlign: "left", fontSize: "11px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Ödeme Türü</th>
                  <th style={{ padding: "16px 24px", textAlign: "left", fontSize: "11px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Durum</th>
                  <th style={{ padding: "16px 24px", textAlign: "right", fontSize: "11px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((p) => {
                  const isPaid = p.status.toLowerCase() === "paid";
                  const mColors = getMethodColor(p.paymentMethod);

                  return (
                    <tr key={p.id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.2s" }}>
                      
                      {/* Date Column */}
                      <td style={{ padding: "20px 24px", verticalAlign: "middle" }}>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b" }}>
                          {new Date(p.createdAt).toLocaleDateString("tr-TR")}
                        </div>
                        <div style={{ fontSize: "11px", fontWeight: 500, color: "#94a3b8", marginTop: "4px" }}>
                          {new Date(p.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </td>

                      {/* Student & Package Column */}
                      <td style={{ padding: "20px 24px", verticalAlign: "middle" }}>
                        <div style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a" }}>
                          {p.studentName}
                        </div>
                        <div style={{ fontSize: "12px", fontWeight: 600, color: "#6366f1", marginTop: "4px" }}>
                          {p.packageName}
                        </div>
                      </td>

                      {/* Amount Column */}
                      <td style={{ padding: "20px 24px", verticalAlign: "middle" }}>
                        <div style={{ fontSize: "16px", fontWeight: 900, color: isPaid ? "#16a34a" : "#d97706" }}>
                          {p.amount.toLocaleString("tr-TR")} <span style={{ fontSize: "12px", fontWeight: 700 }}>{p.currency}</span>
                        </div>
                      </td>

                      {/* Method Column */}
                      <td style={{ padding: "20px 24px", verticalAlign: "middle" }}>
                        <span style={{ 
                          display: "inline-block", 
                          padding: "4px 12px", 
                          borderRadius: "8px", 
                          fontSize: "12px", 
                          fontWeight: 700,
                          background: mColors.bg, 
                          color: mColors.text 
                        }}>
                          {translateMethod(p.paymentMethod)}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td style={{ padding: "20px 24px", verticalAlign: "middle" }}>
                        {isPaid ? (
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", background: "#ecfdf5", border: "1px solid #10b98120", color: "#047857", borderRadius: "20px", fontSize: "12px", fontWeight: 800 }}>
                            <CheckCircle size={14} />
                            Ödendi
                          </div>
                        ) : (
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", background: "#fffbeb", border: "1px solid #f59e0b20", color: "#b45309", borderRadius: "20px", fontSize: "12px", fontWeight: 800 }}>
                            <Clock size={14} />
                            Beklemede
                          </div>
                        )}
                      </td>

                      {/* Actions Column */}
                      <td style={{ padding: "20px 24px", textAlign: "right", verticalAlign: "middle" }}>
                        {!isPaid ? (
                          <button 
                            onClick={() => setConfirmingPayment(p)}
                            style={{ 
                              background: "#10b981", 
                              color: "white", 
                              border: "none", 
                              borderRadius: "10px", 
                              padding: "8px 16px", 
                              fontSize: "13px", 
                              fontWeight: 700, 
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              boxShadow: "0 2px 4px rgba(16,185,129,0.1)"
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = "#059669"}
                            onMouseOut={(e) => e.currentTarget.style.background = "#10b981"}
                          >
                            <Check size={16} />
                            Ödemeyi Al
                          </button>
                        ) : (
                          <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600 }}>
                            Makbuz / Detay
                          </div>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Confirmation Slide/Modal */}
      {confirmingPayment && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.6)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
          <div style={{ background: "white", width: "90%", maxWidth: "450px", borderRadius: "24px", padding: "32px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
            <div style={{ width: "60px", height: "60px", borderRadius: "20px", background: "#ecfdf5", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <CheckCircle size={32} />
            </div>
            
            <h3 style={{ textAlign: "center", fontSize: "20px", fontWeight: 900, color: "#0f172a", marginBottom: "8px" }}>Tahsilatı Onaylıyor musunuz?</h3>
            <p style={{ textAlign: "center", color: "#64748b", fontSize: "14px", fontWeight: 500, lineHeight: 1.5, marginBottom: "24px" }}>
              <strong>{confirmingPayment.studentName}</strong> isimli danışanın <strong>{confirmingPayment.packageName}</strong> paketi için yaptığı <strong>{confirmingPayment.amount.toLocaleString("tr-TR")} {confirmingPayment.currency}</strong> tutarındaki ödeme durumu <strong>ÖDENDİ</strong> olarak güncellenecektir.
            </p>

            <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", marginBottom: "28px" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase" }}>Ödeme Türü</div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b", marginTop: "2px" }}>{translateMethod(confirmingPayment.paymentMethod)}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "11px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase" }}>Toplam Tutar</div>
                <div style={{ fontSize: "15px", fontWeight: 900, color: "#10b981", marginTop: "2px" }}>{confirmingPayment.amount.toLocaleString("tr-TR")} {confirmingPayment.currency}</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <button 
                onClick={() => setConfirmingPayment(null)}
                style={{ height: "48px", border: "1px solid #e2e8f0", background: "white", color: "#475569", borderRadius: "12px", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}
              >
                Vazgeç
              </button>
              <button 
                onClick={handleMarkAsPaid}
                disabled={actionLoading}
                style={{ height: "48px", background: "#10b981", color: "white", border: "none", borderRadius: "12px", fontWeight: 800, fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", opacity: actionLoading ? 0.7 : 1 }}
              >
                {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                {actionLoading ? "İşleniyor..." : "Evet, Tahsil Et"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
