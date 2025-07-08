"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Dialog, {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Search, UserCheck, Mail, Phone, Building, Users } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

interface Nurse {
  nurses_id: number;
  user_id: number;
  department_id: number;
  fullname: string;
  gender: string;
  birthdate: string;
  contact_number: string;
  email: string;
  password: string;
  department: string;
  role: string;
}

export default function NurseListPage() {
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingNurse, setEditingNurse] = useState<Nurse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNurses() {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/nurses");
        if (!res.ok) {
          throw new Error("Failed to fetch nurses");
        }
        const data = await res.json();
        setNurses(data);
      } catch (error) {
        console.error("Error fetching nurses:", error);
        MySwal.fire("เกิดข้อผิดพลาด", "ไม่สามารถดึงข้อมูลพยาบาลได้", "error");
      } finally {
        setLoading(false);
      }
    }

    fetchNurses();
  }, []);

  const filteredNurses = nurses.filter((nurse) =>
    nurse.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (nurse: Nurse) => {
    setEditingNurse(nurse);
    setIsModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingNurse) return;

    if (
      !editingNurse.fullname ||
      !editingNurse.email ||
      !editingNurse.contact_number ||
      !editingNurse.department
    ) {
      MySwal.fire("เกิดข้อผิดพลาด", "กรุณากรอกข้อมูลให้ครบทุกช่อง", "error");
      return;
    }
    if (!/[^@]+@[^@]+\.[^@]+/.test(editingNurse.email)) {
      MySwal.fire("เกิดข้อผิดพลาด", "รูปแบบอีเมลไม่ถูกต้อง", "error");
      return;
    }
    if (!/^[0-9]{10}$/.test(editingNurse.contact_number)) {
      MySwal.fire("เกิดข้อผิดพลาด", "เบอร์โทรต้องเป็นตัวเลข 10 หลัก", "error");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/nurses/${editingNurse.nurses_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            department_id: editingNurse.department_id,
            fullname: editingNurse.fullname.trim(),
            contact_number: editingNurse.contact_number,
            email: editingNurse.email.trim(),
            department: editingNurse.department.trim(),
          }),
        }
      );

      if (res.ok) {
        setNurses(
          nurses.map((n) =>
            n.nurses_id === editingNurse.nurses_id ? { ...n, ...editingNurse } : n
          )
        );
        setIsModalOpen(false);
        MySwal.fire("สำเร็จ", "บันทึกการแก้ไขเรียบร้อยแล้ว", "success");
      } else {
        const data = await res.json();
        MySwal.fire(
          "เกิดข้อผิดพลาด",
          data.error || "ไม่สามารถบันทึกข้อมูลได้",
          "error"
        );
      }
    } catch (error) {
      console.error("Error updating nurse:", error);
      MySwal.fire("เกิดข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้", "error");
    }
  };

  const handleDelete = async (nurseId: number) => {
    const result = await MySwal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการลบข้อมูลพยาบาลนี้ใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/api/nurses/${nurseId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setNurses(nurses.filter((n) => n.nurses_id !== nurseId));
        MySwal.fire("ลบสำเร็จ", "ข้อมูลพยาบาลถูกลบแล้ว", "success");
      } else {
        const data = await res.json();
        MySwal.fire(
          "เกิดข้อผิดพลาด",
          data.error || "ไม่สามารถลบข้อมูลได้",
          "error"
        );
      }
    } catch (error) {
      console.error("Error deleting nurse:", error);
      MySwal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบข้อมูลได้", "error");
    }
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
              <UserCheck className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">รายชื่อพยาบาล</h1>
              <p className="text-gray-600">จัดการข้อมูลพยาบาลในระบบ</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">จำนวนพยาบาลทั้งหมด</p>
                  <p className="text-2xl font-bold text-blue-600">{nurses.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">ผลการค้นหา</p>
                  <p className="text-2xl font-bold text-green-600">{filteredNurses.length}</p>
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
                    {new Set(nurses.map(n => n.department)).size}
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
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อพยาบาล..."
              className="pl-10 bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-500 to-indigo-600">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">รหัสพยาบาล</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">ชื่อ</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">อีเมล</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">เบอร์โทร</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">แผนก</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-white">จัดการ</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNurses.map((nurse, index) => (
                  <tr
                    key={nurse.nurses_id}
                    className={`hover:bg-blue-50 transition-colors duration-150 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                          {nurse.nurses_id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserCheck className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm font-medium text-gray-900">{nurse.fullname}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">{nurse.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">{nurse.contact_number}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {nurse.department || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleEdit(nurse)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all duration-200"
                          title="แก้ไข"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(nurse.nurses_id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-all duration-200"
                          title="ลบ"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredNurses.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <Search className="h-12 w-12" />
              </div>
              <h3 className="mt-4 text-sm font-medium text-gray-900">ไม่พบข้อมูล</h3>
              <p className="mt-2 text-sm text-gray-500">
                ไม่พบพยาบาลที่ตรงกับคำค้นหา "{searchTerm}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <div className="sm:max-w-[500px] bg-white rounded-xl shadow-2xl">
            <DialogHeader>
              <DialogTitle>
                <div className="text-xl font-bold text-gray-800 flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <Pencil className="h-5 w-5 text-blue-600" />
                  </div>
                  แก้ไขข้อมูลพยาบาล
                </div>
              </DialogTitle>
            </DialogHeader>

            {editingNurse && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nurses_id" className="text-right text-sm font-medium text-gray-700">
                      รหัสพยาบาล
                    </Label>
                    <Input
                      id="nurses_id"
                      value={editingNurse.nurses_id}
                      disabled
                      className="col-span-3 bg-gray-50 border-gray-200"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="fullname" className="text-right text-sm font-medium text-gray-700">
                      ชื่อ
                    </Label>
                    <Input
                      id="fullname"
                      value={editingNurse.fullname}
                      onChange={(e) =>
                        setEditingNurse({
                          ...editingNurse,
                          fullname: e.target.value,
                        })
                      }
                      className="col-span-3 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right text-sm font-medium text-gray-700">
                      อีเมล
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={editingNurse.email}
                      onChange={(e) =>
                        setEditingNurse({
                          ...editingNurse,
                          email: e.target.value,
                        })
                      }
                      className="col-span-3 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="contact_number" className="text-right text-sm font-medium text-gray-700">
                      เบอร์โทร
                    </Label>
                    <Input
                      id="contact_number"
                      value={editingNurse.contact_number}
                      onChange={(e) =>
                        setEditingNurse({
                          ...editingNurse,
                          contact_number: e.target.value,
                        })
                      }
                      className="col-span-3 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="department" className="text-right text-sm font-medium text-gray-700">
                      แผนก
                    </Label>
                    <Input
                      id="department"
                      value={editingNurse.department}
                      onChange={(e) =>
                        setEditingNurse({
                          ...editingNurse,
                          department: e.target.value,
                        })
                      }
                      className="col-span-3 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    onClick={() => setIsModalOpen(false)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    ยกเลิก
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                  >
                    บันทึก
                  </Button>
                </DialogFooter>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}