import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Database
  let db = {
    users: [
      { id: "1", pin: "1234", name: "Admin User", role: "admin" },
      { id: "2", pin: "0000", name: "Seller Joe", role: "seller" },
      { id: "3", pin: "8888", name: "Dev Team", role: "developer" }
    ],
    items: [
      { id: "1", name: "Shash/Skunk", price: 50, stock: 100, category: "Tobacco" },
      { id: "2", name: "Maforeign", price: 100, stock: 50, category: "Tobacco" }
    ],
    sales: [
      { id: "101", item_id: "1", quantity: 2, total: 100, payment_type: "cash", timestamp: new Date().toISOString(), seller_name: "Admin User" },
      { id: "102", item_id: "2", quantity: 1, total: 100, payment_type: "plb", timestamp: new Date(Date.now() - 86400000).toISOString(), seller_name: "Seller Joe" }
    ],
    debtors: [],
    restocks: [],
    system: {
      uptime: "14d 6h 22m",
      build: "1.2.5-stable",
      deployments: [
        { id: "d1", version: "v1.2.5", status: "success", timestamp: new Date().toISOString(), notes: "Dark mode & Management consolidation" },
        { id: "d2", version: "v1.2.0", status: "success", timestamp: new Date(Date.now() - 172800000).toISOString(), notes: "Sales history & Filtering" }
      ],
      updates: [
        { id: "u1", title: "RBAC Implementation", description: "Role-based access control for Admin, Seller, and Developer.", timestamp: new Date().toISOString() },
        { id: "u2", title: "UI Refinement", description: "Consolidated inventory and sales into management tab.", timestamp: new Date(Date.now() - 86400000).toISOString() }
      ],
      notifications: [
        { id: "n1", type: "info", message: "Database backup completed successfully.", timestamp: new Date().toISOString() },
        { id: "n2", type: "warning", message: "High traffic detected on API endpoints.", timestamp: new Date(Date.now() - 3600000).toISOString() }
      ]
    }
  };

  // Auth
  app.post("/api/auth/pin-login", (req, res) => {
    const { pin } = req.body;
    const user = db.users.find(u => u.pin === pin);
    if (user) {
      res.json({ success: true, token: "mock-jwt-token", user });
    } else {
      res.status(401).json({ success: false, message: "Invalid PIN" });
    }
  });

  // Items
  app.get("/api/items", (req, res) => res.json(db.items));
  app.post("/api/items", (req, res) => {
    const newItem = { id: Date.now().toString(), ...req.body };
    db.items.push(newItem);
    res.json(newItem);
  });
  app.patch("/api/items/:id", (req, res) => {
    const item = db.items.find(i => i.id === req.params.id);
    if (item) Object.assign(item, req.body);
    res.json(item);
  });

  // Sales
  app.get("/api/sales", (req, res) => res.json(db.sales));
  app.post("/api/sales", (req, res) => {
    const sale = { id: Date.now().toString(), timestamp: new Date().toISOString(), ...req.body };
    db.sales.push(sale);
    // Update inventory
    const item = db.items.find(i => i.id === sale.item_id);
    if (item) item.stock -= sale.quantity;
    res.json(sale);
  });

  // Debtors
  app.get("/api/debtors", (req, res) => res.json(db.debtors));
  app.get("/api/system", (req, res) => res.json(db.system));
  app.post("/api/system/settings", (req, res) => {
    // Mock update settings
    res.json({ success: true });
  });
  app.post("/api/debtors", (req, res) => {
    const debtor = { id: Date.now().toString(), ...req.body };
    db.debtors.push(debtor);
    res.json(debtor);
  });
  app.patch("/api/debtors/:id", (req, res) => {
    const debtor = db.debtors.find(d => d.id === req.params.id);
    if (debtor) Object.assign(debtor, req.body);
    res.json(debtor);
  });
  app.delete("/api/debtors/:id", (req, res) => {
    db.debtors = db.debtors.filter(d => d.id !== req.params.id);
    res.json({ success: true });
  });

  // Restocks
  app.post("/api/restocks", (req, res) => {
    const restock = { id: Date.now().toString(), timestamp: new Date().toISOString(), ...req.body };
    db.restocks.push(restock);
    const item = db.items.find(i => i.id === restock.item_id);
    if (item) item.stock += restock.quantity;
    res.json(restock);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
