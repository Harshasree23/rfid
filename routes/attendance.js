const express = require('express');
const { markAttendance, singleAttendance, groupAttendance } = require('../controllers/attendance');
const authMiddleware = require('../middleware/authenticate');


const attendaceRouter = express.Router();

attendaceRouter.post('/mark' , markAttendance);

attendaceRouter.get('/single' , authMiddleware , singleAttendance);

attendaceRouter.get('/group' ,  authMiddleware , groupAttendance);

module.exports = {
    attendaceRouter,
}