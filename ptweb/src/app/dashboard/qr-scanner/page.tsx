"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Camera, Loader2, CheckCircle2, AlertTriangle, 
  RefreshCw, Sparkles, QrCode 
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";

const API_BASE = "http://localhost:5064/api";

interface ScanResult {
  success: boolean;
  message: string;
  studentName: string;
  packageName: string;
  totalSessions: number;
  usedSessions: number;
  remainingSessions: number;
}

export default function QrScannerPage() {
  const router = useRouter();
  const scannerRef = useRef<any>(null);
  const [scanStatus, setScanStatus] = useState<"scanning" | "loading" | "success" | "error">("scanning");
  const [resultData, setResultData] = useState<ScanResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const startScanner = () => {
    setScanStatus("scanning");
    setResultData(null);
    setErrorMessage("");

    // Small timeout to allow container to render properly
    setTimeout(() => {
      try {
        if (scannerRef.current) {
          scannerRef.current.clear();
        }

        const html5QrcodeScanner = new Html5QrcodeScanner(
          "reader",
          { 
            fps: 10, 
            qrbox: { width: 250, height: 250 },
            formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ]
          },
          /* verbose= */ false
        );

        html5QrcodeScanner.render(onScanSuccess, onScanFailure);
        scannerRef.current = html5QrcodeScanner;
      } catch (err) {
        console.error("Scanner başlatılamadı:", err);
      }
    }, 100);
  };

  useEffect(() => {
    startScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((err: any) => console.error("Scanner temizlenemedi:", err));
      }
    };
  }, []);

  const onScanSuccess = async (decodedText: string) => {
    if (scanStatus === "loading") return;

    // Haptic feedback (Vibration)
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(100);
    }

    // Stop scanner
    if (scannerRef.current) {
      scannerRef.current.clear().catch((e: any) => console.error(e));
    }

    setScanStatus("loading");

    try {
      const token = localStorage.getItem("token");
      
      // Post to check-in endpoint
      const res = await axios.post(`${API_BASE}/appointments/check-in`, {
        studentId: decodedText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data: ScanResult = res.data;

      if (data.success) {
        setResultData(data);
        setScanStatus("success");
      } else {
        setErrorMessage(data.message);
        setScanStatus("error");
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Check-in işlemi başarısız oldu. Lütfen paketi ve internet bağlantısını kontrol edin.");
      setScanStatus("error");
    }
  };

  const onScanFailure = (error: any) => {
    // Silent failure for continuous scanning
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
        <Link href="/dashboard" style={{ background: "white", border: "1px solid #e2e8f0", width: "40px", height: "40px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 900, color: "#0f172a" }}>Seans Check-in</h1>
          <p style={{ fontSize: "13px", fontWeight: 600, color: "#64748b" }}>Kamerayla danışan QR kodunu taratın</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "28px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", textAlign: "center", minHeight: "420px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        
        {/* SCANNING STATE */}
        {scanStatus === "scanning" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f5f3ff", color: "#8b5cf6", fontSize: "12px", fontWeight: 800, padding: "6px 14px", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "24px" }}>
              <Camera size={14} />
              Kamera Aktif
            </div>

            {/* Custom html5-qrcode reader mounting target */}
            <div id="reader" style={{ width: "100%", overflow: "hidden", borderRadius: "20px", border: "none" }}></div>

            <p style={{ fontSize: "13px", fontWeight: 600, color: "#94a3b8", marginTop: "20px" }}>
              Danışanın telefonundaki QR kodu çerçevenin ortasına hizalayın.
            </p>
          </div>
        )}

        {/* LOADING STATE */}
        {scanStatus === "loading" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            <Loader2 className="animate-spin" size={48} color="#8b5cf6" />
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>Seans Doğrulanıyor</h3>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#64748b" }}>Paket durumu ve aktif randevu kontrol ediliyor...</p>
            </div>
          </div>
        )}

        {/* SUCCESS SPLASH STATE */}
        {scanStatus === "success" && resultData && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", animation: "scaleUp 0.4s ease-out" }}>
            <div style={{ width: "80px", height: "80px", background: "#ecfdf5", color: "#10b981", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px", boxShadow: "0 10px 20px rgba(16, 185, 129, 0.1)" }}>
              <CheckCircle2 size={44} />
            </div>

            <h2 style={{ fontSize: "24px", fontWeight: 900, color: "#065f46", marginBottom: "4px" }}>Check-in Başarılı!</h2>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#10b981", marginBottom: "24px" }}>{resultData.message}</p>

            {/* Student Info Card */}
            <div style={{ background: "#f0fdf4", border: "1px solid #a7f3d0", borderRadius: "20px", padding: "20px", width: "100%", maxWidth: "340px", marginBottom: "24px", textAlign: "left" }}>
              <div style={{ fontSize: "11px", fontWeight: 800, color: "#059669", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>Üyelik Seans Detayı</div>
              <div style={{ fontSize: "18px", fontWeight: 900, color: "#065f46", marginBottom: "2px" }}>{resultData.studentName}</div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#047857", marginBottom: "16px" }}>{resultData.packageName}</div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", borderTop: "1px dashed #a7f3d0", paddingTop: "12px" }}>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#059669" }}>Kullanılan Seans</div>
                  <div style={{ fontSize: "20px", fontWeight: 900, color: "#065f46" }}>{resultData.usedSessions} / {resultData.totalSessions}</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#059669" }}>Kalan Seans</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ fontSize: "20px", fontWeight: 900, color: "#065f46" }}>{resultData.remainingSessions}</span>
                    <Sparkles size={14} color="#10b981" />
                  </div>
                </div>
              </div>
            </div>

            <button onClick={startScanner} style={{ background: "#10b981", color: "white", border: "none", borderRadius: "14px", height: "48px", padding: "0 28px", fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", boxShadow: "0 4px 14px rgba(16, 185, 129, 0.2)" }}>
              <RefreshCw size={16} />
              Yeni Tarama Başlat
            </button>
          </div>
        )}

        {/* ERROR SPLASH STATE */}
        {scanStatus === "error" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", animation: "scaleUp 0.4s ease-out" }}>
            <div style={{ width: "80px", height: "80px", background: "#fef2f2", color: "#ef4444", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px", boxShadow: "0 10px 20px rgba(239, 68, 68, 0.1)" }}>
              <AlertTriangle size={44} />
            </div>

            <h2 style={{ fontSize: "24px", fontWeight: 900, color: "#991b1b", marginBottom: "8px" }}>Giriş Reddedildi!</h2>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#ef4444", width: "100%", maxWidth: "320px", lineHeight: 1.5, marginBottom: "32px" }}>{errorMessage}</p>

            <button onClick={startScanner} style={{ background: "#ef4444", color: "white", border: "none", borderRadius: "14px", height: "48px", padding: "0 28px", fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", boxShadow: "0 4px 14px rgba(239, 68, 68, 0.2)" }}>
              <RefreshCw size={16} />
              Yeniden Dene
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
