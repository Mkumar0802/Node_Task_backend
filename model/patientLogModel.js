// patientLogModel.js

const { Sequelize, DataTypes } = require('sequelize'); 
// const db = require('../dbconnection/mysqlconnection');

// Assuming you already have your sequelize connection initialized
const sequelize = new Sequelize('sql6693612', 'sql6693612', 'LVnIcRn1rc', {
  host: 'sql6.freemysqlhosting.net',
  dialect: 'mysql'
});


const PatientLog = sequelize.define('PatientLog', {
  patientId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'patient_logs', // Ensure the table name matches your database
  timestamps: false // Disable timestamps for this model if not needed
});

// Sync the model with the database
PatientLog.sync({ alter: true })
  .then(() => {
    console.log("PatientLog model synced with database");
  })
  .catch(error => {
    console.error("Error syncing PatientLog model:", error);
  });


module.exports = PatientLog;
