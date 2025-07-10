import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, User, Mail as MailIcon, Phone, BookUser, Tag } from "lucide-react";
import { format } from "date-fns";
import { FaSearch, FaBoxOpen } from "react-icons/fa"; // Icon animasi

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  name: z.string().min(2, { message: "Nama harus diisi minimal 2 karakter" }),
  nim: z.string().min(3, { message: "NIM harus diisi dengan benar" }),
  email: z.string().email({ message: "Email tidak valid" }),
  phone: z.string().min(10, { message: "Nomor telepon harus diisi minimal 10 digit" }),
  category: z.string({ required_error: "Silahkan pilih kategori barang" }),
  lostDate: z.date({ required_error: "Tanggal kehilangan harus diisi" }),
  description: z.string().min(10, { message: "Deskripsi harus diisi minimal 10 karakter" }),
});

const categories = [
  { value: "Elektronik", label: "Elektronik" },
  { value: "Dokumen", label: "Dokumen" },
  { value: "Pakaian", label: "Pakaian" },
  { value: "Aksesoris", label: "Aksesoris" },
  { value: "Buku", label: "Buku" },
  { value: "Lainnya", label: "Lainnya" },
];

const Index = () => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      nim: "",
      email: "",
      phone: "",
      category: "",
      lostDate: undefined,
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch("http://localhost:8080/api/lost-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          lostDate: values.lostDate ? values.lostDate.toISOString() : undefined,
        }),
      });
      if (!res.ok) throw new Error("Gagal mengirim laporan");
      toast({
        title: "Laporan Berhasil Terkirim",
        description: "Anda akan dihubungi jika barang ditemukan.",
      });
      form.reset();
    } catch (err) {
      toast({
        title: "Gagal mengirim laporan",
        description: "Terjadi kesalahan, coba lagi.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Hero Icon Animasi */}
        <div className="flex flex-col items-center mb-8 animate-fade-in">
          <div className="relative">
            <FaBoxOpen className="text-indigo-500 drop-shadow-lg" size={64} />
            <FaSearch className="absolute text-yellow-400 animate-bounce" size={32} style={{ left: 40, top: 30 }} />
          </div>
          <h1 className="text-5xl font-extrabold text-indigo-700 mb-2 drop-shadow mt-4">Findora</h1>
          <p className="text-lg text-gray-600 font-medium">Platform Laporan Barang Hilang Kampus</p>
        </div>

        <Card className="shadow-2xl border-0 rounded-2xl bg-white/90 backdrop-blur-md animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl text-indigo-700 font-bold flex items-center gap-2">
              <Tag className="w-6 h-6 text-indigo-500" /> Formulir Laporan Barang Hilang
            </CardTitle>
            <CardDescription className="text-gray-600">Isi formulir berikut dengan lengkap dan jelas agar peluang barang Anda ditemukan semakin besar.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Lengkap</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-indigo-400" />
                            <Input placeholder="Masukkan nama lengkap" {...field} className="pl-10 focus:ring-2 focus:ring-indigo-300" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nim"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NIM</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <BookUser className="absolute left-3 top-3 h-4 w-4 text-indigo-400" />
                            <Input placeholder="Masukkan NIM" {...field} className="pl-10 focus:ring-2 focus:ring-indigo-300" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MailIcon className="absolute left-3 top-3 h-4 w-4 text-indigo-400" />
                            <Input placeholder="contoh@email.com" type="email" {...field} className="pl-10 focus:ring-2 focus:ring-indigo-300" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>No. Telepon</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-indigo-400" />
                            <Input placeholder="08xxxxxxxxxx" {...field} className="pl-10 focus:ring-2 focus:ring-indigo-300" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kategori Barang</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="focus:ring-2 focus:ring-indigo-300">
                              <SelectValue placeholder="Pilih kategori barang" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lostDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Tanggal Kehilangan</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant={"outline"} className={cn("pl-3 text-left font-normal w-full flex justify-between items-center focus:ring-2 focus:ring-indigo-300", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "PPP") : <span>Pilih tanggal</span>}
                                <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus className={cn("p-3 pointer-events-auto")} />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi Detail Barang</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Berikan deskripsi lengkap tentang barang Anda (warna, ciri-ciri, lokasi kehilangan, dsb)" className="h-32 focus:ring-2 focus:ring-indigo-300" {...field} />
                      </FormControl>
                      <FormDescription>Semakin lengkap deskripsi, semakin besar kemungkinan barang Anda ditemukan.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="text-center">
                  <Button type="submit" className="w-full md:w-auto px-10 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:from-indigo-600 hover:to-blue-600 transition">
                    Kirim Laporan
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-gray-500">Findora &copy; 2025 &mdash; Sistem Pelaporan Barang Hilang Kampus</CardFooter>
        </Card>
      </div>
      {/* Animasi fade-in */}
      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 1s ease;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </div>
  );
};

export default Index;
