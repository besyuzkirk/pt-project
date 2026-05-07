"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard, Users, UserPlus, UserCog, Package,
  Calendar, Bell, Settings, LogOut, Search, ChevronDown, Menu, X
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRole } from "../lib/useRole";

// ── Menu definitions ──────────────────────────────────────────────────────────
const adminMenuSections = [
  {
    title: "GENEL",
    items: [{ icon: LayoutDashboard, label: "Genel Bakış", href: "/dashboard" }]
  },
  {
    title: "DANIŞAN YÖNETİMİ",
    items: [
      { icon: UserPlus, label: "Danışan Kaydı", href: "/dashboard/register-student" },
      { icon: Users, label: "Tüm Danışanlar", href: "/dashboard/students" },
    ]
  },
  {
    title: "TRAINER YÖNETİMİ",
    items: [
      { icon: UserPlus, label: "Trainer Kaydı", href: "/dashboard/register-trainer" },
      { icon: Users, label: "Tüm Trainerlar", href: "/dashboard/trainers" },
    ]
  },
  {
    title: "YÖNETİM",
    items: [
      { icon: Package, label: "Paketler", href: "/dashboard/packages" },
    ]
  },
  {
    title: "PLANLAMA & ATAMA",
    items: [
      { icon: Calendar, label: "Takvim", href: "/dashboard/calendar" },
      { icon: Package, label: "Paket Atama", href: "/dashboard/assign-package" },
    ]
  },
  {
    title: "SİSTEM",
    items: [
      { icon: Bell, label: "Bildirimler", href: "/dashboard/notifications" },
      { icon: Settings, label: "Ayarlar", href: "/dashboard/settings" },
    ]
  }
];

// Trainer only sees their relevant sections — no trainer management, no student registration
const trainerMenuSections = [
  {
    title: "GENEL",
    items: [{ icon: LayoutDashboard, label: "Genel Bakış", href: "/dashboard" }]
  },
  {
    title: "DANIŞAN YÖNETİMİ",
    items: [
      { icon: UserPlus, label: "Danışan Kaydı", href: "/dashboard/register-student" },
      { icon: Users, label: "Danışanlarım", href: "/dashboard/students" },
    ]
  },
  {
    title: "PAKET & PLANLAMA",
    items: [
      { icon: Package, label: "Paketler", href: "/dashboard/packages" },
      { icon: Calendar, label: "Takvim", href: "/dashboard/calendar" },
      { icon: Package, label: "Paket Atama", href: "/dashboard/assign-package" },
    ]
  },
  {
    title: "SİSTEM",
    items: [
      { icon: Bell, label: "Bildirimler", href: "/dashboard/notifications" },
      { icon: Settings, label: "Ayarlar", href: "/dashboard/settings" },
    ]
  }
];


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin, isStudent, isLoading } = useRole();
  const [user, setUser] = useState({ name: "Yükleniyor...", role: "..." });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && isStudent) {
      // Danışanlar admin dashboard alanına giremez
      router.replace("/login");
    }
  }, [isStudent, isLoading, router]);

  useEffect(() => {
    const r = localStorage.getItem("userRole") || "Admin";
    const name = localStorage.getItem("userName") || "Kullanıcı";
    setUser({ name, role: r === "Admin" ? "Yönetici" : "Eğitmen" });
  }, []);

  const menuSections = isAdmin ? adminMenuSections : trainerMenuSections;

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw", overflow: "hidden" }}>
      {/* ── SIDEBAR ── */}
      <aside className="sidebar-fixed">
        {/* Logo */}
        <div style={{ padding: "28px 24px", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", background: "#4f46e5", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Package size={20} color="white" />
            </div>
            <span style={{ fontSize: "20px", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.5px" }}>PtApp</span>
          </div>
        </div>

        {/* Role badge */}
        <div style={{ padding: "12px 24px", borderBottom: "1px solid #f1f5f9" }}>
          <span style={{
            display: "inline-block",
            padding: "4px 12px",
            borderRadius: "8px",
            fontSize: "11px",
            fontWeight: 800,
            background: isAdmin ? "#eff6ff" : "#f0fdf4",
            color: isAdmin ? "#4f46e5" : "#10b981",
            textTransform: "uppercase",
            letterSpacing: "0.07em"
          }}>
            {isLoading ? "..." : isAdmin ? "Yönetici" : "Eğitmen"}
          </span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 0", overflowY: "auto" }}>
          {menuSections.map((section) => (
            <div key={section.title} style={{ marginBottom: "24px" }}>
              <div style={{ padding: "0 24px 8px", fontSize: "10px", fontWeight: 800, color: "#cbd5e1", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {section.title}
              </div>
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} className={`nav-menu-item ${isActive ? "active-item" : ""}`}>
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: "16px", borderTop: "1px solid #f1f5f9" }}>
          <button
            onClick={() => { window.location.href = "/login"; }}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", background: "#fff5f5", border: "none", borderRadius: "8px", color: "#ef4444", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}
          >
            <LogOut size={18} />
            Oturumu Kapat
          </button>
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <div className="main-scrollable">
        {/* Header */}
        <header className="header-fixed">
          <div className="header-search-bar">
            <Search size={18} color="#94a3b8" />
            <input type="text" placeholder="Hızlı arama..." className="header-search-input" />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button style={{ width: "40px", height: "40px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
              <Bell size={20} color="#64748b" />
              <div style={{ position: "absolute", top: "8px", right: "8px", width: "8px", height: "8px", background: "#4f46e5", borderRadius: "50%", border: "2px solid white" }} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingLeft: "16px", borderLeft: "1px solid #e2e8f0" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "14px", fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>{user.name}</div>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "#4f46e5", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "3px" }}>{user.role}</div>
              </div>
              <div style={{ width: "40px", height: "40px", background: "#0f172a", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: "16px" }}>
                {user.name.charAt(0)}
              </div>
              <ChevronDown size={16} color="#94a3b8" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-container">
          {children}
        </main>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <div className="mobile-bottom-nav">
        <Link href="/dashboard" className={`mobile-nav-item ${pathname === "/dashboard" ? "active" : ""}`}>
          <LayoutDashboard size={22} />
          <span>Panel</span>
        </Link>
        <Link href="/dashboard/students" className={`mobile-nav-item ${pathname.startsWith("/dashboard/students") ? "active" : ""}`}>
          <Users size={22} />
          <span>Danışanlar</span>
        </Link>
        <Link href="/dashboard/calendar" className={`mobile-nav-item ${pathname === "/dashboard/calendar" ? "active" : ""}`}>
          <Calendar size={22} />
          <span>Takvim</span>
        </Link>
        <button onClick={() => setIsMobileMenuOpen(true)} className="mobile-nav-item">
          <Menu size={22} />
          <span>Menü</span>
        </button>
      </div>

      {/* ── MOBILE SLIDING BOTTOM SHEET OVERLAY ── */}
      {isMobileMenuOpen && (
        <div className="mobile-sheet-backdrop" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-sheet-container" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-sheet-header">
              <h3>Hızlı İşlemler & Menü</h3>
              <button className="mobile-sheet-close" onClick={() => setIsMobileMenuOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="mobile-sheet-grid">
              <Link href="/dashboard/register-student" onClick={() => setIsMobileMenuOpen(false)} className="mobile-grid-item">
                <div className="item-icon-bg purple"><UserPlus size={20} /></div>
                <span>Danışan Ekle</span>
              </Link>
              {isAdmin && (
                <>
                  <Link href="/dashboard/register-trainer" onClick={() => setIsMobileMenuOpen(false)} className="mobile-grid-item">
                    <div className="item-icon-bg green"><UserPlus size={20} /></div>
                    <span>Trainer Ekle</span>
                  </Link>
                  <Link href="/dashboard/trainers" onClick={() => setIsMobileMenuOpen(false)} className="mobile-grid-item">
                    <div className="item-icon-bg blue"><Users size={20} /></div>
                    <span>Trainer Listesi</span>
                  </Link>
                </>
              )}
              <Link href="/dashboard/packages" onClick={() => setIsMobileMenuOpen(false)} className="mobile-grid-item">
                <div className="item-icon-bg orange"><Package size={20} /></div>
                <span>Paketler</span>
              </Link>
              <Link href="/dashboard/assign-package" onClick={() => setIsMobileMenuOpen(false)} className="mobile-grid-item">
                <div className="item-icon-bg indigo"><Package size={20} /></div>
                <span>Paket Atama</span>
              </Link>
              <Link href="/dashboard/notifications" onClick={() => setIsMobileMenuOpen(false)} className="mobile-grid-item">
                <div className="item-icon-bg red"><Bell size={20} /></div>
                <span>Bildirimler</span>
              </Link>
              <Link href="/dashboard/settings" onClick={() => setIsMobileMenuOpen(false)} className="mobile-grid-item">
                <div className="item-icon-bg gray"><Settings size={20} /></div>
                <span>Ayarlar</span>
              </Link>
            </div>

            <button 
              onClick={() => { window.location.href = "/login"; }}
              className="mobile-sheet-logout"
            >
              <LogOut size={18} />
              <span>Oturumu Kapat</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

