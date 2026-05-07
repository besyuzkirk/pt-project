import React from 'react';

export default function Header() {
  return (
    <header className="header-fixed">
      <div className="header-search-bar">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M9 17a8 8 0 100-16 8 8 0 000 16z"
          />
        </svg>
        <input
          className="header-search-input"
          placeholder="Ara..."
          type="text"
        />
      </div>
      <div>
        {/* Placeholder for user avatar / profile actions */}
        <span className="text-muted">Hoşgeldin, Ahmet</span>
      </div>
    </header>
  );
}
