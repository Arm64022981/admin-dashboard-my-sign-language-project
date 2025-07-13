"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FaUserNurse, FaTrashAlt, FaSearch, FaSyncAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import Dialog, { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";

interface Nurse {
  nurses_id: number;
  fullname: string;
  email: string;
  contact_number: string;
  department: string;
}

interface StatsCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  bgColor: string;
  iconBg: string;
  textColor: string;
}

const API_BASE_URL = "https://admin-dashboard-my-sign-language-project-yhn3.onrender.com/api";

const ENDPOINTS = {
  NURSES: `${API_BASE_URL}/nurses`,
  NURSES_COUNT: `${API_BASE_URL}/nurses/count`,
} as const;

const SWAL_CONFIG = {
  customClass: {
    popup: "rounded-2xl shadow-2xl",
  },
} as const;

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
        placeholder="ค้นหาพยาบาล..."
        className="pl-12 pr-4 py-3 w-full border border-white/20 focus:border-white focus:ring-2 focus:ring-white/30 rounded-2xl shadow-sm transition-all duration-200 bg-white/10 text-white placeholder-white/70"
      />
    </div>
  </div>
);

interface TableHeaderProps {
  nurseCount: number;
}

const TableHeader: React.FC<TableHeaderProps> = ({ nurseCount }) => (
  <div className="px-6 py-4 border-b border-white/20 bg-white/10 text-white">
    <h2 className="text-xl font-bold">ข้อมูลพยาบาลที่ลงทะเบียน</h2>
    <p className="text-sm text-white/70 mt-1">จำนวนพยาบาลทั้งหมด {nurseCount} คน</p>
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
          <FaUserNurse className="text-white/50 text-2xl" />
        </div>
        <p className="text-lg font-medium">ไม่พบข้อมูลพยาบาล</p>
        <p className="text-sm text-white/50">ลองค้นหาด้วยคำอื่น หรือตรวจสอบการเชื่อมต่อ</p>
      </div>
    </td>
  </tr>
);

interface NurseTableProps {
  nurses: Nurse[];
  onEdit: (nurse: Nurse) => void;
  onDelete: (id: number) => void;
}

const NurseTable: React.FC<NurseTableProps> = ({ nurses, onEdit, onDelete }) => (
  <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-lg rounded-2xl overflow-hidden border">
    <TableHeader nurseCount={nurses.length} />
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead className="bg-white/10 text-white">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold">รหัสพยาบาล</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">ชื่อ-สกุล</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">อีเมล</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">เบอร์โทร</th>
            <th className="px-6 py-4 text-left text-sm font-semibold">แผนก</th>
            <th className="px-6 py-4 text-center text-sm font-semibold">จัดการ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/20">
          {nurses.length === 0 ? (
            <EmptyState />
          ) : (
            nurses.map((nurse, index) => (
              <tr
                key={nurse.nurses_id}
                className={`${index % 2 === 0 ? "bg-white/5" : "bg-white/10"} hover:bg-white/20 text-white transition-colors duration-200 group`}
              >
                <td className="px-6 py-4 text-sm font-medium">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center font-bold text-xs">
                    {nurse.nurses_id}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium">{nurse.fullname}</td>
                <td className="px-6 py-4 text-sm">{nurse.email}</td>
                <td className="px-6 py-4 text-sm">{nurse.contact_number}</td>
                <td className="px-6 py-4 text-sm">{nurse.department}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => onEdit(nurse)}
                      className="p-2 text-blue-200 hover:text-white hover:bg-blue-600 rounded-lg transition-all duration-200"
                      title="แก้ไขข้อมูลพยาบาล"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(nurse.nurses_id)}
                      className="p-2 text-red-400 hover:text-red-500 hover:bg-red-700 rounded-lg transition-all duration-200"
                      title="ลบข้อมูลพยาบาล"
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

interface FloatingRefreshButtonProps {
  onRefresh: () => void;
  loading: boolean;
}

const FloatingRefreshButton: React.FC<FloatingRefreshButtonProps> = ({ onRefresh, loading }) => (
  <div className="fixed bottom-8 right-8">
    <Button
      onClick={onRefresh}
      disabled={loading}
      className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50"
    >
      <FaSyncAlt className={`text-xl ${loading ? "animate-spin" : ""}`} />
    </Button>
  </div>
);

interface EditNurseModalProps {
  isOpen: boolean;
  onClose: () => void;
  nurse: Nurse | null;
  onSave: () => void;
  onChange: (nurse: Nurse) => void;
}

const EditNurseModal: React.FC<EditNurseModalProps> = ({ isOpen, onClose, nurse, onSave, onChange }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <div className="sm:max-w-[550px] bg-blue-900 rounded-2xl shadow-2xl text-white p-8 border border-indigo-500/30 mx-auto">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center space-x-3 font-bold text-2xl">
              <Pencil className="text-white w-6 h-6" />
              <span>แก้ไขข้อมูลพยาบาล</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        {nurse && (
          <div className="mt-6">
            <div className="space-y-6 bg-indigo-900/30 p-6 rounded-xl border border-indigo-500/30">
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="nurses_id" className="sm:text-right text-sm font-semibold text-white">
                  รหัสพยาบาล
                </Label>
                <Input
                  id="nurses_id"
                  value={nurse.nurses_id}
                  disabled
                  className="sm:col-span-3 bg-indigo-600/30 border-indigo-500/30 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent placeholder-white/50"
                  placeholder="รหัสพยาบาล"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="fullname" className="sm:text-right text-sm font-semibold text-white">
                  ชื่อ-สกุล
                </Label>
                <Input
                  id="fullname"
                  value={nurse.fullname}
                  onChange={(e) => onChange({ ...nurse, fullname: e.target.value })}
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
                  value={nurse.email}
                  onChange={(e) => onChange({ ...nurse, email: e.target.value })}
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
                  value={nurse.contact_number}
                  onChange={(e) => onChange({ ...nurse, contact_number: e.target.value })}
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
                  value={nurse.department}
                  onChange={(e) => onChange({ ...nurse, department: e.target.value })}
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

export default function NurseDashboardPage() {
  const [stats, setStats] = useState({ nurseCount: 0 });
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingNurse, setEditingNurse] = useState<Nurse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredNurses = nurses.filter((nurse) =>
    nurse.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statsCardsData = [
    {
      title: "จำนวนพยาบาล",
      count: stats.nurseCount,
      icon: <FaUserNurse className="text-2xl text-white" />,
      bgColor: "bg-white/10",
      iconBg: "bg-gradient-to-r from-blue-600 to-purple-600",
      textColor: "text-white",
    },
  ];

  const fetchNurses = async (): Promise<Nurse[]> => {
    const response = await fetch(ENDPOINTS.NURSES);
    if (!response.ok) throw new Error("Failed to fetch nurses");
    return response.json();
  };

  const fetchNurseCount = async (): Promise<number> => {
    const response = await fetch(ENDPOINTS.NURSES_COUNT);
    if (!response.ok) throw new Error("Failed to fetch nurse count");
    const data = await response.json();
    return data.nurseCount;
  };

  const deleteNurse = async (id: number): Promise<void> => {
    const response = await fetch(`${ENDPOINTS.NURSES}/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete nurse");
    }
  };

  const updateNurse = async (nurse: Nurse): Promise<void> => {
    const response = await fetch(`${ENDPOINTS.NURSES}/${nurse.nurses_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullname: nurse.fullname.trim(),
        email: nurse.email.trim(),
        contact_number: nurse.contact_number.trim(),
        department: nurse.department.trim(),
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update nurse");
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const [nursesData, nurseCount] = await Promise.all([fetchNurses(), fetchNurseCount()]);
      setNurses(nursesData);
      setStats({ nurseCount });
    } catch (error) {
      console.error("Error refreshing data:", error);
      Swal.fire({
        ...SWAL_CONFIG,
        icon: "error",
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถโหลดข้อมูลพยาบาลได้",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (nurse: Nurse) => {
    setEditingNurse(nurse);
    setIsModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingNurse) return;

    if (
      !editingNurse.fullname.trim() ||
      !editingNurse.email.trim() ||
      !editingNurse.contact_number.trim() ||
      !editingNurse.department.trim()
    ) {
      return Swal.fire({
        ...SWAL_CONFIG,
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
      });
    }

    const isValidEmail = (email: string) => /[^@]+@[^@]+\.[^@]+/.test(email);
    const isValidPhone = (phone: string) => /^[0-9]{10}$/.test(phone);

    if (!isValidEmail(editingNurse.email.trim())) {
      return Swal.fire({
        ...SWAL_CONFIG,
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "รูปแบบอีเมลไม่ถูกต้อง",
      });
    }

    if (!isValidPhone(editingNurse.contact_number.trim())) {
      return Swal.fire({
        ...SWAL_CONFIG,
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "เบอร์โทรต้องเป็นตัวเลข 10 หลัก",
      });
    }

    try {
      await updateNurse(editingNurse);
      setNurses((prev) =>
        prev.map((n) => (n.nurses_id === editingNurse.nurses_id ? { ...editingNurse } : n))
      );
      setIsModalOpen(false);
      Swal.fire({
        ...SWAL_CONFIG,
        icon: "success",
        title: "สำเร็จ",
        text: "บันทึกการแก้ไขพยาบาลเรียบร้อยแล้ว",
      });
    } catch (error) {
      console.error("Error updating nurse:", error);
      Swal.fire({
        ...SWAL_CONFIG,
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถบันทึกข้อมูลพยาบาลได้",
      });
    }
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      ...SWAL_CONFIG,
      title: "ยืนยันการลบ",
      text: "คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลพยาบาลนี้?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
      background: "#fff",
      customClass: {
        confirmButton: "bg-red-500 hover:bg-red-600 rounded-lg px-6 py-2",
        cancelButton: "bg-gray-300 hover:bg-gray-400 rounded-lg px-6 py-2",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteNurse(id);
          setNurses((prev) => prev.filter((n) => n.nurses_id !== id));
          setStats((prev) => ({ ...prev, nurseCount: prev.nurseCount - 1 }));
          Swal.fire({
            ...SWAL_CONFIG,
            icon: "success",
            title: "ลบแล้ว!",
            text: "ข้อมูลพยาบาลถูกลบเรียบร้อยแล้ว",
          });
        } catch (error) {
          console.error("Error deleting nurse:", error);
          Swal.fire({
            ...SWAL_CONFIG,
            icon: "error",
            title: "เกิดข้อผิดพลาด!",
            text: "ไม่สามารถลบข้อมูลพยาบาลได้",
          });
        }
      }
    });
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-800 to-blue-900 text-white">
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <FaUserNurse className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">ข้อมูลพยาบาล</h1>
                <p className="text-white/70 text-sm">ระบบจัดการข้อมูลพยาบาล</p>
              </div>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl px-6 py-2.5 font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 text-white"
            >
              <FaSyncAlt className={`mr-2 ${loading ? "animate-spin" : ""}`} />
              {loading ? "กำลังโหลด..." : "รีเฟรช"}
            </Button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCardsData.map((card, index) => (
            <StatsCard key={index} {...card} />
          ))}
        </div>
        {loading ? (
          <LoadingState />
        ) : (
          <NurseTable
            nurses={filteredNurses}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}