import React from 'react';
import Link from 'next/link';
import { Search, Package, User, Tag, Camera } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 px-4 py-3">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
          <span className="font-bold text-xl tracking-tight text-gray-900">PokéDex</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/search" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
            <Search className="w-4 h-4" /> Search
          </Link>
          <Link href="/ai-scan" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1">
            <Camera className="w-4 h-4" /> AI Scan
          </Link>
          <Link href="/marketplace" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
            <Tag className="w-4 h-4" /> Marketplace
          </Link>
          <Link href="/collection" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
            <Package className="w-4 h-4" /> My Dex
          </Link>
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
            <User className="w-4 h-4" /> Account
          </Link>
        </div>
      </div>
    </nav>
  );
}
