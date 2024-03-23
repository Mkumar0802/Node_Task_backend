// patientModel.js

const { Sequelize, DataTypes } = require('sequelize'); // Import Sequelize

// Assuming you already have your sequelize connection initialized
// Assuming you already have your sequelize connection initialized
const sequelize = new Sequelize('sql6693612', 'sql6693612', 'LVnIcRn1rc', {
  host: 'sql6.freemysqlhosting.net',
  dialect: 'mysql'
});


// const db = require('../dbconnection/mysqlconnection');


const Patient = sequelize.define('Patient', {
    patientId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    patientVitals: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    tableName: 'patients',
    timestamps: true // Enable timestamps
  });
  
  (async () => {
    await Patient.sync({ alter: true });
    console.log("Patient model synced with database");
  })();
  
  module.exports = Patient;