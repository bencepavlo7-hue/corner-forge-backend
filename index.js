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
    if (err) return res.status(500).json(err);

    const promises = matches.map(match => {
      return new Promise((resolve) => {
        db.all("SELECT * FROM notes WHERE matchId = ?", [match.id], (err, notes) => {
          db.all("SELECT * FROM videos WHERE matchId = ?", [match.id], (err, videos) => {
            resolve({
              ...match,
              notes: notes || [],
              videos: videos || []
            });
          });
        });
      });
    });

    Promise.all(promises).then(result => res.json(result));
  });
});

/* =========================
   ADD MATCH
========================= */
app.post("/api/matches", (req, res) => {
  const { name } = req.body;

  db.run(
    "INSERT INTO matches (name) VALUES (?)",
    [name],
    function (err) {
      if (err) return res.status(500).json(err);

      res.json({
        id: this.lastID,
        name
      });
    }
  );
});

/* =========================
   DELETE MATCH
========================= */
app.delete("/api/matches/:id", (req, res) => {
  const id = req.params.id;

  db.run("DELETE FROM matches WHERE id = ?", [id]);
  db.run("DELETE FROM notes WHERE matchId = ?", [id]);
  db.run("DELETE FROM videos WHERE matchId = ?", [id]);

  res.json({ success: true });
});
/* =========================
   GET SINGLE MATCH
========================= */
app.get("/api/matches/:id", (req, res) => {
  const matchId = req.params.id;

  db.get("SELECT * FROM matches WHERE id = ?", [matchId], (err, match) => {
    if (err) return res.status(500).json(err);
    if (!match) return res.status(404).json({ error: "Match not found" });

    db.all("SELECT * FROM corners WHERE matchId = ?", [matchId], (err, corners) => {
      res.json({
        ...match,
        corners: corners || []
      });
    });
  });
});

/* =========================
   ADD NOTE
========================= */
// GET NOTES (cornerhez)
app.get("/api/corners/:id/notes", (req, res) => {
  db.all(
    "SELECT * FROM notes WHERE cornerId = ?",
    [req.params.id],
    (err, rows) => {
      if (err) {
        console.log("DB ERROR:", err);
        return res.status(500).json({ error: "DB error" });
      }

      res.json(rows || []);
    }
  );
});

// ADD NOTE (cornerhez)
app.post("/api/corners/:id/notes", (req, res) => {
  const { text } = req.body;

  db.run(
    "INSERT INTO notes (cornerId, text) VALUES (?, ?)",
    [req.params.id, text],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID, text });
    }
  );
});
/* =========================
   DELETE NOTE
========================= */
app.delete("/api/corners/:id/notes/:noteId", (req, res) => {
  db.run("DELETE FROM notes WHERE id = ?", [req.params.noteId]);
  res.json({ success: true });
});

/* =========================
   ADD VIDEO
========================= */
app.get("/api/corners/:id/videos", (req, res) => {
  db.all(
    "SELECT * FROM videos WHERE cornerId = ?",
    [req.params.id],
    (err, rows) => res.json(rows || [])
  );
});

app.post("/api/corners/:id/videos", (req, res) => {
  const { url } = req.body;

  db.run(
    "INSERT INTO videos (cornerId, url) VALUES (?, ?)",
    [req.params.id, url],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID, url });
    }
  );
});

app.delete("/api/corners/:id/videos/:videoId", (req, res) => {
  db.run("DELETE FROM videos WHERE id = ?", [req.params.videoId]);
  res.json({ success: true });
});

/* =========================
   ADD CORNER
========================= */
app.post("/api/matches/:id/corners", (req, res) => {
  const matchId = req.params.id;
  const c = req.body;

  console.log("BODY:", req.body);

  db.run(
    `INSERT INTO corners 
    (matchId, name, side, type, delivery, playersInBox, playersOutBox, firstContact, firstContactZone, finishingZone, blockers, secondBall, outcome, kicker)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      matchId,
      c.name, // 🔥 EZ HIÁNYZOTT
      c.side,
      c.type,
      c.delivery,
      c.playersInBox,
      c.playersOutBox,
      c.firstContact,
      c.firstContactZone,
      c.finishingZone,
      c.blockers ? 1 : 0,
      c.secondBall ? 1 : 0,
      c.outcome,
      c.kicker
    ],
    function (err) {
      if (err) return res.status(500).json(err);

      res.json({
        id: this.lastID,
        ...c // 🔥 itt már benne lesz a name is
      });
    }
  );
});

/* =========================
   GET CORNERS
========================= */
app.get("/api/matches/:id/corners", (req, res) => {
  const matchId = req.params.id;

  db.all(
    "SELECT * FROM corners WHERE matchId = ?",
    [matchId],
    (err, rows) => {
      if (err) return res.status(500).json(err);

      res.json(rows);
    }
  );
});

/* =========================
   DELETE CORNER
========================= */
app.delete("/api/matches/:matchId/corners/:cornerId", (req, res) => {
  db.run(
    "DELETE FROM corners WHERE id = ?",
    [req.params.cornerId],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ success: true });
    }
  );
});

/* =========================
   SAVE SUMMARY
========================= */
app.post("/api/matches/:id/summary", (req, res) => {
  const { general, attacking, defensive, players } = req.body;
  const matchId = req.params.id;

  db.run(
    `UPDATE matches 
     SET general=?, attacking=?, defensive=?, players=? 
     WHERE id=?`,
    [general, attacking, defensive, players, matchId],
    function (err) {
      if (err) return res.status(500).json(err);

      res.json({ success: true });
    }
  );
});

/* =========================
   GET SUMMARY
========================= */
app.get("/api/matches/:id/summary", (req, res) => {
  const matchId = req.params.id;

  db.get(
    "SELECT general, attacking, defensive, players FROM matches WHERE id=?",
    [matchId],
    (err, row) => {
      if (err) return res.status(500).json(err);

      res.json(row || {});
    }
  );
});
/* =========================
   GET ALL CORNERS
========================= */
app.get("/api/corners", (req, res) => {
  db.all("SELECT * FROM corners", [], (err, rows) => {
    if (err) return res.status(500).json(err);

    res.json(rows);
  });
});

app.post("/api/corners/:id/favorite", (req, res) => {
  const { favorite } = req.body;

  db.run(
    "UPDATE corners SET favorite = ? WHERE id = ?",
    [favorite ? 1 : 0, req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);

      res.json({ success: true });
    }
  );
});

app.get("/api/backup", (req, res) => {
  const dbPath = path.join(__dirname, "database.sqlite");
  const backupPath = path.join(__dirname, "backup.sqlite");

  fs.copyFileSync(dbPath, backupPath);

  res.download(backupPath);
});
/* =========================
   START SERVER
========================= */
app.get("/", (req, res) => {
  res.send("API running");
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("SERVER RUNNING ON", PORT);
});
