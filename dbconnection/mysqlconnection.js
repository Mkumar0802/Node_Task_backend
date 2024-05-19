const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: "162.241.123.158",
  user: "theatgg6_shg",
  password: "r3pbWhs8psb5nitZjlpDvg",
  database: "theatgg6_testnode",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to database.');
    connection.release(); // release connection back to the pool
  } catch (err) {
    console.error('Database connection failed:', err.stack);
  }
})();

module.exports = pool;
