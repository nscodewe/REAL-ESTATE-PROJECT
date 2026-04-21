import mysql from "mysql2/promise"

export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "neha@S13", 
  database: "crm_db",
})