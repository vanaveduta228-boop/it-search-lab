const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS courses (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, category TEXT, duration TEXT, desc TEXT)");
});

app.get('/api/courses', (req, res) => {
    db.all("SELECT * FROM courses", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/courses', (req, res) => {
    const { name, category, duration, desc } = req.body;
    const sql = "INSERT INTO courses (name, category, duration, desc) VALUES (?, ?, ?, ?)";
    
    db.run(sql, [name, category, duration, desc], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, id: this.lastID, message: "Курс успішно збережено в базі!" });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер працює! Відкрий: http://localhost:${PORT}`);
});