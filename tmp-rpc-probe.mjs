// Temporary write-path probe: calls the real server functions over HTTP the way
// the browser does (seroval-encoded payload + same-origin headers), then reads
// the rows straight out of MySQL to prove the writes landed.
import { toJSONAsync } from "seroval";
import mysql from "mysql2/promise";

const BASE = "http://localhost:8080";
const idsRaw = await (await import("node:fs/promises")).readFile("tmp-ids.json", "utf8");
const ids = JSON.parse(idsRaw.replace(/^\uFEFF/, ""));

async function callServerFn(functionId, data, cookie) {
  const body = JSON.stringify(await toJSONAsync({ data }));
  const res = await fetch(`${BASE}/_serverFn/${functionId}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-tsr-serverFn": "true",
      origin: BASE,
      ...(cookie ? { cookie } : {}),
    },
    body,
  });
  return {
    status: res.status,
    text: (await res.text()).slice(0, 300),
    setCookie: res.headers.get("set-cookie"),
  };
}

const enrollment = {
  name: "RPC Probe Student",
  email: "rpc-probe@example.com",
  phone: "03001234567",
  course: "Probe Course",
  level: "Matric",
  note: "written by tmp-rpc-probe",
};

const enrRes = await callServerFn(ids.submitEnrollment, enrollment);
console.log("submitEnrollment", enrRes.status, enrRes.text);

const msgRes = await callServerFn(ids.submitMessage, {
  name: "RPC Probe Visitor",
  email: "rpc-probe-msg@example.com",
  subject: "Probe subject",
  message: "written by tmp-rpc-probe",
});
console.log("submitMessage", msgRes.status, msgRes.text);

// Unauthenticated admin mutation must be rejected.
const guarded = await callServerFn(ids.createRow, {
  key: "courses",
  data: { title: "Should never persist" },
});
console.log("createRow (no session)", guarded.status, guarded.text);

const conn = await mysql.createConnection({
  host: process.env.DB_HOSTS,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectTimeout: 8000,
});

// Submissions are stored as JSON blobs, so match on the extracted email.
const [enrRows] = await conn.query(
  "SELECT id, JSON_UNQUOTE(JSON_EXTRACT(`data`, '$.name')) AS name, JSON_UNQUOTE(JSON_EXTRACT(`data`, '$.course')) AS course, JSON_UNQUOTE(JSON_EXTRACT(`data`, '$.status')) AS status FROM enrollments WHERE JSON_UNQUOTE(JSON_EXTRACT(`data`, '$.email')) = ?",
  [enrollment.email],
);
console.log("DB enrollments:", JSON.stringify(enrRows));

const [msgRows] = await conn.query(
  "SELECT id, JSON_UNQUOTE(JSON_EXTRACT(`data`, '$.name')) AS name, JSON_UNQUOTE(JSON_EXTRACT(`data`, '$.subject')) AS subject FROM messages WHERE JSON_UNQUOTE(JSON_EXTRACT(`data`, '$.email')) = ?",
  ["rpc-probe-msg@example.com"],
);
console.log("DB messages:", JSON.stringify(msgRows));

const [[courseGuard]] = await conn.query(
  "SELECT COUNT(*) AS n FROM content_rows WHERE JSON_UNQUOTE(JSON_EXTRACT(`data`, '$.title')) = 'Should never persist'",
);
console.log("DB unauthorised rows:", courseGuard.n);

// Clean up probe rows so the client's data stays pristine.
await conn.query("DELETE FROM enrollments WHERE JSON_UNQUOTE(JSON_EXTRACT(`data`, '$.email')) = ?", [
  enrollment.email,
]);
await conn.query("DELETE FROM messages WHERE JSON_UNQUOTE(JSON_EXTRACT(`data`, '$.email')) = ?", [
  "rpc-probe-msg@example.com",
]);
console.log("cleanup done");

await conn.end();
