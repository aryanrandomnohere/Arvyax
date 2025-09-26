import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";

const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

app.use(cors());
app.use(express.json());

// Middleware to protect routes
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Auth routes
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = await prisma.user.create({
      data: {
        email,
        password,
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ data: { token, user } });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "User already exists" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ data: { token, user } });
  } else {
    res.status(400).json({ error: "Invalid credentials" });
  }
});

// Session routes
app.get("/api/my-sessions", authenticateToken, async (req: any, res) => {
  const sessions = await prisma.wellnessSession.findMany({
    //@ts-ignore
    where: { userId: req.user.userId },
  });
  res.json({ data: sessions });
});

app.post("/api/my-sessions", authenticateToken, async (req: any, res) => {
  const { title, tags, json_url, status } = req.body;
  const session = await prisma.wellnessSession.create({
    data: {
      title,
      tags,
      json_url,
      status,
      //@ts-ignore
      userId: req.user.userId,
    },
  });
  res.json({ data: session });
});

app.put("/api/my-sessions/:id", authenticateToken, async (req: any, res) => {
  const { id } = req.params;
  const { title, tags, json_url, status } = req.body;
  try {
    const session = await prisma.wellnessSession.update({
      where: { id },
      data: {
        title,
        tags,
        json_url,
        status,
      },
    });
    res.json({ data: session });
  } catch (error) {
    res.status(404).json({ error: "Session not found" });
  }
});

app.delete("/api/my-sessions/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.wellnessSession.delete({ where: { id } });
    res.json({ message: "Session deleted successfully" });
  } catch (error) {
    res.status(404).json({ error: "Session not found" });
  }
});

app.get("/api/sessions", async (req, res) => {
  const sessions = await prisma.wellnessSession.findMany({
    where: { status: "published" },
  });
  res.json({ data: sessions });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
