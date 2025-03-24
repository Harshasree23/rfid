const express = require("express");
const { personRouter } = require("./person");
const { loginRouter } = require("./login");
const { logoutRouter } = require("./logout");
const { paymentRouter } = require("./payment");
const { attendaceRouter } = require("./attendance");
const { autologin } = require("../controllers/login");
const { getId } = require("../services/getId");
const authMiddleware = require("../middleware/authenticate");
const { sendMail } = require("../services/sendMail");

const baseRouter = express.Router();

baseRouter.use( '/person' ,  authMiddleware , personRouter );

baseRouter.use( '/login' , loginRouter );

baseRouter.use( '/logout' , logoutRouter );

baseRouter.use( '/auto-login', autologin );

baseRouter.use('/payment' , paymentRouter);

baseRouter.use( '/getUserId' , getId );

baseRouter.use('/send-mail' , sendMail);

baseRouter.use('/attendance' , attendaceRouter);


module.exports = {
    baseRouter,
}