"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, Upload, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";

export function Navigation() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { path: "/", icon: Home, label: "Feed" },
    { path: "/leaderboard", icon: Trophy, label: "Leaderboard" },
  ];

  if (user) {
    navLinks.push({ path: "/upload", icon: Upload, label: "Upload" });
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MM</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Memester
              </span>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden md:flex space-x-4">
              {navLinks.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  href={path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive(path)
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-700">
                  <User size={18} />
                  <span className="text-sm font-medium">{user.email}</span>
                </div>
                <button
                  onClick={signOut}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <LogOut size={18} />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <LogIn size={18} />
                <span className="font-medium">Sign In</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden border-t border-gray-200 pt-2 pb-3">
          <div className="flex space-x-1">
            {navLinks.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                href={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                  isActive(path)
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                }`}
              >
                <Icon size={16} />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
