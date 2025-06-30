const express = require("express");
const multer = require("multer");
const prisma = require("./db");
const cloudinary = require("./cloudinary");
const { authenticateToken } = require("./authMiddleware");
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// GET semua barang ditemukan (public)
router.get("/", async (req, res) => {
  try {
    const items = await prisma.foundItem.findMany({ orderBy: { createdAt: "desc" } });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil data", error: err.message });
  }
});

// GET detail barang ditemukan (public)
router.get("/:id", async (req, res) => {
  try {
    const item = await prisma.foundItem.findUnique({ where: { id: Number(req.params.id) } });
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil detail", error: err.message });
  }
});

// POST tambah barang ditemukan (proteksi JWT)
router.post("/", authenticateToken, upload.single("photo"), async (req, res) => {
  try {
    let photoUrl = null;
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: "findora" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        });
        stream.end(req.file.buffer);
      });
      photoUrl = result.secure_url;
    }
    const { adminId, name, brand, color, category, locationFound, foundDate, description, status } = req.body;
    const item = await prisma.foundItem.create({
      data: {
        adminId: adminId ? Number(adminId) : null,
        name,
        brand,
        color,
        category,
        locationFound,
        foundDate: new Date(foundDate),
        description,
        photoUrl,
        status: status || "Ditemukan",
      },
    });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menyimpan data", error: err.message });
  }
});

// PUT edit barang ditemukan (proteksi JWT)
router.put("/:id", authenticateToken, upload.single("photo"), async (req, res) => {
  try {
    let photoUrl = undefined;
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: "findora" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        });
        stream.end(req.file.buffer);
      });
      photoUrl = result.secure_url;
    }
    const { name, brand, color, category, locationFound, foundDate, description, status } = req.body;
    const item = await prisma.foundItem.update({
      where: { id: Number(req.params.id) },
      data: {
        name,
        brand,
        color,
        category,
        locationFound,
        foundDate: foundDate ? new Date(foundDate) : undefined,
        description,
        photoUrl,
        status,
      },
    });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menyimpan data", error: err.message });
  }
});

// DELETE barang ditemukan (proteksi JWT)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    await prisma.foundItem.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menghapus data", error: err.message });
  }
});

module.exports = router;
