require("dotenv").config();
const express = require("express");
const cors = require("cors");
const foundItemsRouter = require("./foundItems");
const adminsRouter = require("./admins");
const lostReportsRouter = require("./lostReports");

const app = express();

app.use(cors());
app.use(express.json());

// Routing API barang ditemukan
app.use("/api/found-items", foundItemsRouter);
// Routing API admin (login & register)
app.use("/api/admin", adminsRouter);
app.use("/api/lost-reports", lostReportsRouter);

// Health check endpoint
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// === DEBUG: Print all registered routes ===
if (app._router && app._router.stack) {
  app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
      console.log(`${Object.keys(r.route.methods)[0].toUpperCase()} ${r.route.path}`);
    }
  });
}
// ==========================================

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
