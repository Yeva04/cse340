const { Pool } = require("pg")
require("dotenv").config()

/* ***************
 * Connection Pool
 * SSL Object for production
 * Render requires SSL for PostgreSQL connections
 * *************** */
let pool

if (process.env.NODE_ENV === "production") {
  // ✅ Production: Use SSL (Render)
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })
} else {
  // ✅ Development: Use SSL too (optional for pgAdmin DBs)
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })
}

// Added for troubleshooting queries
module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params)
      console.log("executed query", { text })
      return res
    } catch (error) {
      console.error("error in query", { text, error })
      throw error
    }
  },
}
