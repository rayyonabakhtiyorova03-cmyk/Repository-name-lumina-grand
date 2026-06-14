const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Helper: generate demo date strings relative to today
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
    },
    {
        id: "LG-9042",
        name: "Jane Smith",
        room: "skyline",
        checkIn: offsetDate(15),
        checkOut: offsetDate(18),
        nights: 3,
        total: 1740,
        status: "Pending"
    },
    {
        id: "LG-7210",
        name: "John Doe",
        room: "garden-vista",
        checkIn: offsetDate(-10),
        checkOut: offsetDate(-7),
        nights: 3,
        total: 960,
        status: "Confirmed"
    },
    {
        id: "LG-6511",
        name: "John Doe",
        room: "heritage",
        checkIn: offsetDate(5),
        checkOut: offsetDate(7),
        nights: 2,
        total: 560,
        status: "Cancelled"
    }
];

// GET /bookings — return all bookings
app.get("/bookings", (req, res) => {
    res.json(bookings);
});

// POST /bookings — create a new booking
app.post("/bookings", (req, res) => {
    const booking = req.body;
    bookings.push(booking);
    res.status(201).json({ success: true, message: "Booking created", booking });
});

// PUT /bookings/:id — update booking status (approve / reject)
app.put("/bookings/:id", (req, res) => {
    const booking = bookings.find(b => b.id === req.params.id);
    if (!booking) {
        return res.status(404).json({ success: false, message: "Booking not found" });
    }
    // Only allow updating fields sent in the body
    Object.assign(booking, req.body);
    res.json({ success: true, message: "Booking updated", booking });
});

// DELETE /bookings/:id — permanently remove a booking
app.delete("/bookings/:id", (req, res) => {
    const before = bookings.length;
    bookings = bookings.filter(b => b.id !== req.params.id);
    if (bookings.length === before) {
        return res.status(404).json({ success: false, message: "Booking not found" });
    }
    res.json({ success: true, message: "Booking deleted" });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});




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

    res.json({
        success: true,
        user
    });
});