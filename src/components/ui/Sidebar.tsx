"use client";

import Link from "next/link";
import {
  FaHeartbeat,
  FaSignOutAlt,
  FaUserMd,
  FaUserNurse,
  FaUsers,
  FaFileAlt,
} from "react-icons/fa";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const hideSidebar = pathname === "/admin/profile";

  if (hideSidebar) return null;

  const menuItems = [
    { icon: FaHeartbeat, label: "หน้าหลัก", href: "/admin/dashboard" },
    { icon: FaUserMd, label: "หมอ", href: "/admin/doctors" },
    { icon: FaUserNurse, label: "พยาบาล", href: "/admin/nurses" },
    { icon: FaUsers, label: "เพิ่มผู้ใช้งาน", href: "/admin/register" },
    { icon: FaFileAlt, label: "รายงาน", href: "/admin/reportss" },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white w-64 min-h-screen shadow-xl border-r border-blue-900 relative">

      {/* Header */}
      <div className="p-6 border-b border-blue-200/30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <FaHeartbeat className="text-white text-lg" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">เมนูหลัก</h2>
            <p className="text-xs text-white/80">ระบบจัดการโรงพยาบาล</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4 flex-1">
        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={index}
                href={item.href}
                className={`
                  group flex items-center px-4 py-3 rounded-xl transition-all duration-200 ease-in-out
                  ${isActive
                    ? 'bg-white/20 shadow-lg transform scale-105'
                    : 'hover:bg-white/10'}
                `}
              >
                <div className={`p-2 rounded-lg mr-3 transition-all duration-200
                  ${isActive
                    ? 'bg-white/30'
                    : 'bg-white/10 group-hover:bg-white/20'}
                `}>
                  <Icon className="text-white text-lg transition-all duration-200" />
                </div>
                <span className="font-medium text-white transition-all duration-200">
                  {item.label}
                </span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-blue-200/30">
        <Link
          href="/admin/profile"
          className="group flex items-center px-4 py-3 rounded-xl transition-all duration-200 ease-in-out hover:bg-white/10"
        >
          <div className="p-2 rounded-lg mr-3 bg-white/10 group-hover:bg-white/20 transition-all duration-200">
            <FaSignOutAlt className="text-white text-lg transition-all duration-200" />
          </div>
          <span className="font-medium text-white transition-all duration-200">
            ออกจากระบบ
          </span>
        </Link>
      </div>
    </div>
  );
}
