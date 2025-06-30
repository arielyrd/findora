import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Lock, User } from "lucide-react";

// Skema validasi untuk register admin
const formSchema = z.object({
  name: z.string().min(1, { message: "Nama harus diisi" }),
  email: z.string().email({ message: "Email harus valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

const RegisterAdmin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch("http://localhost:8080/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Registrasi Berhasil",
          description: "Admin berhasil didaftarkan! Mengarahkan ke halaman login...",
        });
        setTimeout(() => {
          navigate("/login_admin");
        }, 2000);
      } else {
        toast({
          title: "Registrasi Gagal",
          description: data.message || "Gagal mendaftar",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Registrasi Gagal",
        description: "Terjadi kesalahan koneksi",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-100 to-indigo-300 p-4">
      <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-indigo-600 rounded-xl bg-white/80 backdrop-blur-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 shadow-lg">
              <User className="w-8 h-8 text-indigo-600" />
            </span>
          </div>
          <CardTitle className="text-3xl font-extrabold text-indigo-700 drop-shadow">Findora</CardTitle>
          <CardDescription className="text-lg text-gray-600">Register Admin</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <span className="flex items-center gap-2">
                        <User className="w-4 h-4 text-indigo-500" />
                        Nama
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama" {...field} className="focus:ring-2 focus:ring-indigo-400 transition" />
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
                    <FormLabel>
                      <span className="flex items-center gap-2">
                        <User className="w-4 h-4 text-indigo-500" />
                        Email
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Masukkan email" {...field} className="focus:ring-2 focus:ring-indigo-400 transition" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <span className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-indigo-500" />
                        Password
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Masukkan password" {...field} className="focus:ring-2 focus:ring-indigo-400 transition" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-semibold py-2 rounded-lg shadow-md transition">
                Register
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm text-gray-500 mt-2">
          <span>Findora &copy; 2025 &mdash; Sistem Pengelolaan Barang Hilang Kampus</span>
          <span className="mt-1 text-xs text-gray-400">Powered by React & Shadcn UI</span>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterAdmin;
