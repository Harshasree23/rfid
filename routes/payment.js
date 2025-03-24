const express = require("express");
const { payAmount, addAmount, getHistory } = require("../controllers/payment");

const paymentRouter = express.Router();

paymentRouter.post( '/pay' , payAmount );
paymentRouter.post( '/add' , addAmount );
paymentRouter.get( '/history' , getHistory );

module.exports = {
    paymentRouter,
} 