const Database = /* eslint-env node */
/* eslint-env node */
// server/db.js
/* eslint-env node */
const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "database.sqlite"));

db.exec(`
CREATE TABLE IF NOT EXISTS matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  general TEXT,
  attacking TEXT,
  defensive TEXT,
  players TEXT
);

CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cornerId INTEGER,
  text TEXT
);

CREATE TABLE IF NOT EXISTS videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cornerId INTEGER,
  url TEXT
);

CREATE TABLE IF NOT EXISTS corners (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  matchId INTEGER,
  name TEXT,
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
  kicker TEXT,
  favorite INTEGER DEFAULT 0
);
`);

module.exports = db;const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "database.sqlite"));

db.exec(`
CREATE TABLE IF NOT EXISTS matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  general TEXT,
  attacking TEXT,
  defensive TEXT,
  players TEXT
);

CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cornerId INTEGER,
  text TEXT
);

CREATE TABLE IF NOT EXISTS videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cornerId INTEGER,
  url TEXT
);

CREATE TABLE IF NOT EXISTS corners (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  matchId INTEGER,
  name TEXT,
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
  kicker TEXT,
  favorite INTEGER DEFAULT 0
);
`);

module.exports = db;const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "database.sqlite"));

db.exec(`
CREATE TABLE IF NOT EXISTS matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  general TEXT,
  attacking TEXT,
  defensive TEXT,
  players TEXT
);

CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cornerId INTEGER,
  text TEXT
);

CREATE TABLE IF NOT EXISTS videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cornerId INTEGER,
  url TEXT
);

CREATE TABLE IF NOT EXISTS corners (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  matchId INTEGER,
  name TEXT,
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
  kicker TEXT,
  favorite INTEGER DEFAULT 0
);
`);

module.exports = db;require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "database.sqlite"));

db.exec(`
CREATE TABLE IF NOT EXISTS matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  general TEXT,
  attacking TEXT,
  defensive TEXT,
  players TEXT
);

CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cornerId INTEGER,
  text TEXT
);

CREATE TABLE IF NOT EXISTS videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cornerId INTEGER,
  url TEXT
);

CREATE TABLE IF NOT EXISTS corners (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  matchId INTEGER,
  name TEXT,
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
  kicker TEXT,
  favorite INTEGER DEFAULT 0
);
`);

module.exports = db;