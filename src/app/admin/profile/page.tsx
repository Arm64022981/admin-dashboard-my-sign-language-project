"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { User } from "lucide-react";

const MySwal = withReactContent(Swal);

export default function AdminProfilePage() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    role: "แอดมิน",
  });

  const router = useRouter();

  useEffect(() => {
    const mockData = {
      fullname: "ปรินทร์ คำเทพ",
      email: "admin@hospital.com",
      role: "แอดมิน",
    };
    setFormData(mockData);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullname || !formData.email) {
      MySwal.fire("เกิดข้อผิดพลาด", "กรุณากรอกชื่อและอีเมลให้ครบ", "error");
      return;
    }

    if (!/[^@]+@[^@]+\.[^@]+/.test(formData.email)) {
      MySwal.fire("เกิดข้อผิดพลาด", "รูปแบบอีเมลไม่ถูกต้อง", "error");
      return;
    }

    try {
      console.log("ข้อมูลที่ส่ง:", formData);
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
      MySwal.fire("เกิดข้อผิดพลาด", "ไม่สามารถเข้าสู่ระบบได้", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-r from-white via-white to-blue-900">
      {/* Left Box */}
      <div className="hidden md:flex relative w-1/2 max-w-md h-[500px] rounded-2xl p-12 text-white shadow-xl bg-gradient-to-r from-blue-800 to-blue-900 overflow-hidden">
        <div className="absolute w-96 h-96">
          <div className="absolute rounded-full bg-blue-900 w-64 h-64 -left-16 top-16 opacity-80"></div>
          <div className="absolute rounded-full bg-blue-800 w-48 h-48 -left-4 top-28 opacity-90"></div>
          <div className="absolute rounded-full bg-blue-700 w-36 h-36 left-12 top-40 opacity-100"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-start h-full text-left px-8">
          <h2 className="font-extrabold text-4xl mb-4 tracking-wider">ADMIN ACCESS</h2>
          <p className="text-lg font-semibold">Welcome, Administrator</p>
          <p className="text-sm leading-relaxed max-w-xs mt-2 opacity-80">
            Manage users, reports, and system settings. Please ensure your access is authorized.
          </p>
        </div>
      </div>

      {/* Right Box */}
      <div className="w-full md:w-1/2 max-w-md h-[500px] bg-white rounded-3xl p-10 shadow-xl flex flex-col justify-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center shadow-inner">
            <User className="text-blue-600 w-8 h-8" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">เข้าสู่ระบบแอดมิน</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">
              ชื่อ - นามสกุล
            </label>
            <input
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="กรอกชื่อของคุณ"
              className="block w-full rounded-full border border-gray-300 bg-gray-100 py-3 px-4 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              อีเมล
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              className="block w-full rounded-full border border-gray-300 bg-gray-100 py-3 px-4 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              ตำแหน่ง
            </label>
            <input
              id="role"
              name="role"
              value={formData.role}
              disabled
              className="block w-full rounded-full bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-300 py-3 px-4"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 transition duration-200"
          >
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    </div>
  );
}
