const { Pool } = require("pg")
require("dotenv").config()

let pool

try {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false } // Render environment
        : false,                        // Local environment
  })
  console.log("✅ Database pool created successfully")
} catch (err) {
  console.error("❌ Error creating database pool", err)
}

// For querying
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
