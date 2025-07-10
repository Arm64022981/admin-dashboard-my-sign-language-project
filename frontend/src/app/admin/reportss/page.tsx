"use client";

import { useEffect, useState } from "react";
import { Trash2, Search, FileText, Users, Building } from "lucide-react";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

interface ReportEntry {
  id: number;
  fullname: string;
  role: string;
  department: string;
  issue_description: string;
  created_at: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/reports");
        if (!response.ok) {
          throw new Error("Failed to fetch reports");
        }
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
        MySwal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถดึงข้อมูลรายงานได้ กรุณาลองใหม่",
          customClass: {
            popup: "rounded-2xl shadow-2xl",
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const filteredReports = reports.filter(
    (report) =>
      report.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.issue_description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    const confirmDelete = await MySwal.fire({
      title: "คุณต้องการลบรายงานนี้หรือไม่?",
      text: "การลบรายงานจะไม่สามารถย้อนกลับได้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
      customClass: {
        popup: "rounded-2xl shadow-2xl",
        confirmButton: "bg-red-500 hover:bg-red-600 rounded-lg px-6 py-2",
        cancelButton: "bg-gray-300 hover:bg-gray-400 rounded-lg px-6 py-2",
      },
    });

    if (!confirmDelete.isConfirmed) return;

    try {
      const response = await fetch(`http://localhost:5000/api/reports/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setReports(reports.filter((report) => report.id !== id));
        MySwal.fire({
          icon: "success",
          title: "ลบรายงานสำเร็จ",
          text: "รายงานของคุณถูกลบเรียบร้อยแล้ว",
          customClass: {
            popup: "rounded-2xl shadow-2xl",
          },
        });
      } else {
        const data = await response.json();
        MySwal.fire({
          icon: "error",
          title: "ไม่สามารถลบรายงานได้",
          text: data.message || "เกิดข้อผิดพลาดในการลบรายงาน กรุณาลองใหม่",
          customClass: {
            popup: "rounded-2xl shadow-2xl",
          },
        });
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการลบรายงาน:", error);
      MySwal.fire({
        icon: "error",
        title: "failed",
        text: "เกิดข้อผิดพลาด กรุณาลองใหม่",
        customClass: {
          popup: "rounded-2xl shadow-2xl",
        },
      });
    }
  };

  const formatThaiDate = (dateString: string): string => {
    const date = new Date(dateString);
    const thMonths = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];
    const day = date.getDate();
    const month = thMonths[date.getMonth()];
    const year = date.getFullYear() + 543;
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day} ${month} ${year} ${hours}:${minutes}`;
  };

  const translateRole = (role: string): string => {
    if (role === "doctor") return "หมอ";
    if (role === "nurse") return "พยาบาล";
    return role;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-800 to-blue-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white/70">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-800 to-blue-900">
      <div className="container mx-auto px-6 py-8">
        <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 mb-8">
          <div className="flex items-center space-x-4 py-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">รายการรายงานปัญหา</h1>
              <p className="text-white/70">จัดการรายงานปัญหาจากบุคลากรทางการแพทย์</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 rounded-xl shadow-md p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">จำนวนรายงานทั้งหมด</p>
                <p className="text-2xl font-bold text-white">{reports.length}</p>
              </div>
              <div className="p-3 bg-white/10 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl shadow-md p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">ผลการค้นหา</p>
                <p className="text-2xl font-bold text-white">{filteredReports.length}</p>
              </div>
              <div className="p-3 bg-white/10 rounded-lg">
                <Search className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl shadow-md p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/70">แผนกทั้งหมด</p>
                <p className="text-2xl font-bold text-white">
                  {new Set(reports.map((r) => r.department)).size}
                </p>
              </div>
              <div className="p-3 bg-white/10 rounded-lg">
                <Building className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อผู้แจ้งหรือรายละเอียดปัญหา..."
              className="pl-10 pr-4 py-2 bg-white/10 border-white/20 focus:ring-2 focus:ring-white/30 focus:border-transparent shadow-sm w-full text-white placeholder-white/70"
              aria-label="ค้นหา"
            />
          </div>
        </div>

        <div className="bg-white/10 rounded-xl shadow-lg border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/20">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">#</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">ชื่อผู้แจ้ง</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">บทบาท</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">แผนก</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">รายละเอียดปัญหา</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">เวลาแจ้ง</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-white">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {filteredReports.map((report, index) => (
                  <tr
                    key={report.id}
                    className={`hover:bg-white/20 transition-colors duration-150 ${index % 2 === 0 ? "bg-white/5" : "bg-white/10"
                      }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                        {report.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-white/60 mr-3" />
                        <span className="text-sm font-medium text-white">{report.fullname}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-white/70">{translateRole(report.role)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 text-white/60 mr-2" />
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-white/10 text-white rounded-full">
                          {report.department || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white">{report.issue_description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">{formatThaiDate(report.created_at)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleDelete(report.id)}
                        className="p-2 text-red-400 hover:text-red-500 hover:bg-red-700 rounded-lg transition-all duration-200"
                        title="ลบรายงาน"
                        aria-label="ลบรายงาน"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-white/60">
                <Search className="h-12 w-12" />
              </div>
              <h3 className="mt-4 text-sm font-medium text-white">ไม่พบข้อมูล</h3>
              <p className="mt-2 text-sm text-white/70">
                ไม่พบรายงานที่ตรงกับคำค้นหา "{searchTerm}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}