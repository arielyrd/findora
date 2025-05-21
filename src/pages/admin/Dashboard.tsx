
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Bell,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

// Data contoh untuk tabel
const initialData = [
  {
    id: 1,
    name: "Laptop Acer",
    brand: "Acer",
    color: "Hitam",
    category: "Elektronik",
    location: "Perpustakaan",
    date: "2025-05-15",
    status: "Hilang",
  },
  {
    id: 2,
    name: "Dompet",
    brand: "Eiger",
    color: "Coklat",
    category: "Aksesoris",
    location: "Kantin",
    date: "2025-05-14",
    status: "Ditemukan",
  },
  {
    id: 3,
    name: "Buku Algoritma",
    brand: "-",
    color: "Biru",
    category: "Buku",
    location: "Lab Komputer",
    date: "2025-05-12",
    status: "Dikembalikan",
  },
  {
    id: 4,
    name: "iPhone 15",
    brand: "Apple",
    color: "Putih",
    category: "Elektronik",
    location: "Gedung A",
    date: "2025-05-10",
    status: "Hilang",
  },
  {
    id: 5,
    name: "Jaket",
    brand: "Uniqlo",
    color: "Hitam",
    category: "Pakaian",
    location: "Gedung B",
    date: "2025-05-08",
    status: "Ditemukan",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  // Fungsi untuk logout
  const handleLogout = () => {
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari sistem",
    });
    navigate("/login_admin");
  };

  // Fungsi untuk menghapus item
  const deleteItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
    toast({
      title: "Item Dihapus",
      description: "Item telah berhasil dihapus",
    });
  };

  // Filter data berdasarkan pencarian dan filter
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
    const matchesStatus = statusFilter ? item.status === statusFilter : true;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Render status badge dengan warna yang berbeda
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Hilang":
        return <Badge variant="destructive">{status}</Badge>;
      case "Ditemukan":
        return <Badge className="bg-amber-500">{status}</Badge>;
      case "Dikembalikan":
        return <Badge className="bg-green-500">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg fixed h-full">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-indigo-600">Findora</h1>
          <p className="text-sm text-gray-500">Dashboard Admin</p>
        </div>
        <div className="p-6">
          <nav className="space-y-2">
            <a href="#" className="flex items-center px-3 py-2 bg-indigo-50 text-indigo-600 rounded-md">
              Dashboard
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
              Notifikasi <Badge className="ml-2 bg-red-500">3</Badge>
            </a>
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-red-500 hover:bg-red-50 rounded-md"
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Kelola Barang Hilang & Ditemukan</h1>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Tambah Item Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Tambah Item Baru</DialogTitle>
                <DialogDescription>
                  Masukkan detail item yang ingin ditambahkan.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                {/* Form untuk menambahkan item baru akan ditambahkan di sini */}
                <p className="text-center text-gray-500 italic">Form tambah item di sini (akan diimplementasikan)</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {}}>Batal</Button>
                <Button onClick={() => {
                  toast({
                    title: "Fitur dalam pengembangan",
                    description: "Fungsi tambah item akan segera tersedia",
                  });
                }}>Simpan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Laporan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{items.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Barang Hilang</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">
                {items.filter(item => item.status === "Hilang").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Barang Ditemukan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">
                {items.filter(item => item.status === "Ditemukan" || item.status === "Dikembalikan").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari berdasarkan nama barang..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Kategori" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Semua Kategori</SelectItem>
                  <SelectItem value="Elektronik">Elektronik</SelectItem>
                  <SelectItem value="Dokumen">Dokumen</SelectItem>
                  <SelectItem value="Pakaian">Pakaian</SelectItem>
                  <SelectItem value="Aksesoris">Aksesoris</SelectItem>
                  <SelectItem value="Buku">Buku</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Semua Status</SelectItem>
                  <SelectItem value="Hilang">Hilang</SelectItem>
                  <SelectItem value="Ditemukan">Ditemukan</SelectItem>
                  <SelectItem value="Dikembalikan">Dikembalikan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Barang</TableHead>
                  <TableHead>Merk</TableHead>
                  <TableHead>Warna</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.brand}</TableCell>
                      <TableCell>{item.color}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{renderStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => {
                            toast({
                              title: "Fitur dalam pengembangan",
                              description: "Fungsi edit akan segera tersedia",
                            });
                          }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700" onClick={() => deleteItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                      Tidak ada data yang ditemukan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
