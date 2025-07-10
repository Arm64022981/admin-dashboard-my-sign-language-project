"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FaUserNurse, FaUserMd, FaTrashAlt, FaSearch, FaSyncAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import Dialog, { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";

interface Doctor {
  doctor_id: number;
  fullname: string;
  email: string;
  contact_number: string;
  department: string;
  department_id: number;
}

const API_BASE_URL = "http://localhost:5000/api";

const SWAL_CONFIG = {
  customClass: {
    popup: "rounded-2xl shadow-2xl",
  },
} as const;

interface StatsCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  bgColor: string;
  iconBg: string;
  textColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, count, icon, bgColor, iconBg, textColor }) => (
  <Card className={`${bgColor} shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl p-6 group hover:scale-105 border border-white/20`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
          {icon}
        </div>
        <div>
          <h2 className="text-sm font-medium text-white/70 mb-1">{title}</h2>
          <p className="text-3xl font-bold text-white">{count}</p>
          <p className={`text-sm ${textColor} font-medium`}>คน</p>
        </div>
      </div>
    </div>
  </Card>
);

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => (
  <div className="mb-8">
    <div className="relative max-w-md">
      <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" />
      <Input
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="ค้นหาหมอ..."
        className="pl-12 pr-4 py-3 w-full border border-white/20 focus:border-white focus:ring-2 focus:ring-white/30 rounded-2xl shadow-sm transition-all duration-200 bg-white/10 text-white placeholder-white/70"
      />
    </div>
  </div>
);

const LoadingState: React.FC = () => (
  <div className="flex items-center justify-center py-16 text-white">
    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    <span className="ml-3">กำลังโหลดข้อมูล...</span>
  </div>
);

const EmptyState: React.FC = () => (
  <tr>
    <td colSpan={6} className="px-6 py-12 text-center text-white/70">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
          <FaUserMd className="text-white/50 text-2xl" />
        </div>
        <p className="text-lg font-medium">ไม่พบข้อมูลหมอ</p>
        <p className="text-sm text-white/50">ลองค้นหาด้วยคำอื่น หรือตรวจสอบการเชื่อมต่อ</p>
      </div>
    </td>
  </tr>
);

interface DoctorTableProps {
  doctors: Doctor[];
  onEdit: (doctor: Doctor) => void;
  onDelete: (doctorId: number) => void;
}

const DoctorTable: React.FC<DoctorTableProps> = ({ doctors, onEdit, onDelete }) => (
  <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-lg rounded-2xl overflow-hidden border">
    <div className="px-6 py-4 border-b border-white/20 bg-white/10 text-white">
      <h2 className="text-xl font-bold">ข้อมูลแพทย์</h2>
      <p className="text-sm text-white/70 mt-1">รายการแพทย์ทั้งหมด {doctors.length} คน</p>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead className="bg-white/10 text-white">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold">รหัสหมอ</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">ชื่อ</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">อีเมล</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">เบอร์โทร</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">แผนก</th>
            <th className="px-6 py-4 text-center text-sm font-semibold">จัดการ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/20">
          {doctors.length === 0 ? (
            <EmptyState />
          ) : (
            doctors.map((doctor, index) => (
              <tr
                key={doctor.doctor_id}
                className={`${index % 2 === 0 ? "bg-white/5" : "bg-white/10"} hover:bg-white/20 text-white transition-colors duration-200 group`}
              >
                <td className="px-6 py-4 text-sm font-medium">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center font-bold text-xs">
                    {doctor.doctor_id}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium">{doctor.fullname}</td>
                <td className="px-6 py-4 text-sm">{doctor.email}</td>
                <td className="px-6 py-4 text-sm">{doctor.contact_number}</td>
                <td className="px-6 py-4 text-sm">{doctor.department || "-"}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => onEdit(doctor)}
                      className="p-2 text-blue-200 hover:text-white hover:bg-blue-600 rounded-lg transition-all duration-200"
                      title="แก้ไข"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(doctor.doctor_id)}
                      className="p-2 text-red-400 hover:text-red-500 hover:bg-red-700 rounded-lg transition-all duration-200"
                      title="ลบ"
                    >
                      <FaTrashAlt size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </Card>
);

interface EditDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
  onSave: () => void;
  onChange: (doctor: Doctor) => void;
}

const EditDoctorModal: React.FC<EditDoctorModalProps> = ({ isOpen, onClose, doctor, onSave, onChange }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <div className="sm:max-w-[550px] bg-blue-900 rounded-2xl shadow-2xl text-white p-8 border border-indigo-500/30 mx-auto">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center space-x-3 font-bold text-2xl">
              <Pencil className="text-white w-6 h-6" />
              <span>แก้ไขข้อมูลหมอ</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        {doctor && (
          <div className="mt-6">
            <div className="space-y-6 bg-indigo-900/30 p-6 rounded-xl border border-indigo-500/30">
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="doctor_id" className="sm:text-right text-sm font-semibold text-white">
                  รหัสหมอ
                </Label>
                <Input
                  id="doctor_id"
                  value={doctor.doctor_id}
                  disabled
                  className="sm:col-span-3 bg-indigo-600/30 border-indigo-500/30 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-white/50"
                  placeholder="รหัสหมอ"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="fullname" className="sm:text-right text-sm font-semibold text-white">
                  ชื่อ
                </Label>
                <Input
                  id="fullname"
                  value={doctor.fullname}
                  onChange={(e) => onChange({ ...doctor, fullname: e.target.value })}
                  className="sm:col-span-3 bg-indigo-600/30 border-indigo-500/30 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-white/50"
                  placeholder="กรอกชื่อ-นามสกุล"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="sm:text-right text-sm font-semibold text-white">
                  อีเมล
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={doctor.email}
                  onChange={(e) => onChange({ ...doctor, email: e.target.value })}
                  className="sm:col-span-3 bg-indigo-600/30 border-indigo-500/30 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-white/50"
                  placeholder="กรอกอีเมล"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="contact_number" className="sm:text-right text-sm font-semibold text-white">
                  เบอร์โทร
                </Label>
                <Input
                  id="contact_number"
                  type="tel"
                  value={doctor.contact_number}
                  onChange={(e) => onChange({ ...doctor, contact_number: e.target.value })}
                  className="sm:col-span-3 bg-indigo-600/30 border-indigo-500/30 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-white/50"
                  placeholder="กรอกเบอร์โทร (10 หลัก)"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="sm:text-right text-sm font-semibold text-white">
                  แผนก
                </Label>
                <Input
                  id="department"
                  value={doctor.department}
                  onChange={(e) => onChange({ ...doctor, department: e.target.value })}
                  className="sm:col-span-3 bg-indigo-600/30 border-indigo-500/30 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-white/50"
                  placeholder="กรอกชื่อแผนก"
                />
              </div>
            </div>
            <div className="mt-8 flex justify-end space-x-4">
              <Button
                onClick={onClose}
                className="bg-gray-700/50 text-white hover:bg-gray-600/50 border border-indigo-500/30 rounded-lg px-6 py-2.5 shadow-sm transition-all duration-200"
              >
                ยกเลิก
              </Button>
              <Button
                onClick={onSave}
                className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg px-6 py-2.5 shadow-sm transition-all duration-200"
              >
                บันทึก
              </Button>
            </div>
          </div>
        )}
      </div>
    </DialogContent>
  </Dialog>
);

export default function DoctorListPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statsCardsData = [
    {
      title: "จำนวนหมอ",
      count: doctors.length,
      icon: <FaUserNurse className="text-2xl text-white" />,
      bgColor: "bg-white/10",
      iconBg: "bg-gradient-to-r from-violet-500 to-purple-600",
      textColor: "text-white",
    },
  ];

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/doctors`);
      if (!res.ok) throw new Error("Failed to fetch doctors");
      const data = await res.json();
      setDoctors(data);
    } catch (error) {
      console.error(error);
      Swal.fire({
        ...SWAL_CONFIG,
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถโหลดข้อมูลหมอได้",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isValidEmail = (email: string) => /[^@]+@[^@]+\.[^@]+/.test(email);
  const isValidPhone = (phone: string) => /^[0-9]{10}$/.test(phone);

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingDoctor) return;

    if (
      !editingDoctor.fullname.trim() ||
      !editingDoctor.email.trim() ||
      !editingDoctor.contact_number.trim() ||
      !editingDoctor.department.trim()
    ) {
      return Swal.fire({
        ...SWAL_CONFIG,
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
      });
    }

    if (!isValidEmail(editingDoctor.email.trim())) {
      return Swal.fire({
        ...SWAL_CONFIG,
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "รูปแบบอีเมลไม่ถูกต้อง",
      });
    }

    if (!isValidPhone(editingDoctor.contact_number.trim())) {
      return Swal.fire({
        ...SWAL_CONFIG,
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "เบอร์โทรต้องเป็นตัวเลข 10 หลัก",
      });
    }

    try {
      const res = await fetch(`${API_BASE_URL}/doctors/${editingDoctor.doctor_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: editingDoctor.fullname.trim(),
          email: editingDoctor.email.trim(),
          contact_number: editingDoctor.contact_number.trim(),
          department: editingDoctor.department.trim(),
          department_id: editingDoctor.department_id,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "ไม่สามารถบันทึกข้อมูลได้");
      }

      setDoctors((prev) =>
        prev.map((doc) => (doc.doctor_id === editingDoctor.doctor_id ? { ...editingDoctor } : doc))
      );
      setIsModalOpen(false);
      Swal.fire({
        ...SWAL_CONFIG,
        icon: "success",
        title: "สำเร็จ",
        text: "บันทึกการแก้ไขเรียบร้อยแล้ว",
      });
    } catch (error: any) {
      Swal.fire({
        ...SWAL_CONFIG,
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.message || "ไม่สามารถบันทึกข้อมูลได้",
      });
    }
  };

  const handleDelete = async (doctorId: number) => {
    const result = await Swal.fire({
      ...SWAL_CONFIG,
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการลบข้อมูลหมอนี้ใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${API_BASE_URL}/doctors/${doctorId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "ไม่สามารถลบข้อมูลได้");
      }

      setDoctors((prev) => prev.filter((d) => d.doctor_id !== doctorId));
      Swal.fire({
        ...SWAL_CONFIG,
        icon: "success",
        title: "ลบสำเร็จ",
        text: "ข้อมูลหมอถูกลบแล้ว",
      });
    } catch (error: any) {
      Swal.fire({
        ...SWAL_CONFIG,
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.message || "ไม่สามารถลบข้อมูลได้",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-800 to-blue-900 text-white">
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FaUserMd className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">รายชื่อหมอ</h1>
              <p className="text-white/70 text-sm">จัดการข้อมูลแพทย์ในระบบ</p>
            </div>
          </div>
          <Button
            onClick={fetchDoctors}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white rounded-xl px-6 py-2.5 font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
          >
            <FaSyncAlt className={`mr-2 ${loading ? "animate-spin" : ""}`} />
            {loading ? "กำลังโหลด..." : "รีเฟรช"}
          </Button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCardsData.map((card, index) => (
            <StatsCard
              key={index}
              title={card.title}
              count={card.count}
              icon={card.icon}
              bgColor={card.bgColor}
              iconBg={card.iconBg}
              textColor={card.textColor}
            />
          ))}
        </div>
        {loading ? (
          <LoadingState />
        ) : (
          <DoctorTable
            doctors={filteredDoctors}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
      <EditDoctorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctor={editingDoctor}
        onSave={handleSaveEdit}
        onChange={setEditingDoctor}
      />
    </div>
  );
}