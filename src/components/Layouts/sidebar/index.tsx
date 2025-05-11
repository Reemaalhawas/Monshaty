"use client";
import React from 'react';
import Link from 'next/link';

export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4 hidden md:block">
      {/* TODO: Replace with real navigation items */}
      <h2 className="text-xl font-bold mb-4">Monshaty</h2>
      <nav className="flex flex-col space-y-2">
        <Link href="/dashboard" className="hover:bg-gray-700 p-2 rounded">Dashboard</Link>
        <Link href="/upload" className="hover:bg-gray-700 p-2 rounded">Upload Data</Link>
        {/* Add more links */}
      </nav>
    </aside>
  );
}
