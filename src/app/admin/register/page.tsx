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
    setError("");
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
          customClass: {
            popup: "rounded-2xl shadow-2xl",
          },
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-800 to-blue-900">
      <div className="w-full max-w-2xl p-10 bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl min-h-[500px] border border-white/20">
        <div className="flex items-center justify-center mb-8">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg mr-3">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">ลงทะเบียนบุคลากรทางการแพทย์</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl text-sm font-medium border border-red-500/30">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: "ชื่อ-สกุล", name: "fullname", type: "text", value: formData.fullname },
            { label: "อีเมล", name: "email", type: "email", value: formData.email },
          ].map((field) => (
            <div key={field.name} className="flex items-center gap-1"> 
              <Label htmlFor={field.name} className="w-28 text-sm font-medium text-white">
                {field.label}
              </Label>
              <Input
                type={field.type}
                id={field.name}
                name={field.name}
                value={field.value}
                onChange={handleChange}
                className="flex-1 p-3 bg-white/10 border border-white/20 text-white placeholder-white/70"
                required
              />
            </div>
          ))}

          <div className="flex items-center gap-1">
            <Label htmlFor="password" className="w-28 text-sm font-medium text-white">
              รหัสผ่าน
            </Label>
            <div className="relative flex-1">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 bg-white/10 border border-white/20 text-white placeholder-white/70"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-white/60 hover:text-white"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Label htmlFor="role" className="w-28 text-sm font-medium text-white">
              ตำแหน่ง
            </Label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="flex-1 p-3 bg-white/10 border border-white/20 text-white"
              required
            >
              <option value="" disabled>เลือกตำแหน่ง</option>
              <option value="nurse">พยาบาล</option>
              <option value="doctor">หมอ</option>
            </select>
          </div>

          {formData.role && (
            <div className="flex items-center gap-1">
              <Label htmlFor="department" className="w-28 text-sm font-medium text-white">
                แผนก
              </Label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="flex-1 p-3 bg-white/10 border border-white/20 text-white"
                required
              >
                <option value="" disabled>เลือกแผนก</option>
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
            className="w-full py-3 bg-gray-400 hover:bg-gray-600 text-white font-semibold rounded-xl shadow-md transition-all duration-300"
          >
            ลงทะเบียน
          </Button>
        </form>
      </div>
    </div>
  );
}
