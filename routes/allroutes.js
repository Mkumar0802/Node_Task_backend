const app = require("express"); //import express
const router = app.Router();


const usercontroller =  require("../controller/user")

router.post("/signup", usercontroller.signup)
router.post("/signin", usercontroller.signin)
router.post("/forget", usercontroller.forgetPassword)
router.post("/reset",usercontroller.resetPassword)
router.post("/token",usercontroller.token)
module.exports = router