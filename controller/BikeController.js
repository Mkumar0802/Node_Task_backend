const db = require('../dbconnection/mysqlconnection')
const pool = require('../dbconnection/mysqlconnection');
const mysql = require('mysql2/promise');
const express = require('express');
const app = express();



// var conn = mysql.createConnection({
//     host:"162.241.123.158",
//     user:"theatgg6_shg",
// 	  password:"r3pbWhs8psb5nitZjlpDvg",
//     database: "theatgg6_testnode"
// });

//   conn.connect((err) => {
//     if (err) {
//       console.error("Error connecting to MySQL: " + err.stack);
//       return;
//     }
//     console.log("Connected to MySQL as id " + conn.threadId);
//   });





const startAssembly = async (req, res) => {
    const { employeeId, bikeNumber } = req.body;
    const assemblyTimes = { 1: 50, 2: 60, 3: 80 }; // Static times for bike assemblies
    const assemblyTime = assemblyTimes[bikeNumber];

    if (!assemblyTime) {
        return res.status(400).json({ status: 'error', message: 'Invalid bike number' });
    }

    const query = 'INSERT INTO assembly_sessions (employee_id, bike_number, assembly_time, assembly_date, start_time) VALUES (?, ?, ?, CURDATE(), NOW())';


    try {
        const [result] = await db.execute(query, [employeeId, bikeNumber, assemblyTime]);
        res.json({ status: 'success', sessionId: result.insertId });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ status: 'error', message: 'Database error' });
    }
};


const endAssembly = async (req, res) => {
    const { sessionId } = req.body;

    if (!sessionId) {
        return res.status(400).json({ status: 'error', message: 'Invalid session ID' });
    }

    const query = 'UPDATE assembly_sessions SET end_time = NOW() WHERE session_id = ?';

    try {
        const [result] = await db.execute(query, [sessionId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ status: 'error', message: 'Session not found' });
        }
        res.json({ status: 'success', message: 'Assembly session ended' });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ status: 'error', message: 'Database error' });
    }
};




const getBikesAssembled = async (req, res) => {
    const { from, to } = req.query;
    
    const query = `
    SELECT assembly_date, COUNT(*) as count
    FROM assembly_sessions
    WHERE assembly_date BETWEEN ? AND ?
    GROUP BY assembly_date;
  `;
   
    
    try {
        const [results] = await db.execute(query, [from, to]);
        res.json({ status: 'success', production: results });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ status: 'error', message: 'Database error' });
    }
};

const getEmployeeProduction = async (req, res) => {
    const { date } = req.query;

    const query = `
        SELECT employee_id, COUNT(*) as count 
        FROM assembly_sessions 
        WHERE assembly_date = ? 
        GROUP BY employee_id`;

    try {
        const [results] = await db.execute(query, [date]);
        res.json({ status: 'success', production: results });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ status: 'error', message: 'Database error' });
    }
};


const login = async (req, res) => {
    const { username, password } = req.body;
    console.log("Request body:", req.body);
  
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }
  
    console.log("Username:", username, "Password:", password);
  
    const query = 'SELECT * FROM employees WHERE username = ? AND password = ?';
  
    try {
      const [results] = await pool.query(query, [username, password]);
      console.log("Query results:", results);
  
      if (results.length > 0) {
        res.json({ success: true, employee: results[0] });
      } else {
        res.status(401).json({ success: false, message: 'Invalid username or password' });
      }
    } catch (err) {
      console.error('Database query failed:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };





module.exports = {
    login,
    endAssembly,
    startAssembly,
    getBikesAssembled,
    getEmployeeProduction


  };