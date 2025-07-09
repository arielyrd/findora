import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, LogOut, Plus, Edit, Trash2, Bell, Mail, Image as ImageIcon, Sun, Moon, CheckCircle, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import ItemDetail from "@/components/ItemDetail";

// Type untuk barang ditemukan
type FoundItem = {
  id: number;
  name: string;
  brand?: string;
  color?: string;
  category: string;
  locationFound: string;
  foundDate: string;
  description?: string;
  photoUrl?: string;
  status: string;
  createdAt: string;
  verified?: boolean;
};

// Type untuk laporan user
type LostReport = {
  id: number;
  name: string;
  nim: string;
  email: string;
  phone: string;
  category: string;
  lostDate: string;
  description: string;
  status: string;
  createdAt: string;
};

type Notification = {
  id: number;
  message: string;
  date: string;
  read: boolean;
};

const ITEMS_PER_PAGE = 5;

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState<FoundItem[]>([]);
  const [lostReports, setLostReports] = useState<LostReport[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Dark mode
  const [darkMode, setDarkMode] = useState(false);

  // Dialog state
  const [showDialog, setShowDialog] = useState(false);
  const [editItem, setEditItem] = useState<FoundItem | null>(null);

  // Notifikasi state
  const [notifOpen, setNotifOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);

  // Notifikasi laporan baru
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [lastReportId, setLastReportId] = useState<number | null>(null);

  // Detail barang state
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<FoundItem | null>(null);

  // Form state
  const [form, setForm] = useState<any>({
    name: "",
    brand: "",
    color: "",
    category: "",
    locationFound: "",
    foundDate: "",
    description: "",
    photo: null,
    status: "Ditemukan",
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Fetch data dari backend
  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/found-items");
      const data = await res.json();
      setItems(data);
    } catch {
      toast({ title: "Gagal memuat data", variant: "destructive" });
    }
    setLoading(false);
  };

  // Fetch LostReport untuk inbox laporan user
  const fetchLostReports = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/lost-reports");
      const data = await res.json();
      setLostReports(data);
      // Notifikasi: cek laporan baru
      if (data.length > 0) {
        const newReports = data.filter((r) => r.status !== "Selesai");
        if (lastReportId !== null && newReports.length > 0 && newReports[0].id !== lastReportId) {
          // Tambahkan notifikasi baru
          setNotifications((prev) => [
            {
              id: newReports[0].id,
              message: `Laporan baru dari ${newReports[0].name} (${newReports[0].category})`,
              date: new Date(newReports[0].createdAt).toLocaleDateString(),
              read: false,
            },
            ...prev,
          ]);
        }
        if (newReports.length > 0) setLastReportId(newReports[0].id);
      }
    } catch {
      toast({ title: "Gagal memuat laporan user", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchItems();
    fetchLostReports();
    // eslint-disable-next-line
  }, []);

  // Polling laporan baru setiap 10 detik
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLostReports();
    }, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [lastReportId]);

  // Logout
  const handleLogout = () => {
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari sistem",
    });
    localStorage.removeItem("token");
    navigate("/login_admin");
  };

  // Hapus barang
  const deleteItem = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus barang ini?")) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8080/api/found-items/${id}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) {
      setItems(items.filter((item) => item.id !== id));
      toast({ title: "Item Dihapus", description: "Item berhasil dihapus" });
    } else {
      toast({ title: "Gagal menghapus", variant: "destructive" });
    }
  };

  // Verifikasi barang
  const handleVerify = async (id: number) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8080/api/found-items/${id}/verify`, {
      method: "PUT",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) {
      toast({ title: "Barang diverifikasi" });
      fetchItems();
    } else {
      toast({ title: "Gagal verifikasi", variant: "destructive" });
    }
  };

  // Cancel verifikasi barang
  const handleUnverify = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/found-items/${id}/unverify`, {
        method: "PUT",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        toast({ title: "Verifikasi dibatalkan" });
        fetchItems();
      } else {
        const data = await res.json();
        toast({ title: "Gagal membatalkan verifikasi", description: data.message || "", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Gagal membatalkan verifikasi", variant: "destructive" });
    }
  };

  // Buka dialog tambah/edit
  const openDialog = (item?: FoundItem) => {
    setEditItem(item || null);
    setForm(
      item
        ? {
            ...item,
            foundDate: item.foundDate?.slice(0, 10),
            photo: null,
          }
        : {
            name: "",
            brand: "",
            color: "",
            category: "",
            locationFound: "",
            foundDate: "",
            description: "",
            photo: null,
            status: "Ditemukan",
          }
    );
    setPreview(item?.photoUrl || null);
    setShowDialog(true);
  };

  // Handle form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as any;
    if (name === "photo" && files && files[0]) {
      setForm((prev: any) => ({ ...prev, photo: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  // Hapus foto yang dipilih
  const handleRemovePhoto = () => {
    setForm((prev: any) => ({ ...prev, photo: null }));
    setPreview(null);
  };

  // Submit tambah/edit barang
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value as any);
    });
    const token = localStorage.getItem("token");
    let url = "http://localhost:8080/api/found-items";
    let method = "POST";
    if (editItem) {
      url += `/${editItem.id}`;
      method = "PUT";
    }
    const res = await fetch(url, {
      method,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (res.ok) {
      setShowDialog(false);
      setEditItem(null);
      setFormLoading(false);
      fetchItems();
      toast({
        title: editItem ? "Barang berhasil diubah" : "Barang berhasil ditambah",
      });
    } else {
      toast({
        title: "Gagal menyimpan data",
        variant: "destructive",
      });
      setFormLoading(false);
    }
  };

  // Hapus laporan user
  const deleteReport = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus laporan ini?")) return;
    try {
      await fetch(`http://localhost:8080/api/lost-reports/${id}`, { method: "DELETE" });
      setLostReports((prev) => prev.filter((r) => r.id !== id));
      toast({ title: "Laporan dihapus" });
    } catch {
      toast({ title: "Gagal menghapus laporan", variant: "destructive" });
    }
  };

  // Tandai selesai (ubah status)
  const markDone = async (id: number) => {
    try {
      await fetch(`http://localhost:8080/api/lost-reports/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Selesai" }),
      });
      setLostReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Selesai" } : r)));
      toast({ title: "Laporan ditandai selesai" });
    } catch {
      toast({ title: "Gagal update status", variant: "destructive" });
    }
  };

  // Filter data
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter !== "all" ? item.category === categoryFilter : true;
    const matchesStatus = statusFilter !== "all" ? item.status === statusFilter : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sort data
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "date_desc") return new Date(b.foundDate).getTime() - new Date(a.foundDate).getTime();
    if (sortBy === "date_asc") return new Date(a.foundDate).getTime() - new Date(b.foundDate).getTime();
    if (sortBy === "name_asc") return a.name.localeCompare(b.name);
    if (sortBy === "name_desc") return b.name.localeCompare(a.name);
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedItems.length / ITEMS_PER_PAGE);
  const paginatedItems = sortedItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Badge status
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

  // Badge verifikasi
  const renderVerifyBadge = (verified?: boolean) => {
    if (verified) return <Badge className="bg-green-600">Terverifikasi</Badge>;
    return <Badge className="bg-yellow-500">Belum Diverifikasi</Badge>;
  };

  // Pagination handler
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Jumlah notifikasi belum dibaca
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Mark notification as read
  const markNotifRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  // Jumlah laporan belum selesai
  const newReportCount = lostReports.filter((r) => r.status !== "Selesai").length;

  return (
    <div className={`${darkMode ? "dark bg-gray-900 text-white" : "bg-gradient-to-br from-indigo-50 to-blue-100"} min-h-screen flex`}>
      {/* Sidebar */}
      <div className={`w-64 ${darkMode ? "bg-gray-800 text-white" : "bg-white"} shadow-lg fixed h-full`}>
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">Findora</h1>
            <p className="text-sm text-gray-500 dark:text-gray-300">Dashboard Admin</p>
          </div>
          <button onClick={() => setDarkMode((d) => !d)} className="ml-2 p-2 rounded hover:bg-indigo-100 dark:hover:bg-gray-700">
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
        <div className="p-6">
          <nav className="space-y-2">
            <a href="#" className="flex items-center px-3 py-2 bg-indigo-50 text-indigo-600 rounded-md font-semibold dark:bg-indigo-900 dark:text-indigo-200">
              <Bell className="mr-2 h-4 w-4" /> Dashboard
            </a>
            <button className="flex items-center w-full px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md relative dark:text-blue-300 dark:hover:bg-gray-700" onClick={() => setNotifOpen(true)}>
              <Bell className="mr-2 h-4 w-4" />
              Notifikasi
              {unreadCount > 0 && <Badge className="ml-2 bg-red-500 text-white">{unreadCount}</Badge>}
            </button>
            <button className="flex items-center w-full px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-md relative dark:text-indigo-300 dark:hover:bg-gray-700" onClick={() => setInboxOpen(true)}>
              <Mail className="mr-2 h-4 w-4" />
              Inbox
              {newReportCount > 0 && <Badge className="ml-2 bg-yellow-500 text-white">{newReportCount}</Badge>}
            </button>
            <button onClick={handleLogout} className="flex items-center w-full px-3 py-2 text-red-500 hover:bg-red-50 rounded-md dark:hover:bg-gray-700">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </button>
          </nav>
        </div>
      </div>

      {/* Notifikasi Dialog */}
      <Dialog open={notifOpen} onOpenChange={setNotifOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5" /> Notifikasi
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {notifications.length === 0 && <div className="text-center text-gray-500 py-8">Belum ada notifikasi baru.</div>}
            {notifications.map((notif) => (
              <div key={notif.id} className={`rounded-lg px-4 py-3 mb-2 shadow-sm border flex items-center justify-between ${!notif.read ? "bg-indigo-50" : "bg-white"}`}>
                <div>
                  <div className="font-medium">{notif.message}</div>
                  <div className="text-xs text-gray-500">{notif.date}</div>
                </div>
                {!notif.read && (
                  <Badge className="bg-blue-600 text-white cursor-pointer ml-2" onClick={() => markNotifRead(notif.id)}>
                    Baru
                  </Badge>
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotifOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inbox Dialog */}
      <Dialog open={inboxOpen} onOpenChange={setInboxOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" /> Inbox Laporan Masuk
              </div>
            </DialogTitle>
            <DialogDescription>Daftar laporan barang hilang yang masuk ke sistem.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto px-1">
            {lostReports.length === 0 ? (
              <div className="text-center text-gray-500 py-8">Tidak ada laporan masuk.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lostReports.map((report) => (
                  <Card key={report.id} className="shadow border-t-4 border-t-indigo-500 hover:shadow-lg transition">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <span className="font-semibold">{report.name}</span>
                        <span className="text-xs text-gray-400">({report.nim})</span>
                        <Badge className={report.status === "Selesai" ? "bg-green-500" : "bg-yellow-500"}>{report.status}</Badge>
                      </CardTitle>
                      <CardDescription className="text-xs text-gray-500">
                        {report.category} &middot; {new Date(report.lostDate).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm">
                      <div>
                        <span className="font-semibold">Email:</span> {report.email}
                      </div>
                      <div>
                        <span className="font-semibold">No. HP:</span> {report.phone}
                      </div>
                      <div>
                        <span className="font-semibold">Deskripsi:</span>
                        <div className="text-gray-700 dark:text-gray-200">{report.description}</div>
                      </div>
                      <div>
                        <span className="font-semibold">Waktu Lapor:</span> {new Date(report.createdAt).toLocaleString()}
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2 justify-end">
                      {report.status !== "Selesai" && (
                        <Button size="sm" variant="outline" className="text-green-600 border-green-600" onClick={() => markDone(report.id)}>
                          <CheckCircle className="w-4 h-4 mr-1" /> Tandai Selesai
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="text-red-500 border-red-500" onClick={() => deleteReport(report.id)}>
                        <Trash2 className="w-4 h-4 mr-1" /> Hapus
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInboxOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Barang Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail Barang</DialogTitle>
          </DialogHeader>
          {detailItem && <ItemDetail item={detailItem} />}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Kelola Barang Hilang & Ditemukan</h1>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <Button onClick={() => openDialog()}>
              <Plus className="mr-2 h-4 w-4" /> Tambah Item Baru
            </Button>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{editItem ? "Edit Barang" : "Tambah Item Baru"}</DialogTitle>
                <DialogDescription>{editItem ? "Ubah detail barang yang ditemukan." : "Masukkan detail barang yang ingin ditambahkan."}</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex gap-3">
                  <Input name="name" placeholder="Nama Barang" value={form.name} onChange={handleChange} required />
                  <Input name="brand" placeholder="Merk" value={form.brand} onChange={handleChange} />
                </div>
                <div className="flex gap-3">
                  <Input name="color" placeholder="Warna" value={form.color} onChange={handleChange} />
                  <Input name="category" placeholder="Kategori" value={form.category} onChange={handleChange} required />
                </div>
                <div className="flex gap-3">
                  <Input name="locationFound" placeholder="Lokasi Ditemukan" value={form.locationFound} onChange={handleChange} required />
                  <Input name="foundDate" type="date" value={form.foundDate} onChange={handleChange} required />
                </div>
                <textarea name="description" placeholder="Deskripsi" value={form.description} onChange={handleChange} className="w-full p-2 border rounded" />
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <ImageIcon className="h-5 w-5 text-indigo-500" />
                    <span className="text-sm">{preview ? "Klik gambar untuk ganti" : "Klik di sini untuk upload foto barang"}</span>
                    <input name="photo" type="file" accept="image/*" onChange={handleChange} className="hidden" />
                  </label>
                  {preview && (
                    <div className="relative group mt-2">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded border shadow"
                        title="Klik untuk ganti foto"
                        onClick={() => {
                          document.querySelector<HTMLInputElement>('input[name="photo"]')?.click();
                        }}
                        style={{ cursor: "pointer" }}
                      />
                      <button type="button" onClick={handleRemovePhoto} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-80 hover:opacity-100 transition" title="Hapus gambar">
                        ×
                      </button>
                    </div>
                  )}
                </div>
                <select name="status" value={form.status} onChange={handleChange} className="w-full p-2 border rounded">
                  <option value="Ditemukan">Ditemukan</option>
                  <option value="Dikembalikan">Dikembalikan</option>
                  <option value="Hilang">Hilang</option>
                </select>
                <DialogFooter>
                  <Button variant="outline" type="button" onClick={() => setShowDialog(false)}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={formLoading}>
                    {formLoading ? (editItem ? "Menyimpan..." : "Mengirim...") : editItem ? "Simpan Perubahan" : "Tambah Barang"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Barang ditemukan */}
        <div className="flex gap-4 mb-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="date_desc">Tanggal Terbaru</SelectItem>
              <SelectItem value="date_asc">Tanggal Terlama</SelectItem>
              <SelectItem value="name_asc">Nama A-Z</SelectItem>
              <SelectItem value="name_desc">Nama Z-A</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Kategori" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="Elektronik">Elektronik</SelectItem>
              <SelectItem value="Dokumen">Dokumen</SelectItem>
              <SelectItem value="Pakaian">Pakaian</SelectItem>
              <SelectItem value="Aksesoris">Aksesoris</SelectItem>
              <SelectItem value="Buku">Buku</SelectItem>
              <SelectItem value="Lainnya">Lainnya</SelectItem>
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
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="Hilang">Hilang</SelectItem>
              <SelectItem value="Ditemukan">Ditemukan</SelectItem>
              <SelectItem value="Dikembalikan">Dikembalikan</SelectItem>
            </SelectContent>
          </Select>
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
              <div className="text-3xl font-bold text-red-500">{items.filter((item) => item.status === "Hilang").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Barang Ditemukan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{items.filter((item) => item.status === "Ditemukan" || item.status === "Dikembalikan").length}</div>
            </CardContent>
          </Card>
        </div>

        <div className={`${darkMode ? "bg-gray-800 text-white" : "bg-white"} shadow rounded-lg p-6`}>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="Cari berdasarkan nama barang..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>

          <div className="rounded-md border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Foto</TableHead>
                  <TableHead>Nama Barang</TableHead>
                  <TableHead>Merk</TableHead>
                  <TableHead>Warna</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Status Verifikasi</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-10 text-indigo-600">
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : paginatedItems.length > 0 ? (
                  paginatedItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {item.photoUrl ? (
                          <img src={item.photoUrl} alt={item.name} className="w-14 h-14 object-cover rounded border" />
                        ) : (
                          <span className="flex items-center text-gray-400">
                            <ImageIcon className="mr-1" /> -
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <button
                          className="text-indigo-600 hover:underline"
                          onClick={() => {
                            setDetailItem(item);
                            setDetailOpen(true);
                          }}
                        >
                          {item.name}
                        </button>
                      </TableCell>
                      <TableCell>{item.brand}</TableCell>
                      <TableCell>{item.color}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.locationFound}</TableCell>
                      <TableCell>{new Date(item.foundDate).toLocaleDateString()}</TableCell>
                      <TableCell>{renderStatusBadge(item.status)}</TableCell>
                      <TableCell>{renderVerifyBadge(item.verified)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {!item.verified ? (
                            <Button variant="outline" size="sm" className="text-green-600" onClick={() => handleVerify(item.id)}>
                              Verifikasi
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" className="text-yellow-600" onClick={() => handleUnverify(item.id)}>
                              <XCircle className="h-4 w-4 mr-1" /> Batalkan Verifikasi
                            </Button>
                          )}
                          <Button variant="outline" size="sm" onClick={() => openDialog(item)}>
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
                    <TableCell colSpan={10} className="text-center py-10 text-gray-500">
                      Tidak ada data yang ditemukan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={() => handlePageChange(currentPage - 1)} />
                </PaginationItem>
                {[...Array(totalPages)].map((_, idx) => (
                  <PaginationItem key={idx}>
                    <PaginationLink href="#" isActive={currentPage === idx + 1} onClick={() => handlePageChange(idx + 1)}>
                      {idx + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext href="#" onClick={() => handlePageChange(currentPage + 1)} />
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
