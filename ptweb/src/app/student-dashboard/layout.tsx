"use client";

import { useEffect, useState } from "react";
import { LogOut, User, Calendar, Bell } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRole } from "../lib/useRole";
import axios from "axios";

export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isStudent, isAdmin, isTrainer, isLoading } = useRole();
  const [user, setUser] = useState({ name: "Yükleniyor...", role: "..." });

  useEffect(() => {
    if (!isLoading && (isAdmin || isTrainer)) {
      // Eğitmen veya Adminler buraya girmemeli
      router.replace("/dashboard");
    }
    if (!isLoading && !isStudent && !isAdmin && !isTrainer) {
        router.replace("/login");
    }
  }, [isStudent, isAdmin, isTrainer, isLoading, router]);

  useEffect(() => {
    const name = localStorage.getItem("userName") || "Danışan";
    setUser({ name, role: "Danışan" });
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100vw", overflowX: "hidden", background: "#f8fafc" }}>
      {/* ── HEADER ── */}
      <header style={{ 
        height: "70px", 
        background: "rgba(255, 255, 255, 0.8)", 
        backdropFilter: "blur(12px)", 
        borderBottom: "1px solid #e2e8f0", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between", 
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 40
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", background: "#4f46e5", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 900, fontSize: "16px" }}>
            Pt
          </div>
          <span style={{ fontSize: "18px", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px" }}>PtApp Danışan</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button style={{ width: "36px", height: "36px", background: "#f1f5f9", borderRadius: "10px", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
            <Bell size={18} color="#64748b" />
          </button>
          <button
            onClick={() => { 
                localStorage.clear();
                window.location.href = "/login"; 
            }}
            style={{ width: "36px", height: "36px", background: "#fee2e2", borderRadius: "10px", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#ef4444" }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* ── MAIN AREA ── */}
      <main style={{ flex: 1, padding: "clamp(16px, 4vw, 24px)", paddingBottom: "100px" }}>
        {children}
      </main>

      {/* ── MOBILE BOTTOM NAV ── */}
      <div className="mobile-bottom-nav">
        <Link href="/student-dashboard" className={`mobile-nav-item ${pathname === "/student-dashboard" ? "active" : ""}`}>
          <User size={22} />
          <span>Profilim</span>
        </Link>
        {/*
        <Link href="/student-dashboard/calendar" className={`mobile-nav-item ${pathname === "/student-dashboard/calendar" ? "active" : ""}`}>
          <Calendar size={22} />
          <span>Takvim</span>
        </Link>
        */}
      </div>
    </div>
  );
}
