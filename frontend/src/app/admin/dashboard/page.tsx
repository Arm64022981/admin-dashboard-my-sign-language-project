"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FaUserMd,
  FaUserNurse,
  FaHeartbeat,
  FaTrashAlt,
  FaSearch,
  FaSyncAlt,
} from "react-icons/fa";
import { BiTrendingUp } from "react-icons/bi";
import { HiSparkles } from "react-icons/hi";
import Swal from "sweetalert2";

const API_BASE_URL = "http://localhost:5000/api";
const ENDPOINTS = {
  PATIENTS: `${API_BASE_URL}/patients`,
  DOCTORS_COUNT: `${API_BASE_URL}/doctors/count`,
  NURSES_COUNT: `${API_BASE_URL}/nurses/count`,
} as const;

const SWAL_CONFIG = {
  customClass: {
    popup: "rounded-2xl shadow-2xl",
  },
} as const;

const formatDateToThai = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const showSuccessAlert = (title: string, text: string) => {
  Swal.fire({ title, text, icon: "success", ...SWAL_CONFIG });
};

const showErrorAlert = (title: string, text: string) => {
  Swal.fire({ title, text, icon: "error", ...SWAL_CONFIG });
};

interface Patient {
  id: number;
  name: string;
  admissionDate: string;
  nurseName: string;
  doctorName: string;
}

interface StatsCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  bgColor: string;
  iconBg: string;
  textColor: string;
}

const StatsCard = ({ title, count, icon, bgColor, iconBg, textColor }: StatsCardProps) => (
  <Card className={`${bgColor} shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl p-6 group hover:scale-105 border border-white/20`}>
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl`}>
          {icon}
        </div>
        <div>
          <h2 className="text-sm font-medium text-white/70 mb-1">{title}</h2>
          <p className="text-3xl font-bold text-white">{count}</p>
          <p className={`text-sm ${textColor} font-medium`}>คน</p>
        </div>
      </div>
      <BiTrendingUp className={`${textColor} text-2xl opacity-70`} />
    </div>
  </Card>
);

const SearchBar = ({ searchTerm, onSearchChange }: { searchTerm: string; onSearchChange: (value: string) => void }) => (
  <div className="mb-8">
    <div className="relative max-w-md">
      <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" />
      <Input
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="ค้นหาผู้ป่วย..."
        className="pl-12 pr-4 py-3 w-full border border-white/20 focus:border-white focus:ring-2 focus:ring-white/30 rounded-2xl shadow-sm bg-white/10 text-white placeholder-white/70"
      />
    </div>
  </div>
);

const TableHeader = ({ patientCount }: { patientCount: number }) => (
  <div className="px-6 py-4 border-b border-white/20 bg-white/10 text-white">
    <h2 className="text-xl font-bold">ข้อมูลผู้ป่วยที่ได้รับการดูแล</h2>
    <p className="text-sm text-white/70 mt-1">รายการผู้ป่วยทั้งหมด {patientCount} คน</p>
  </div>
);

const LoadingState = () => (
  <div className="flex items-center justify-center py-16 text-white">
    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    <span className="ml-3">กำลังโหลดข้อมูล...</span>
  </div>
);

const EmptyState = () => (
  <tr>
    <td colSpan={6} className="px-6 py-12 text-center text-white/70">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
          <FaHeartbeat className="text-white/50 text-2xl" />
        </div>
        <p className="text-lg font-medium">ไม่พบข้อมูลผู้ป่วย</p>
        <p className="text-sm text-white/50">ลองค้นหาด้วยคำอื่น หรือตรวจสอบการเชื่อมต่อ</p>
      </div>
    </td>
  </tr>
);

const PatientRow = ({ patient, index, onDelete }: { patient: Patient; index: number; onDelete: (id: number) => void }) => (
  <tr className={`${index % 2 === 0 ? "bg-white/5" : "bg-white/10"} hover:bg-white/20 text-white`}>
    <td className="px-6 py-4 text-sm font-medium">
      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center font-bold text-xs">{patient.id}</div>
    </td>
    <td className="px-6 py-4 text-sm font-medium">{patient.name}</td>
    <td className="px-6 py-4 text-sm">{formatDateToThai(patient.admissionDate)}</td>
    <td className="px-6 py-4 text-sm">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
        <span>{patient.nurseName}</span>
      </div>
    </td>
    <td className="px-6 py-4 text-sm">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
        <span>{patient.doctorName}</span>
      </div>
    </td>
    <td className="px-6 py-4 text-center">
      <button
        onClick={() => onDelete(patient.id)}
        className="inline-flex items-center justify-center w-10 h-10 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-500 rounded-xl hover:scale-110 transition-all"
        title="ลบข้อมูลผู้ป่วย"
      >
        <FaTrashAlt className="text-sm" />
      </button>
    </td>
  </tr>
);

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ patientCount: 0, doctorCount: 0, nurseCount: 0 });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const filteredPatients = useMemo(() => patients.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase())), [patients, searchTerm]);

  const statsCardsData = [
    {
      title: "จำนวนแพทย์",
      count: stats.doctorCount,
      icon: <FaUserMd className="text-2xl text-white" />,
      bgColor: "bg-white/10",
      iconBg: "bg-gradient-to-r from-emerald-500 to-teal-500",
      textColor: "text-white",
    },
    {
      title: "จำนวนพยาบาล",
      count: stats.nurseCount,
      icon: <FaUserNurse className="text-2xl text-white" />,
      bgColor: "bg-white/10",
      iconBg: "bg-gradient-to-r from-violet-500 to-purple-500",
      textColor: "text-white",
    },
    {
      title: "จำนวนผู้ป่วย",
      count: stats.patientCount,
      icon: <FaHeartbeat className="text-2xl text-white" />,
      bgColor: "bg-white/10",
      iconBg: "bg-gradient-to-r from-rose-500 to-pink-500",
      textColor: "text-white",
    },
  ];

  const fetchPatients = async (): Promise<Patient[]> => {
    const res = await fetch(ENDPOINTS.PATIENTS);
    if (!res.ok) throw new Error("Failed to fetch patients");
    return res.json();
  };

  const fetchDoctorCount = async (): Promise<number> => {
    const res = await fetch(ENDPOINTS.DOCTORS_COUNT);
    if (!res.ok) throw new Error("Failed to fetch doctor count");
    const data = await res.json();
    return data.doctorCount;
  };

  const fetchNurseCount = async (): Promise<number> => {
    const res = await fetch(ENDPOINTS.NURSES_COUNT);
    if (!res.ok) throw new Error("Failed to fetch nurse count");
    const data = await res.json();
    return data.nurseCount;
  };

  const deletePatient = async (id: number): Promise<void> => {
    const res = await fetch(`${ENDPOINTS.PATIENTS}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete patient");
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const [patientsData, doctorCount, nurseCount] = await Promise.all([
        fetchPatients(),
        fetchDoctorCount(),
        fetchNurseCount(),
      ]);
      setPatients(patientsData);
      setStats({ patientCount: patientsData.length, doctorCount, nurseCount });
    } catch (error) {
      console.error(error);
      showErrorAlert("เกิดข้อผิดพลาด!", "ไม่สามารถโหลดข้อมูลได้");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePatient = (id: number) => {
    Swal.fire({
      title: "ยืนยันการลบ",
      text: "คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลผู้ป่วยนี้?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
      background: "#fff",
      customClass: {
        popup: "rounded-2xl shadow-2xl",
        confirmButton: "bg-red-500 hover:bg-red-600 rounded-lg px-6 py-2",
        cancelButton: "bg-gray-300 hover:bg-gray-400 rounded-lg px-6 py-2",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deletePatient(id);
          setPatients((prev) => prev.filter((p) => p.id !== id));
          setStats((prev) => ({ ...prev, patientCount: prev.patientCount - 1 }));
          showSuccessAlert("ลบแล้ว!", "ข้อมูลผู้ป่วยถูกลบเรียบร้อยแล้ว");
        } catch (error) {
          console.error(error);
          showErrorAlert("เกิดข้อผิดพลาด!", "ไม่สามารถลบข้อมูลผู้ป่วยได้");
        }
      }
    });
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-800 to-blue-900 text-white">
      <header className="top-0 z-50 bg-white/10 backdrop-blur-sm border-b border-white/20 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <HiSparkles className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-white/70 text-sm">ระบบจัดการข้อมูลโรงพยาบาล</p>
            </div>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white rounded-xl px-6 py-2.5 font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50"
          >
            <FaSyncAlt className={`mr-2 ${loading ? "animate-spin" : ""}`} />
            {loading ? "กำลังโหลด..." : "รีเฟรช"}
          </Button>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statsCardsData.map((card, idx) => (
            <StatsCard key={idx} {...card} />
          ))}
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-lg rounded-2xl overflow-hidden border">
          <TableHeader patientCount={filteredPatients.length} />
          <div className="overflow-x-auto">
            {loading ? (
              <LoadingState />
            ) : (
              <table className="min-w-full table-auto">
                <thead className="bg-white/10 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">ชื่อผู้ป่วย</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">วันที่เข้ารับการรักษา</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">พยาบาลที่ซักประวัติ</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">แพทย์ที่รับการรักษา</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/20">
                  {filteredPatients.length === 0 ? (
                    <EmptyState />
                  ) : (
                    filteredPatients.map((patient, idx) => (
                      <PatientRow key={patient.id} patient={patient} index={idx} onDelete={handleDeletePatient} />
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
