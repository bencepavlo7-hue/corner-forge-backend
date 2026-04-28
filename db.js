const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.sqlite");

// Táblák létrehozása
db.serialize(() => {
  // MATCHES
  db.run(`
    CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      general TEXT,
      attacking TEXT,
      defensive TEXT,
      players TEXT
    )
  `);

  // NOTES
  db.run(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cornerId INTEGER,
    text TEXT
  )
`);

  // VIDEOS
  db.run(`
  CREATE TABLE IF NOT EXISTS videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cornerId INTEGER,
    url TEXT
  )
`);

  // 🔥 CORNERS (EZ HIÁNYZOTT)
  db.run(`
    CREATE TABLE IF NOT EXISTS corners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      matchId INTEGER,
      side TEXT,
      type TEXT,
      delivery TEXT,
      playersInBox INTEGER,
      playersOutBox INTEGER,
      firstContact TEXT,
      firstContactZone INTEGER,
      finishingZone INTEGER,
      blockers INTEGER,
      secondBall INTEGER,
      outcome TEXT,
      kicker TEXT
    )
  `);
});
module.exports = db;