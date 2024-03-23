var mysql = require("mysql");




const config = {
  mysql_pool: mysql.createPool({
    host: "sql6.freemysqlhosting.net", // Your MySQL host IP address
    user: "sql6693612", // Your MySQL username
    password: "LVnIcRn1rc", // Your MySQL password
    database: "sql6693612" // Your MySQL database name
  })
};

module.exports = config;
