const app = require("express"); //import express
const router = app.Router();


const usercontroller =  require("../controller/user")
const patientcontroller = require("../controller/patientCRUD" );
const { route } = require(".");

router.post("/signup", usercontroller.signup)
router.post("/signin", usercontroller.signin)
router.post("/forget", usercontroller.forgetPassword)
router.post("/reset",usercontroller.resetPassword)
router.post("/token",usercontroller.token)



router.post("/patients",patientcontroller.createPatient)
router.get("/patients/:patientId",patientcontroller.getPatientById)
router.put("/patients/:patientId",patientcontroller.updatePatient)
router.delete('/patients/:patientId',patientcontroller.deletePatient)





module.exports = router