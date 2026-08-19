// Temporary read-path probe: proves SSR renders values coming from MySQL.
// Flips one settings field, fetches the homepage, then restores the original.
import mysql from "mysql2/promise";

const conn = await mysql.createConnection({
  host: process.env.DB_HOSTS,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectTimeout: 8000,
});

const [[row]] = await conn.query("SELECT `value` FROM content_docs WHERE `key` = 'settings'");
const original = row.value;
const settings = JSON.parse(original);
console.log("SETTINGS KEYS", Object.keys(settings).join(","));

const marker = "DB-PROBE-" + Date.now();
const probed = { ...settings, instituteName: marker };
await conn.query("UPDATE content_docs SET `value` = ? WHERE `key` = 'settings'", [
  JSON.stringify(probed),
]);

const html = await (await fetch("http://localhost:8080/")).text();
console.log("MARKER_IN_SSR", html.includes(marker));

await conn.query("UPDATE content_docs SET `value` = ? WHERE `key` = 'settings'", [original]);
const restored = await (await fetch("http://localhost:8080/")).text();
console.log("MARKER_AFTER_RESTORE", restored.includes(marker));

await conn.end();
