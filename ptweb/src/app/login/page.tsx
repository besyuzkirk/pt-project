"use client";

import { useState } from "react";
import { Phone, ArrowRight, Lock, Loader2, ShieldCheck } from "lucide-react";
import axios from "axios";

const API_BASE = "http://localhost:5064/api";

export default function LoginPage() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [testCode, setTestCode] = useState("");

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTestCode("");
    try {
      const response = await axios.post(`${API_BASE}/auth/request-otp`, { phoneNumber });
      setTestCode(response.data);
      setStep("otp");
    } catch (err: any) {
      setError("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${API_BASE}/auth/verify-otp`, { phoneNumber, otpCode: otp });
      const { id, accessToken, refreshToken, role, firstName, lastName } = response.data;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userName", `${firstName} ${lastName}`);
      if (id) {
        localStorage.setItem("userId", id);
      }

      if (role === "Student") {
        window.location.href = "/student-dashboard";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setError("Hatalı kod.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '440px', background: '#ffffff', borderRadius: '24px', padding: 'clamp(24px, 6vw, 48px)', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.05)' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ width: '64px', height: '64px', background: '#4f46e5', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4)' }}>
            <Lock style={{ color: 'white' }} size={32} />
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', letterSpacing: '-1px' }}>PtApp Admin</h1>
          <p style={{ fontSize: '14px', fontWeight: '700', color: '#64748b', marginTop: '4px' }}>Yönetici Paneli Girişi</p>
        </div>

        {error && (
          <div style={{ marginBottom: '24px', padding: '16px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', color: '#ef4444', fontSize: '14px', fontWeight: '800', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {step === "phone" ? (
          <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', paddingLeft: '4px' }}>Telefon Numarası</label>
              <div style={{ position: 'relative' }}>
                <Phone style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={20} />
                <input 
                  type="tel" 
                  placeholder="5xx xxx xx xx"
                  style={{ width: '100%', height: '56px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0 16px 0 52px', fontSize: '16px', fontWeight: '600', outline: 'none' }}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-action-primary" style={{ width: '100%', justifyContent: 'center', height: '56px', fontSize: '16px' }}>
              {loading ? <Loader2 className="animate-spin" /> : <>Kod Gönder <ArrowRight size={20} /></>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {testCode && (
              <div style={{ padding: '24px', background: '#eff6ff', border: '1px solid #dbeafe', borderRadius: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', fontWeight: '900', color: '#4f46e5', textTransform: 'uppercase', marginBottom: '8px' }}>Gelen Test Kodu</div>
                <div style={{ fontSize: '40px', fontWeight: '900', color: '#0f172a', letterSpacing: '0.2em' }}>{testCode}</div>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', textAlign: 'center' }}>6 Haneli Kod</label>
              <input 
                type="text" 
                maxLength={6}
                style={{ width: '100%', height: '64px', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '16px', textAlign: 'center', fontSize: '32px', fontWeight: '900', letterSpacing: '0.3em', outline: 'none' }}
                placeholder="------"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                autoFocus
              />
            </div>
            <button type="submit" disabled={loading} className="btn-action-primary" style={{ width: '100%', justifyContent: 'center', height: '56px', fontSize: '16px' }}>
              {loading ? <Loader2 className="animate-spin" /> : "Giriş Yap"}
            </button>
            <button type="button" onClick={() => setStep("phone")} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>Numarayı Değiştir</button>
          </form>
        )}
      </div>
    </main>
  );
}
