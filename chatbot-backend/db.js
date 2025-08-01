// db.js
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "chatbot_db",
  password: "shruti123",
  port: 5432,
});

module.exports = pool;
