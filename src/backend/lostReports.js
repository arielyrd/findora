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
        status: "Hilang", // default status
      },
    });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: "Gagal menyimpan laporan", error: err.message });
  }
});

// DELETE laporan user
router.delete("/:id", async (req, res) => {
  try {
    await prisma.lostReport.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Gagal menghapus laporan", error: err.message });
  }
});

// UPDATE status laporan user
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await prisma.lostReport.update({
      where: { id: Number(req.params.id) },
      data: { status },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Gagal update laporan", error: err.message });
  }
});

module.exports = router;
