"use client";
import React from 'react';

export function Header() {
  return (
    <header className="bg-gray-900 text-white flex items-center justify-between p-4 shadow">
      <div className="text-2xl font-bold">Monshaty Admin</div>
      <div className="flex items-center space-x-4">
        {/* Placeholder for search, notifications, profile */}
        <input
          type="search"
          placeholder="Search..."
          className="px-2 py-1 rounded bg-gray-800 text-white focus:outline-none"
        />
        <button className="p-2 rounded hover:bg-gray-700">
          {/* Bell icon placeholder */}
          🔔
        </button>
        <button className="p-2 rounded hover:bg-gray-700">
          {/* User avatar placeholder */}
          👤
        </button>
      </div>
    </header>
  );
}
