import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { body, validationResult } from "express-validator";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ─── HOTELES ─────────────────────────────────────────────

// GET /api/hotels
app.get("/api/hotels", async (req, res) => {
  try {
    const hotels = await prisma.hotel.findMany({
      include: { _count: { select: { reservations: true } } },
      orderBy: { name: "asc" },
    });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/hotels/:id
app.get("/api/hotels/:id", async (req, res) => {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { reservations: { include: { guest: true } } },
    });
    if (!hotel) return res.status(404).json({ error: "Hotel no encontrado" });
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/hotels
app.post("/api/hotels", async (req, res) => {
  try {
    const hotel = await prisma.hotel.create({ data: req.body });
    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/hotels/:id
app.put("/api/hotels/:id", async (req, res) => {
  try {
    const hotel = await prisma.hotel.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/hotels/:id
app.delete("/api/hotels/:id", async (req, res) => {
  try {
    await prisma.hotel.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Hotel eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── HUÉSPEDES ───────────────────────────────────────────

// GET /api/guests
app.get("/api/guests", async (req, res) => {
  try {
    const guests = await prisma.guest.findMany({
      orderBy: { lastName: "asc" },
    });
    res.json(guests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/guests
app.post("/api/guests", async (req, res) => {
  try {
    const guest = await prisma.guest.create({ data: req.body });
    res.status(201).json(guest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── RESERVAS ────────────────────────────────────────────

// GET /api/reservations
app.get("/api/reservations", async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        hotel: true,
        guest: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/reservations/:id
app.get("/api/reservations/:id", async (req, res) => {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { hotel: true, guest: true },
    });
    if (!reservation)
      return res.status(404).json({ error: "Reserva no encontrada" });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/reservations
app.post(
  "/api/reservations",
  [
    body("hotelId").isInt(),
    body("guestId").isInt(),
    body("checkIn").isISO8601(),
    body("checkOut").isISO8601(),
    body("guestsCount").isInt({ min: 1 }),
    body("totalPrice").isDecimal(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const reservation = await prisma.reservation.create({
        data: req.body,
        include: { hotel: true, guest: true },
      });
      res.status(201).json(reservation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);

// PUT /api/reservations/:id
app.put("/api/reservations/:id", async (req, res) => {
  try {
    const reservation = await prisma.reservation.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
      include: { hotel: true, guest: true },
    });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/reservations/:id
app.delete("/api/reservations/:id", async (req, res) => {
  try {
    await prisma.reservation.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Reserva eliminada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── ESTADÍSTICAS ────────────────────────────────────────

// GET /api/stats
app.get("/api/stats", async (req, res) => {
  try {
    const [totalHotels, totalGuests, totalReservations, activeReservations] =
      await Promise.all([
        prisma.hotel.count(),
        prisma.guest.count(),
        prisma.reservation.count(),
        prisma.reservation.count({
          where: { status: { in: ["CONFIRMED", "CHECKED_IN"] } },
        }),
      ]);

    const revenue = await prisma.reservation.aggregate({
      _sum: { totalPrice: true },
      where: { status: { not: "CANCELLED" } },
    });

    res.json({
      totalHotels,
      totalGuests,
      totalReservations,
      activeReservations,
      totalRevenue: revenue._sum.totalPrice || 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
