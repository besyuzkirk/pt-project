import React from 'react';

const navItems = [
  { label: 'Dashboard', href: '/' },
  { label: 'Üyeler', href: '/members' },
  { label: 'Antrenmanlar', href: '/workouts' },
  { label: 'Ayarlar', href: '/settings' },
];

export default function Sidebar() {
  return (
    <nav className="nav-menu">
      {navItems.map((item) => (
        <a key={item.href} href={item.href} className="nav-menu-item">
          {item.label}
        </a>
      ))}
    </nav>
  );
}
