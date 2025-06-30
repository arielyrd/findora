const express = require("express");
const prisma = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Register admin
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Semua field harus diisi" });

  // Cek apakah email sudah terdaftar
  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ message: "Email sudah terdaftar" });

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Simpan admin baru
  try {
    const admin = await prisma.admin.create({
      data: { name, email, passwordHash },
    });
    res.json({
      message: "Admin berhasil didaftarkan",
      admin: { id: admin.id, name: admin.name, email: admin.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Gagal mendaftar admin", error: err.message });
  }
});

// Login admin
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return res.status(401).json({ message: "Email tidak terdaftar" });

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) return res.status(401).json({ message: "Password salah" });

  const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token });
});

module.exports = router;
