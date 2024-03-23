// patientCRUD.js
const cron = require('node-cron');
const Patient = require('../model/patientModel'); // Import the Patient model

const PatientLog = require('../model/patientLogModel');

// Create operation
async function createPatient(req,res) {
    try {
        const { patientId, patientVitals } = req.body; // Assuming patientId and patientVitals are provided in the request body
        const patient = await Patient.create({ patientId, patientVitals }); // Create a new patient record
        res.status(201).json(patient); // Send the created patient as JSON response
      } catch (error) {
        res.status(400).json({ error: error.message }); // Handle errors
      }
}

// Read operation
async function getPatientById(req, res) {
  const { patientId } = req.params;

  try {
    // Find the patient by ID
    const patient = await Patient.findByPk(patientId);

    // If patient not found, send a 404 response
    if (!patient) {
      return res.status(404).json({ error: `Patient with ID ${patientId} not found` });
    }

    // If patient found, send the patient data in the response
    res.status(200).json(patient);
    console.log(`Patient with ID ${patientId} fetched successfully`);
  } catch (error) {
    // If any error occurs during the process, send a 500 response with the error message
    res.status(500).json({ error: `Error fetching patient: ${error.message}` });
  }
}



// Function to update a patient
async function updatePatient(req, res) {
  try {
      const { patientId } = req.params; // Get the patient ID from the request URL
      const newData = req.body; // Assuming all the updated data is sent in the request body

      // Find the patient and update it with new data
      const [updated] = await Patient.update(newData, {
          where: { patientId: patientId }
      });

      if (updated) {
          const updatedPatient = await Patient.findByPk(patientId);

        // Create a log entry
    await PatientLog.create({
      patientId: patientId,
      action: 'update',
      timestamp: new Date()
    });



          return res.status(200).json({ patient: updatedPatient });
      } else {
          throw new Error('Patient not found');
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
  }
}





// Delete operation
async function deletePatient(req, res) {
  try {
    const { patientId } = req.params; // Extract patientId from request parameters
    
    // Make sure patientId is valid
    if (!patientId) {
      return res.status(400).json({ error: 'Patient ID is required for deletion' });
    }

    // Find the patient record by ID
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ error: `Patient with ID ${patientId} not found` });
    }

    console.log(`Deleting patient with ID ${patientId}...`);

    // Create a log entry
    await PatientLog.create({
      patientId: patientId,
      action: 'delete',
      timestamp: new Date()
    });

    // Delete the patient record
    await patient.destroy();

    console.log(`Patient with ID ${patientId} deleted successfully`);
    return res.status(200).json({ message: `Patient with ID ${patientId} deleted successfully` });
  } catch (error) {
    return res.status(500).json({ error: `Error deleting patient: ${error.message}` });
  }
}






const cronPatient = async () => {
  console.log('Running cron job...');
  try {
    // Fetch all patients
    const patients = await Patient.findAll();

    // Update patientVisits for each patient
    for (const patient of patients) {
      const updatedPatient = await patient.update({
        patientVisits: patient.patientVisits + 1
      });

      // Log the update in PatientLog
      await PatientLog.create({
        patientId: updatedPatient.patientId,
        action: 'visit',
        timestamp: new Date()
      });

      console.log(`Patient with ID ${updatedPatient.patientId} visits updated`);
    }
  } catch (error) {
    console.error('Error updating patient visits:', error.message);
  }
}

// Define a CRON job that runs every 2 minutes
cron.schedule('1 * * * *', cronPatient);

console.log('CRON job scheduled to run every 60 minutes');










module.exports = {
  createPatient,
  getPatientById,
  updatePatient,
  deletePatient
};
