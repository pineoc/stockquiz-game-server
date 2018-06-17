/**
 * Created by pineoc on 2014-08-19.
 */
const mysql = require('mysql');

const pool = mysql.createPool({
  host: '****',
  user: '****',
  password: '****',
  database: '****',
  waitForConnections: false,
  connectionLimit: 100,
  queueLimit: 20,
});

module.exports.pool = pool;
