const express = require("express");
const { getUsers, addUser, update } = require("../controllers/person");

const personRouter = express.Router();

personRouter.get('/', getUsers );
personRouter.post('/', addUser );
personRouter.patch('/' , update);

module.exports = {
    personRouter,
}