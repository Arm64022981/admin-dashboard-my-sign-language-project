"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

interface FormData {
  fullname: string;
  email: string;
  password: string;
  role: "nurse" | "doctor" | "";
  department: string;
}

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    fullname: "",
    email: "",
    password: "",
    role: "",
    department: "",
  });
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // ล้าง error เมื่อมีการเปลี่ยนแปลงข้อมูล
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !formData.fullname ||
      !formData.email ||
      !formData.password ||
      !formData.role ||
      !formData.department
    ) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const endpoint = "http://127.0.0.1:5000/api/register";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        await MySwal.fire({
          icon: "success",
          title: "ลงทะเบียนสำเร็จ",
          text: "ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว",
          confirmButtonText: "ตกลง",
        });
        router.push("/admin/dashboard");
      } else {
        setError(data.message || "เกิดข้อผิดพลาดในการลงทะเบียน");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-3xl p-10 bg-white rounded-2xl shadow-2xl min-h-[500px] transform transition-all duration-300 hover:shadow-3xl">
        <div className="flex items-center justify-center mb-8">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg mr-3">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800">ลงทะเบียนบุคลากรทางการแพทย์</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl text-sm font-medium transition-opacity duration-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-4 items-center gap-6">
            <Label htmlFor="fullname" className="text-right text-sm font-medium text-gray-700">
              ชื่อ-สกุล
            </Label>
            <Input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="col-span-3 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 hover:border-blue-300 p-3 bg-white text-black"
              required
              aria-label="ชื่อ-สกุล"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-6">
            <Label htmlFor="email" className="text-right text-sm font-medium text-gray-700">
              อีเมล
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="col-span-3 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 hover:border-blue-300 p-3 bg-white text-black"
              required
              aria-label="อีเมล"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-6">
            <Label htmlFor="password" className="text-right text-sm font-medium text-gray-700">
              รหัสผ่าน
            </Label>
            <div className="col-span-3 relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="pr-12 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 hover:border-blue-300 p-3 bg-white text-black"
                required
                aria-label="รหัสผ่าน"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-blue-600 transition-colors duration-200"
                aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-6">
            <Label htmlFor="role" className="text-right text-sm font-medium text-gray-700">
              ตำแหน่ง
            </Label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="col-span-3 w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-gray-900 transition-all duration-200 hover:border-blue-300"
              required
              aria-label="ตำแหน่ง"
            >
              <option value="" disabled>
                เลือกตำแหน่ง
              </option>
              <option value="nurse">พยาบาล</option>
              <option value="doctor">หมอ</option>
            </select>
          </div>

          {formData.role && (
            <div className="grid grid-cols-4 items-center gap-6">
              <Label htmlFor="department" className="text-right text-sm font-medium text-gray-700">
                แผนก
              </Label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="col-span-3 w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-gray-900 transition-all duration-200 hover:border-blue-300"
                required
                aria-label="แผนก"
              >
                <option value="" disabled>
                  เลือกแผนก
                </option>
                {formData.role === "nurse" && (
                  <>
                    <option value="ผู้ป่วยนอก">แผนกผู้ป่วยนอก</option>
                    <option value="ผู้ป่วยใน">แผนกผู้ป่วยใน</option>
                  </>
                )}
                {formData.role === "doctor" && (
                  <>
                    <option value="อายุรกรรม">แผนกอายุรกรรม</option>
                    <option value="กุมารเวช">แผนกกุมารเวช</option>
                  </>
                )}
              </select>
            </div>
          )}

          <Button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all duration-300 hover:shadow-lg"
          >
            ลงทะเบียน
          </Button>
        </form>
      </div>
    </div>
  );
}