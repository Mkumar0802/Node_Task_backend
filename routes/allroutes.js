const express = require('express'); // import express
const app = express(); // create an instance of express
app.use(express.json());
const router = express.Router(); // create an instance of the router




//const usercontroller =  require("../controller/user")
// const patientcontroller = require("../controller/patientCRUD" );
const bikecontroller = require("../controller/BikeController")
// const { route } = require(".");

// router.post("/signup", usercontroller.signup)
// router.post("/signin", usercontroller.signin)
// router.post("/forget", usercontroller.forgetPassword)
// router.post("/reset",usercontroller.resetPassword)
// router.post("/token",usercontroller.token)



// router.post("/patients",patientcontroller.createPatient)
// router.get("/patients/:patientId",patientcontroller.getPatientById)
// router.put("/updatepatients/:patientId", patientcontroller.updatePatient)
// router.delete('/patients/:patientId',patientcontroller.deletePatient)


router.post('/loginkmk',bikecontroller.login)
router.post("/start",bikecontroller.startAssembly);
router.post("/end",bikecontroller.endAssembly)
router.get('/bikes-assembled',bikecontroller.getBikesAssembled);
router.get('/employee-production',bikecontroller.getEmployeeProduction);
router.get ('/assemblydata',bikecontroller.assemblydata)

module.exports = router