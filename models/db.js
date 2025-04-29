const Database = require('better-sqlite3');
const db = new Database('techmania.db');
module.exports = db;