const express = require("express");
const prisma = require("./db");
const router = express.Router();

// GET semua laporan user (untuk admin)
router.get("/", async (req, res) => {
  try {
    const reports = await prisma.lostReport.findMany({ orderBy: { createdAt: "desc" } });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data", error: err.message });
  }
});

// POST laporan user
router.post("/", async (req, res) => {
  try {
    const { name, nim, email, phone, category, lostDate, description } = req.body;
    const report = await prisma.lostReport.create({
      data: {
        name,
        nim,
        email,
        phone,
        category,
        lostDate: new Date(lostDate),
        description,
      },
    });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: "Gagal menyimpan laporan", error: err.message });
  }
});

module.exports = router;
