"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const router = useRouter();
  const { data: session, isPending } = useSession();

  const user = session?.user;

  // Logout function
  const handleLogout = async () => {
    await signOut();
    setProfileOpen(false);
    setMenuOpen(false);
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 md:px-8">

        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">📚</span>
            <span className="text-2xl font-bold text-[#183D32]">
              Book<span className="text-[#078641]">Nook</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">

            <Link href="/" className="text-gray-700 hover:text-[#078641] font-medium transition">
              Home
            </Link>

            <Link href="/books" className="text-gray-700 hover:text-[#078641] font-medium transition">
              All Books
            </Link>

            {/* Private Links */}
            {user && (
              <>
                <Link href="/add-book" className="text-gray-700 hover:text-[#078641] font-medium transition">
                  Add Book
                </Link>

                <Link href="/my-books" className="text-gray-700 hover:text-[#078641] font-medium transition">
                  My Books
                </Link>

                <Link href="/my-borrows" className="text-gray-700 hover:text-[#078641] font-medium transition">
                  My Borrows
                </Link>
              </>
            )}

          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">

            {!isPending && !user && (
              <>
                <Link
                  href="/login"
                  className="px-5 py-2 text-[#183D32] font-semibold hover:text-[#078641]"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="px-5 py-2.5 bg-[#078641] text-white rounded-lg font-semibold hover:bg-[#056b34] transition"
                >
                  Register
                </Link>
              </>
            )}

            {/* Logged-in User */}
            {user && (
              <div className="relative">

                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#078641]"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#078641] text-white flex items-center justify-center font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <span className="text-gray-700 font-medium">
                    {user.name}
                  </span>

                  <span className="text-gray-500">⌄</span>
                </button>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 top-14 w-52 bg-white shadow-lg rounded-lg border py-2">

                    <div className="px-4 py-2 border-b">
                      <p className="font-semibold text-[#183D32]">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 break-all">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      My Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>

                  </div>
                )}
              </div>
            )}

          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-2xl text-[#183D32]"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden pb-5 flex flex-col gap-4">

            <Link href="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>

            <Link href="/books" onClick={() => setMenuOpen(false)}>
              All Books
            </Link>

            {user && (
              <>
                <Link href="/add-book" onClick={() => setMenuOpen(false)}>
                  Add Book
                </Link>

                <Link href="/my-books" onClick={() => setMenuOpen(false)}>
                  My Books
                </Link>

                <Link href="/my-borrows" onClick={() => setMenuOpen(false)}>
                  My Borrows
                </Link>

                <Link href="/profile" onClick={() => setMenuOpen(false)}>
                  My Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-left text-red-600"
                >
                  Logout
                </button>
              </>
            )}

            {!isPending && !user && (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>

                <Link href="/register" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}

          </div>
        )}

      </div>
    </nav>
  );
}