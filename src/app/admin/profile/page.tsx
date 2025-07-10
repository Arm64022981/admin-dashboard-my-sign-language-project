"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MySwal = withReactContent(Swal);

interface AdminFormData {
  fullname: string;
  email: string;
  role: string;
}

const SWAL_CONFIG = {
  customClass: {
    popup: "rounded-2xl shadow-2xl",
  },
} as const;

const AdminInfoCard: React.FC = () => (
  <div className="hidden md:flex w-1/2 max-w-md h-[500px] rounded-2xl p-12 text-white shadow-xl bg-blue-900">
    <div className="flex flex-col justify-center items-start h-full text-left px-8">
      <h2 className="font-extrabold text-4xl mb-4 tracking-wider">ADMIN ACCESS</h2>
      <p className="text-lg font-semibold">Welcome, Administrator</p>
      <p className="text-sm leading-relaxed max-w-xs mt-2 opacity-80">
        Manage users, reports, and system settings. Please ensure your access is authorized.
      </p>
    </div>
  </div>
);

interface AdminFormProps {
  formData: AdminFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const AdminForm: React.FC<AdminFormProps> = ({ formData, onChange, onSubmit }) => (
  <div className="w-full md:w-1/2 max-w-md h-[500px] bg-white rounded-3xl p-10 shadow-xl flex flex-col justify-center">
    <div className="flex justify-center mb-6">
      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center shadow-inner">
        <User className="text-blue-600 w-8 h-8" />
      </div>
    </div>
    <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">เข้าสู่ระบบแอดมิน</h2>
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <Label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">
          ชื่อ - นามสกุล
        </Label>
        <Input
          id="fullname"
          name="fullname"
          value={formData.fullname}
          onChange={onChange}
          placeholder="กรอกชื่อของคุณ"
          className="block w-full rounded-full border border-gray-300 bg-gray-100 py-3 px-4 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
        />
      </div>
      <div>
        <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          อีเมล
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          placeholder="admin@example.com"
          className="block w-full rounded-full border border-gray-300 bg-gray-100 py-3 px-4 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
        />
      </div>
      <div>
        <Label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
          ตำแหน่ง
        </Label>
        <Input
          id="role"
          name="role"
          value={formData.role}
          disabled
          className="block w-full rounded-full bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-300 py-3 px-4"
        />
      </div>
      <Button
        type="submit"
        className="w-full rounded-full bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 transition duration-200"
      >
        เข้าสู่ระบบ
      </Button>
    </form>
  </div>
);

export default function AdminProfilePage() {
  const [formData, setFormData] = useState<AdminFormData>({
    fullname: "",
    email: "",
    role: "แอดมิน",
  });
  const router = useRouter();

  useEffect(() => {
    const mockData: AdminFormData = {
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
      MySwal.fire({
        ...SWAL_CONFIG,
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "กรุณากรอกชื่อและอีเมลให้ครบ",
      });
      return;
    }

    if (!/[^@]+@[^@]+\.[^@]+/.test(formData.email)) {
      MySwal.fire({
        ...SWAL_CONFIG,
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "รูปแบบอีเมลไม่ถูกต้อง",
      });
      return;
    }

    try {
      console.log("ข้อมูลที่ส่ง:", formData);
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
      MySwal.fire({
        ...SWAL_CONFIG,
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถเข้าสู่ระบบได้",
      });
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-white" />
        <div
          className="absolute inset-0 bg-blue-900"
          style={{
            clipPath: "polygon(100% 0, 100% 100%, 40% 100%, 60% 0)",
          }}
        />
      </div>
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <AdminInfoCard />
        <AdminForm formData={formData} onChange={handleChange} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}