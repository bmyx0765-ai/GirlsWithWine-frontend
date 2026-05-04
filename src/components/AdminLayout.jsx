"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  FiMenu,
  FiX,
  FiMapPin,
  FiUsers,
  FiMail,
  FiLogOut,
  FiStar,
  FiFileText,
} from "react-icons/fi";

export default function AdminLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [logoutPopup, setLogoutPopup] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setLogoutPopup(false);
    router.push("/admin/login");
  };

  const navItems = [
    {href: "/admin/sub-city", icon: <FiMapPin />, label: "Sub Cities" },
    { href: "/admin/all-cities", icon: <FiMapPin />, label: "Cities" },
    { href: "/admin/model-girl", icon: <FiUsers />, label: "Model Girl" },
    { href: "/admin/all-contacts", icon: <FiMail />, label: "Messages" },
    { href: "/admin/all-reviews", icon: <FiStar />, label: "Reviews" },
    { href: "/admin/all-blog", icon: <FiFileText />, label: "Blogs" },
    { href: "/admin/all-images", icon: <FiFileText />, label: "Images" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">

      {/* ================= SIDEBAR ================= */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-gradient-to-br from-pink-700 to-pink-500 text-white transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-full flex-col p-6">

          {/* Header */}
          <div className="mb-10 flex items-center justify-between">
            <h1 className="text-xl font-bold">Admin Panel</h1>

            <button className="md:hidden" onClick={() => setIsOpen(false)}>
              <FiX size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {

              const active =
                pathname === item.href ||
                pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                    active
                      ? "bg-white text-pink-700 shadow-lg font-semibold"
                      : "hover:bg-white/10 text-pink-100"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="mt-auto pt-6 border-t border-pink-400/30">

            <button
              onClick={() => setLogoutPopup(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-pink-800/40 py-3 font-semibold border border-pink-300/20 hover:bg-pink-900/50 transition"
            >
              <FiLogOut size={18} />
              Logout
            </button>

          </div>

        </div>
      </aside>

      {/* ================= MAIN AREA ================= */}

      <div className="flex flex-1 flex-col md:ml-64">

        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white px-6 shadow-sm border-b">

          <button
            className="md:hidden"
            onClick={() => setIsOpen(true)}
          >
            <FiMenu size={26} />
          </button>

          <span className="text-sm text-gray-500 font-medium uppercase">
            Admin Dashboard
          </span>

          <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 font-bold">
            A
          </div>

        </header>

        {/* Page Content */}
        <main className="p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>

      </div>

      {/* ================= MOBILE OVERLAY ================= */}

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ================= LOGOUT MODAL ================= */}

      {logoutPopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60">

          <div className="bg-white w-full max-w-sm rounded-2xl p-8 text-center shadow-xl">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
              <FiLogOut size={28} />
            </div>

            <h2 className="text-lg font-bold">Confirm Logout</h2>

            <p className="text-gray-500 mt-2">
              You will need to login again.
            </p>

            <div className="mt-6 flex gap-3">

              <button
                onClick={() => setLogoutPopup(false)}
                className="flex-1 border rounded-lg py-2 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 bg-red-600 text-white rounded-lg py-2 hover:bg-red-700"
              >
                Logout
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}