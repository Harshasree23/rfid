const express = require("express");
const { logout } = require("../controllers/logout");

const logoutRouter = express.Router();


logoutRouter.get("/" , logout);

module.exports = {
    logoutRouter,
}