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

  // ดึงข้อมูลรายงาน
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
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // กรองรายงานตามคำค้นหา
  const filteredReports = reports.filter(
    (report) =>
      report.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.issue_description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ลบรายงาน
  const handleDelete = async (id: number) => {
    const confirmDelete = await MySwal.fire({
      title: "คุณต้องการลบรายงานนี้หรือไม่?",
      text: "การลบรายงานจะไม่สามารถย้อนกลับได้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
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
        });
      } else {
        const data = await response.json();
        MySwal.fire({
          icon: "error",
          title: "ไม่สามารถลบรายงานได้",
          text: data.message || "เกิดข้อผิดพลาดในการลบรายงาน กรุณาลองใหม่",
        });
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการลบรายงาน:", error);
      MySwal.fire({
        icon: "error",
        title: "ไม่สามารถลบรายงานได้",
        text: "เกิดข้อผิดพลาด กรุณาลองใหม่",
      });
    }
  };

  // ฟังก์ชันสำหรับแปลงวันที่
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

  // แปลบทบาท
  const translateRole = (role: string): string => {
    if (role === "doctor") return "หมอ";
    if (role === "nurse") return "พยาบาล";
    return role;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">รายการรายงานปัญหา</h1>
              <p className="text-gray-600">จัดการรายงานปัญหาจากบุคลากรทางการแพทย์</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">จำนวนรายงานทั้งหมด</p>
                  <p className="text-2xl font-bold text-blue-600">{reports.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">ผลการค้นหา</p>
                  <p className="text-2xl font-bold text-green-600">{filteredReports.length}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Search className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">แผนกทั้งหมด</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {new Set(reports.map((r) => r.department)).size}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Building className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-6">
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อผู้แจ้งหรือรายละเอียดปัญหา..."
              className="pl-10 pr-4 py-2 bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm w-full text-base"
              aria-label="ค้นหา"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-500 to-indigo-600">
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
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map((report, index) => (
                  <tr
                    key={report.id}
                    className={`hover:bg-blue-50 transition-colors duration-150 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                        {report.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm font-medium text-gray-900">{report.fullname}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{translateRole(report.role)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {report.department || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{report.issue_description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatThaiDate(report.created_at)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleDelete(report.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-all duration-200"
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
              <div className="mx-auto h-12 w-12 text-gray-400">
                <Search className="h-12 w-12" />
              </div>
              <h3 className="mt-4 text-sm font-medium text-gray-900">ไม่พบข้อมูล</h3>
              <p className="mt-2 text-sm text-gray-500">
                ไม่พบรายงานที่ตรงกับคำค้นหา "{searchTerm}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}