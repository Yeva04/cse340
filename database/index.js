const { Pool } = require("pg")
require("dotenv").config()

/* ***************
 * Connection Pool
 * Works both locally and on Render (with SSL)
 * *************** */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,              // Force SSL
    rejectUnauthorized: false,  // Accept self-signed certs
  },
})

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
