
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

const formSchema = z.object({
  username: z.string().min(1, {
    message: "Username harus diisi",
  }),
  password: z.string().min(1, {
    message: "Password harus diisi",
  }),
});

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Simulasi validasi login (gantikan dengan panggilan API sebenarnya)
    if (values.username === "admin" && values.password === "admin123") {
      // Login berhasil
      toast({
        title: "Login Berhasil",
        description: "Selamat datang di dashboard admin",
      });
      
      // Redirect ke dashboard
      navigate("/admin/dashboard");
    } else {
      // Login gagal
      toast({
        title: "Login Gagal",
        description: "Username atau password salah",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-indigo-500">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold text-indigo-600">Findora</CardTitle>
          <CardDescription className="text-lg">Login Admin</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan username" {...field} />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Masukkan password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-gray-500">
          Findora &copy; 2025 - Sistem Pengelolaan Barang Hilang Kampus
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
