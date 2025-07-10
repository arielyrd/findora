import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, LogOut, Plus, Edit, Trash2, Bell, Mail, Image as ImageIcon, Sun, Moon, CheckCircle, XCircle, Menu } from "lucide-react";

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

function FindoraLogo({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <radialGradient id="findora-glow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#facc15" stopOpacity="1" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.6" />
        </radialGradient>
        <linearGradient id="findora-main" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60a5fa" />
          <stop offset="0.5" stopColor="#312e81" />
          <stop offset="1" stopColor="#a21caf" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#findora-glow)" opacity="0.7" />
      <rect x="12" y="22" width="40" height="20" rx="8" fill="url(#findora-main)" stroke="#fff" strokeWidth="3" />
      <circle cx="44" cy="44" r="7" fill="#fff" stroke="#facc15" strokeWidth="2.5" />
      <rect x="50" y="50" width="10" height="3" rx="1.5" transform="rotate(45 50 50)" fill="#facc15" />
      <rect x="18" y="28" width="14" height="4" rx="2" fill="#fff" />
      <rect x="18" y="34" width="10" height="4" rx="2" fill="#fff" />
    </svg>
  );
}

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
  const [currentPage, setCurrentPage] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editItem, setEditItem] = useState<FoundItem | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [lastReportId, setLastReportId] = useState<number | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<FoundItem | null>(null);
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

  const fetchLostReports = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/lost-reports");
      const data = await res.json();
      setLostReports(data);
      if (data.length > 0) {
        const newReports = data.filter((r) => r.status !== "Selesai");
        if (lastReportId !== null && newReports.length > 0 && newReports[0].id !== lastReportId) {
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

  useEffect(() => {
    const interval = setInterval(() => {
      fetchLostReports();
    }, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [lastReportId]);

  const handleLogout = () => {
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari sistem",
    });
    localStorage.removeItem("token");
    navigate("/login_admin");
  };

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as any;
    if (name === "photo" && files && files[0]) {
      setForm((prev: any) => ({ ...prev, photo: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleRemovePhoto = () => {
    setForm((prev: any) => ({ ...prev, photo: null }));
    setPreview(null);
  };

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

  // Tambahkan fungsi untuk membatalkan status selesai
  const markUndone = async (id: number) => {
    try {
      await fetch(`http://localhost:8080/api/lost-reports/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Diproses" }), // Ganti "Diproses" sesuai status default backend-mu
      });
      setLostReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Diproses" } : r)));
      toast({ title: "Status selesai dibatalkan" });
    } catch {
      toast({ title: "Gagal membatalkan status", variant: "destructive" });
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter !== "all" ? item.category === categoryFilter : true;
    const matchesStatus = statusFilter !== "all" ? item.status === statusFilter : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "date_desc") return new Date(b.foundDate).getTime() - new Date(a.foundDate).getTime();
    if (sortBy === "date_asc") return new Date(a.foundDate).getTime() - new Date(b.foundDate).getTime();
    if (sortBy === "name_asc") return a.name.localeCompare(b.name);
    if (sortBy === "name_desc") return b.name.localeCompare(a.name);
    return 0;
  });

  const totalPages = Math.ceil(sortedItems.length / ITEMS_PER_PAGE);
  const paginatedItems = sortedItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Hilang":
        return <Badge variant="destructive">{status}</Badge>;
      case "Ditemukan":
        return <Badge className="bg-amber-500 text-white dark:text-gray-900">{status}</Badge>;
      case "Dikembalikan":
        return <Badge className="bg-green-500 text-white dark:text-gray-900">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const renderVerifyBadge = (verified?: boolean) => {
    if (verified) return <Badge className="bg-green-600 text-white dark:text-gray-900">Terverifikasi</Badge>;
    return <Badge className="bg-yellow-500 text-white dark:text-gray-900">Belum Diverifikasi</Badge>;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const markNotifRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };
  const newReportCount = lostReports.filter((r) => r.status !== "Selesai").length;

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="rounded-full shadow-lg" style={{ background: "radial-gradient(circle at 60% 40%, #facc15 0%, #6366f1 70%, transparent 100%)" }}>
            <FindoraLogo size={48} />
          </span>
          <span className="text-2xl font-bold text-indigo-800 dark:text-indigo-300">Findora</span>
        </div>
        <button onClick={() => setDarkMode((d) => !d)} className="ml-2 p-2 rounded hover:bg-indigo-100 dark:hover:bg-gray-700" title="Toggle dark mode">
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
      <div className="p-6 flex-1">
        <nav className="space-y-2">
          <a href="#" className="flex items-center px-3 py-2 bg-indigo-50 text-indigo-700 rounded-md font-semibold dark:bg-indigo-900 dark:text-indigo-200">
            <Bell className="mr-2 h-4 w-4" /> Dashboard
          </a>
          <button className="flex items-center w-full px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md relative dark:text-blue-300 dark:hover:bg-gray-700" onClick={() => setNotifOpen(true)}>
            <Bell className="mr-2 h-4 w-4" />
            Notifikasi
            {unreadCount > 0 && <Badge className="ml-2 bg-red-500 text-white">{unreadCount}</Badge>}
          </button>
          <button className="flex items-center w-full px-3 py-2 text-indigo-700 hover:bg-indigo-50 rounded-md relative dark:text-indigo-200 dark:hover:bg-gray-700" onClick={() => setInboxOpen(true)}>
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
  );

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="flex min-h-screen">
        <aside className="hidden md:block w-72 bg-white dark:bg-[#181c24] shadow-lg border-r">{SidebarContent}</aside>
        {sidebarOpen && (
          <>
            <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
            <aside className="fixed top-0 left-0 h-full w-64 z-50 bg-white/90 dark:bg-[#181c24]/95 shadow-lg transition-transform duration-300 md:hidden" style={{ transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)" }}>
              <div className="flex flex-col h-full">
                <div className="p-6 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full shadow-lg" style={{ background: "radial-gradient(circle at 60% 40%, #facc15 0%, #6366f1 70%, transparent 100%)" }}>
                      <FindoraLogo size={42} />
                    </span>
                    <span className="text-2xl font-bold text-indigo-800 dark:text-indigo-300">Findora</span>
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="ml-2 p-2 rounded hover:bg-indigo-100 dark:hover:bg-gray-700" aria-label="Tutup sidebar">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 flex-1">
                  <nav className="space-y-2">
                    <a href="#" className="flex items-center px-3 py-2 bg-indigo-50 text-indigo-700 rounded-md font-semibold dark:bg-indigo-900 dark:text-indigo-200" onClick={() => setSidebarOpen(false)}>
                      <Bell className="mr-2 h-4 w-4" /> Dashboard
                    </a>
                    <button
                      className="flex items-center w-full px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md relative dark:text-blue-300 dark:hover:bg-gray-700"
                      onClick={() => {
                        setNotifOpen(true);
                        setSidebarOpen(false);
                      }}
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      Notifikasi
                      {unreadCount > 0 && <Badge className="ml-2 bg-red-500 text-white">{unreadCount}</Badge>}
                    </button>
                    <button
                      className="flex items-center w-full px-3 py-2 text-indigo-700 hover:bg-indigo-50 rounded-md relative dark:text-indigo-200 dark:hover:bg-gray-700"
                      onClick={() => {
                        setInboxOpen(true);
                        setSidebarOpen(false);
                      }}
                    >
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
            </aside>
          </>
        )}
        <div className="fixed top-4 left-4 z-50 md:hidden">
          {!sidebarOpen && (
            <button className="p-2 rounded-md bg-white/80 shadow hover:bg-indigo-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition" onClick={() => setSidebarOpen(true)} aria-label="Buka sidebar">
              <Menu className="w-7 h-7 text-indigo-600" />
            </button>
          )}
        </div>
        <main
          className="flex-1 min-h-screen"
          style={{
            background: darkMode ? "linear-gradient(135deg, #232526 0%, #414345 100%)" : "linear-gradient(135deg, #fff 0%, rgba(96,165,250,0.18) 30%, rgba(49,46,129,0.18) 70%, rgba(162,28,175,0.13) 100%)",
          }}
        >
          <div className="pt-4 px-4 md:px-8 max-w-full">
            {/* Dialogs */}
            <Dialog open={notifOpen} onOpenChange={setNotifOpen}>
              <DialogContent className="sm:max-w-md dark:bg-[#232526] dark:text-gray-100">
                <DialogHeader>
                  <DialogTitle>
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5" /> Notifikasi
                    </div>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  {notifications.length === 0 && <div className="text-center text-gray-500 dark:text-gray-300 py-8">Belum ada notifikasi baru.</div>}
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`rounded-lg px-4 py-3 mb-2 shadow-sm border flex items-center justify-between ${!notif.read ? "bg-indigo-50 dark:bg-indigo-900" : "bg-white dark:bg-[#232526]"}`}>
                      <div>
                        <div className="font-medium">{notif.message}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-300">{notif.date}</div>
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

            <Dialog open={inboxOpen} onOpenChange={setInboxOpen}>
              <DialogContent className="sm:max-w-2xl dark:bg-[#232526] dark:text-gray-100">
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
                    <div className="text-center text-gray-500 dark:text-gray-300 py-8">Tidak ada laporan masuk.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {lostReports.map((report) => (
                        <Card key={report.id} className="shadow border-t-4 border-t-indigo-500 hover:shadow-lg transition dark:bg-[#232526] dark:text-gray-100">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <span className="font-semibold">{report.name}</span>
                              <span className="text-xs text-gray-400">({report.nim})</span>
                              <Badge className={report.status === "Selesai" ? "bg-green-500" : "bg-yellow-500"}>{report.status}</Badge>
                            </CardTitle>
                            <CardDescription className="text-xs text-gray-500 dark:text-gray-300">
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
                            {report.status === "Selesai" ? (
                              <Button size="sm" variant="outline" className="text-yellow-600 border-yellow-600" onClick={() => markUndone(report.id)}>
                                Batalkan
                              </Button>
                            ) : (
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

            <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
              <DialogContent className="sm:max-w-lg dark:bg-[#232526] dark:text-gray-100">
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

            {/* ...lanjutan kode tetap seperti sebelumnya... */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-indigo-800 dark:text-indigo-200">Kelola Barang Hilang & Ditemukan</h1>
              <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <Button onClick={() => openDialog()}>
                  <Plus className="mr-2 h-4 w-4" /> Tambah Item Baru
                </Button>
                <DialogContent className="sm:max-w-lg dark:bg-[#232526] dark:text-gray-100">
                  <DialogHeader>
                    <DialogTitle>{editItem ? "Edit Barang" : "Tambah Item Baru"}</DialogTitle>
                    <DialogDescription>{editItem ? "Ubah detail barang yang ditemukan." : "Masukkan detail barang yang ingin ditambahkan."}</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="flex gap-3">
                      <Input name="name" placeholder="Nama Barang" value={form.name} onChange={handleChange} required className="dark:bg-[#232526] dark:text-gray-100" />
                      <Input name="brand" placeholder="Merk" value={form.brand} onChange={handleChange} className="dark:bg-[#232526] dark:text-gray-100" />
                    </div>
                    <div className="flex gap-3">
                      <Input name="color" placeholder="Warna" value={form.color} onChange={handleChange} className="dark:bg-[#232526] dark:text-gray-100" />
                      <Input name="category" placeholder="Kategori" value={form.category} onChange={handleChange} required className="dark:bg-[#232526] dark:text-gray-100" />
                    </div>
                    <div className="flex gap-3">
                      <Input name="locationFound" placeholder="Lokasi Ditemukan" value={form.locationFound} onChange={handleChange} required className="dark:bg-[#232526] dark:text-gray-100" />
                      <Input name="foundDate" type="date" value={form.foundDate} onChange={handleChange} required className="dark:bg-[#232526] dark:text-gray-100" />
                    </div>
                    <textarea name="description" placeholder="Deskripsi" value={form.description} onChange={handleChange} className="w-full p-2 border rounded dark:bg-[#232526] dark:text-gray-100" />
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
                    <select name="status" value={form.status} onChange={handleChange} className="w-full p-2 border rounded dark:bg-[#232526] dark:text-gray-100">
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

            {/* Statistik Box */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className={`rounded-xl p-6 shadow ${darkMode ? "bg-[#181c24] text-gray-100" : "bg-white"}`}>
                <div className="text-lg font-semibold mb-2">Total Laporan</div>
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-300">{lostReports.length}</div>
              </div>
              <div className={`rounded-xl p-6 shadow ${darkMode ? "bg-[#181c24] text-gray-100" : "bg-white"}`}>
                <div className="text-lg font-semibold mb-2">Barang Hilang</div>
                <div className="text-3xl font-bold text-red-500 dark:text-red-400">{items.filter((i) => i.status === "Hilang").length}</div>
              </div>
              <div className={`rounded-xl p-6 shadow ${darkMode ? "bg-[#181c24] text-gray-100" : "bg-white"}`}>
                <div className="text-lg font-semibold mb-2">Barang Ditemukan</div>
                <div className="text-3xl font-bold text-green-500 dark:text-green-400">{items.filter((i) => i.status === "Ditemukan").length}</div>
              </div>
            </div>

            {/* Barang ditemukan */}
            <div className="flex gap-4 mb-4 flex-wrap">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] dark:bg-[#232526] dark:text-gray-100">
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent className="dark:bg-[#232526] dark:text-gray-100">
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="date_desc">Tanggal Terbaru</SelectItem>
                  <SelectItem value="date_asc">Tanggal Terlama</SelectItem>
                  <SelectItem value="name_asc">Nama A-Z</SelectItem>
                  <SelectItem value="name_desc">Nama Z-A</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px] dark:bg-[#232526] dark:text-gray-100">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Kategori" />
                  </div>
                </SelectTrigger>
                <SelectContent className="dark:bg-[#232526] dark:text-gray-100">
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
                <SelectTrigger className="w-[180px] dark:bg-[#232526] dark:text-gray-100">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent className="dark:bg-[#232526] dark:text-gray-100">
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="Hilang">Hilang</SelectItem>
                  <SelectItem value="Ditemukan">Ditemukan</SelectItem>
                  <SelectItem value="Dikembalikan">Dikembalikan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className={`shadow rounded-lg p-6 ${darkMode ? "bg-[#232526] text-gray-100" : "bg-white"}`}>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input placeholder="Cari berdasarkan nama barang..." className="pl-10 dark:bg-[#181c24] dark:text-gray-100" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>
              <div className="rounded-md border overflow-auto">
                <Table>
                  <TableHeader className="dark:bg-[#181c24]">
                    <TableRow>
                      <TableHead className="dark:text-gray-100">Foto</TableHead>
                      <TableHead className="dark:text-gray-100">Nama Barang</TableHead>
                      <TableHead className="dark:text-gray-100">Merk</TableHead>
                      <TableHead className="dark:text-gray-100">Warna</TableHead>
                      <TableHead className="dark:text-gray-100">Kategori</TableHead>
                      <TableHead className="dark:text-gray-100">Lokasi</TableHead>
                      <TableHead className="dark:text-gray-100">Tanggal</TableHead>
                      <TableHead className="dark:text-gray-100">Status</TableHead>
                      <TableHead className="dark:text-gray-100">Status Verifikasi</TableHead>
                      <TableHead className="dark:text-gray-100">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-10 text-indigo-600 dark:text-indigo-300">
                          Memuat data...
                        </TableCell>
                      </TableRow>
                    ) : paginatedItems.length > 0 ? (
                      paginatedItems.map((item) => (
                        <TableRow key={item.id} className="dark:bg-[#232526]">
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
                              className="text-indigo-700 hover:underline dark:text-indigo-300"
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
                                <Button variant="outline" size="sm" className="text-green-600 dark:text-green-400" onClick={() => handleVerify(item.id)}>
                                  Verifikasi
                                </Button>
                              ) : (
                                <Button variant="outline" size="sm" className="text-yellow-600 dark:text-yellow-400" onClick={() => handleUnverify(item.id)}>
                                  <XCircle className="h-4 w-4 mr-1" /> Batalkan Verifikasi
                                </Button>
                              )}
                              <Button variant="outline" size="sm" onClick={() => openDialog(item)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700 dark:text-red-400" onClick={() => deleteItem(item.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-10 text-gray-500 dark:text-gray-300">
                          Tidak ada data yang ditemukan
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
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
            {/* Tidak ada perubahan pada bagian lain */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
