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
    { icon: FaHeartbeat, label: "หน้าหลัก", href: "/" },
    { icon: FaUserMd, label: "หมอ", href: "/admin/doctors" },
    { icon: FaUserNurse, label: "พยาบาล", href: "/admin/nurses" },
    { icon: FaUsers, label: "เพิ่มผู้ใช้งาน", href: "/admin/register" },
    { icon: FaFileAlt, label: "รายงาน", href: "/admin/reportss" },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800 w-64 min-h-screen shadow-xl border-r border-blue-200/30">
      {/* Header */}
      <div className="p-6 border-b border-blue-200/30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <FaHeartbeat className="text-white text-lg" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">เมนูหลัก</h2>
            <p className="text-xs text-gray-600">ระบบจัดการโรงพยาบาล</p>
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
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:bg-white/70 hover:shadow-md hover:text-blue-600'
                  }
                `}
              >
                <div className={`
                  p-2 rounded-lg mr-3 transition-all duration-200
                  ${isActive
                    ? 'bg-white/20'
                    : 'bg-blue-100/50 group-hover:bg-blue-200/70'
                  }
                `}>
                  <Icon className={`
                    text-lg transition-all duration-200
                    ${isActive
                      ? 'text-white'
                      : 'text-blue-600 group-hover:text-blue-700'
                    }
                  `} />
                </div>
                <span className={`
                  font-medium transition-all duration-200
                  ${isActive
                    ? 'text-white'
                    : 'text-gray-700 group-hover:text-blue-600'
                  }
                `}>
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
          className="group flex items-center px-4 py-3 rounded-xl transition-all duration-200 ease-in-out text-red-600 hover:bg-red-50 hover:shadow-md"
        >
          <div className="p-2 rounded-lg mr-3 bg-red-100/50 group-hover:bg-red-200/70 transition-all duration-200">
            <FaSignOutAlt className="text-lg text-red-600 group-hover:text-red-700 transition-all duration-200" />
          </div>
          <span className="font-medium group-hover:text-red-700 transition-all duration-200">
            ออกจากระบบ
          </span>
        </Link>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
    </div>
  );
}