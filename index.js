const multer = require("multer");
const path = require("path");
const express = require("express");
const cors = require("cors");
const db = require("./db");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});


const upload = multer({ storage });

const app = express();
const fs = require("fs");
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.post("/api/upload", upload.single("video"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({
    url: `https://corner-forge-backend.onrender.com/uploads/${req.file.filename}`
  });
});

/* =========================
   GET MATCHES
========================= */
app.get("/api/matches", (req, res) => {
  try {
    const matches = db.prepare("SELECT * FROM matches").all();
    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

/* =========================
   ADD MATCH
========================= */
app.post("/api/matches", (req, res) => {
  try {
    const { name } = req.body;

    const result = db
      .prepare("INSERT INTO matches (name) VALUES (?)")
      .run(name);

    res.json({
      id: result.lastInsertRowid,
      name
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

/* =========================
   DELETE MATCH
========================= */
app.delete("/api/matches/:id", (req, res) => {
  try {
    const id = req.params.id;

    // 1. lekérjük a corner-eket
    const corners = db
      .prepare("SELECT id FROM corners WHERE matchId = ?")
      .all(id);

    // 2. töröljük a hozzájuk tartozó notes + videos
    for (let c of corners) {
      db.prepare("DELETE FROM notes WHERE cornerId = ?").run(c.id);
      db.prepare("DELETE FROM videos WHERE cornerId = ?").run(c.id);
    }

    // 3. töröljük a corner-eket
    db.prepare("DELETE FROM corners WHERE matchId = ?").run(id);

    // 4. töröljük a match-et
    db.prepare("DELETE FROM matches WHERE id = ?").run(id);

    res.json({ success: true });

  } catch (err) {
    console.error("DELETE MATCH ERROR:", err);
    res.status(500).json({ error: "DB error" });
  }
});

/* =========================
   GET SINGLE MATCH
========================= */
app.get("/api/matches/:id", (req, res) => {
  try {
    const matchId = req.params.id;

    const match = db
      .prepare("SELECT * FROM matches WHERE id = ?")
      .get(matchId);

    const corners = db
      .prepare("SELECT * FROM corners WHERE matchId = ?")
      .all(matchId);

    res.json({
      ...match,
      corners: corners || []
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

/* =========================
   GET NOTES
========================= */
app.get("/api/corners/:id/notes", (req, res) => {
  try {
    const rows = db
      .prepare("SELECT * FROM notes WHERE cornerId = ?")
      .all(req.params.id);

    res.json(rows || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

/* =========================
   ADD NOTE
========================= */
app.post("/api/corners/:id/notes", (req, res) => {
  try {
    const { text } = req.body;

    const result = db
      .prepare("INSERT INTO notes (cornerId, text) VALUES (?, ?)")
      .run(req.params.id, text);

    res.json({
      id: result.lastInsertRowid,
      text
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

/* =========================
   DELETE NOTE
========================= */
app.delete("/api/corners/:id/notes/:noteId", (req, res) => {
  try {
    db.prepare("DELETE FROM notes WHERE id = ?").run(req.params.noteId);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

/* =========================
   GET VIDEOS
========================= */
app.get("/api/corners/:id/videos", (req, res) => {
  try {
    const rows = db
      .prepare("SELECT * FROM videos WHERE cornerId = ?")
      .all(req.params.id);

    res.json(rows || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

/* =========================
   ADD VIDEO
========================= */
app.post("/api/corners/:id/videos", (req, res) => {
  try {
    const { url } = req.body;

    const result = db
      .prepare("INSERT INTO videos (cornerId, url) VALUES (?, ?)")
      .run(req.params.id, url);

    res.json({
      id: result.lastInsertRowid,
      url
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

/* =========================
   DELETE VIDEO
========================= */
app.delete("/api/corners/:id/videos/:videoId", (req, res) => {
  try {
    db.prepare("DELETE FROM videos WHERE id = ?").run(req.params.videoId);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

/* =========================
   ADD CORNER
========================= */
app.post("/api/matches/:id/corners", (req, res) => {
  try {
    const matchId = req.params.id;
    const c = req.body;

    const result = db.prepare(`
      INSERT INTO corners
      (matchId, name, side, type, delivery, playersInBox, playersOutBox, firstContact, firstContactZone, finishingZone, blockers, secondBall, outcome, kicker)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
  matchId,
  c.name || "",
  c.side || "",
  c.type || "",
  c.delivery || "",
  c.playersInBox || 0,
  c.playersOutBox || 0,
  c.firstContact || "",
  c.firstContactZone || 0,
  c.finishingZone || 0,
  c.blockers ? 1 : 0,
  c.secondBall ? 1 : 0,
  c.outcome || "",
  c.kicker || ""
);

    res.json({
      id: result.lastInsertRowid,
      ...c
    });

  } catch (err) {
    console.error("CORNER ERROR:", err); // 🔥 EZ FONTOS
    res.status(500).json({ error: "DB error" });
  }
});

/* =========================
   GET CORNERS (MATCH)
========================= */
app.get("/api/matches/:id/corners", (req, res) => {
  try {
    const rows = db
      .prepare("SELECT * FROM corners WHERE matchId = ?")
      .all(req.params.id);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

/* =========================
   DELETE CORNER
========================= */
app.delete("/api/matches/:matchId/corners/:cornerId", (req, res) => {
  try {
    db.prepare("DELETE FROM corners WHERE id = ?").run(req.params.cornerId);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

/* =========================
   SAVE SUMMARY
========================= */
app.post("/api/matches/:id/summary", (req, res) => {
  try {
    const { general, attacking, defensive, players } = req.body;
    const matchId = req.params.id;

    db.prepare(`
      UPDATE matches 
      SET general=?, attacking=?, defensive=?, players=? 
      WHERE id=?
    `).run(general, attacking, defensive, players, matchId);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

/* =========================
   GET SUMMARY
========================= */
app.get("/api/matches/:id/summary", (req, res) => {
  try {
    const matchId = req.params.id;

    const row = db
      .prepare("SELECT general, attacking, defensive, players FROM matches WHERE id=?")
      .get(matchId);

    res.json(row || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

/* =========================
   GET ALL CORNERS
========================= */
app.get("/api/corners", (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM corners").all();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

/* =========================
   FAVORITE TOGGLE
========================= */
app.post("/api/corners/:id/favorite", (req, res) => {
  try {
    const { favorite } = req.body;

    db.prepare(
      "UPDATE corners SET favorite = ? WHERE id = ?"
    ).run(favorite ? 1 : 0, req.params.id);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

/* =========================
   BACKUP
========================= */
app.get("/api/backup", (req, res) => {
  try {
    const dbPath = path.join(__dirname, "database.sqlite");
    const backupPath = path.join(__dirname, "backup.sqlite");

    fs.copyFileSync(dbPath, backupPath);

    res.download(backupPath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Backup error" });
  }
});

/* =========================
   ROOT
========================= */
app.get("/", (req, res) => {
  res.send("API running");
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("SERVER RUNNING ON", PORT);
});