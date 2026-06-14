const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// frontend files
app.use(express.static(path.resolve(__dirname)));

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "index.html"));
});

app.get("/test", (req, res) => {
    res.send("OK SERVER WORKING");
});

let users = [];

app.post("/register", (req, res) => {
    users.push(req.body);
    res.json({ success: true });
});

app.post("/login", (req, res) => {
    const user = users.find(
        u => u.email === req.body.email &&
             u.password === req.body.password
    );

    if (!user) {
        return res.status(401).json({ success: false });
    }

    res.json({ success: true, user });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});