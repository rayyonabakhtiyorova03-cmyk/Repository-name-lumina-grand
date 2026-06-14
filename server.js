const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// =====================
// BOOKINGS
// =====================

function offsetDate(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
}

let bookings = [
    {
        id: "LG-8821",
        name: "John Doe",
        room: "deluxe-ocean",
        checkIn: offsetDate(-1),
        checkOut: offsetDate(3),
        nights: 4,
        total: 1800,
        status: "Confirmed"
    }
];

// GET
app.get("/bookings", (req, res) => {
    res.json(bookings);
});

// POST
app.post("/bookings", (req, res) => {
    const booking = req.body;
    bookings.push(booking);
    res.json({ success: true, booking });
});

// PUT
app.put("/bookings/:id", (req, res) => {
    const booking = bookings.find(b => b.id === req.params.id);
    if (!booking) return res.status(404).json({ error: "Not found" });

    Object.assign(booking, req.body);
    res.json({ success: true, booking });
});

// DELETE
app.delete("/bookings/:id", (req, res) => {
    bookings = bookings.filter(b => b.id !== req.params.id);
    res.json({ success: true });
});

// =====================
// USERS
// =====================

let users = [];

app.post('/register', (req, res) => {
    users.push(req.body);
    res.json({ success: true });
});

app.post('/login', (req, res) => {
    const user = users.find(
        u => u.email === req.body.email &&
             u.password === req.body.password
    );

    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }

    res.json({ success: true, user });
});

// =====================
// FRONTEND ROUTE
// =====================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// =====================
// START SERVER
// =====================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
