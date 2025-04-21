// imports
const express = require('express');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const portfinder = require('portfinder');
const { makeConnection } = require('./connect');
const { baseRouter } = require('./routes/base');
require('dotenv').config();
const { Server } = require("socket.io");
const http = require("http");


// for attendance daily
require("./services/cronJons"); // Ensures the cron job runs daily


// creating an app
const app = express();

// connecting to database
makeConnection("rfid").then( () => console.log("Connected to database") );

// middlewares

const allowedOrigins = [
    "https://rfid-frontend-gold.vercel.app",  // Deployed frontend
    "http://localhost:3000"                   // Local development
];

const corsOptions = (req, res, next) => {
    if (allowedOrigins.includes(req.get('Origin'))) {
        // Web request from valid frontend origin
        cors({
            origin: allowedOrigins,  // Dynamically set the origin
            credentials: true,           // Allow credentials for frontend
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"]
        })(req, res, next);
    } else if (!req.get('Origin')) {
        // Handle requests from ESP8266 (without Origin header)
        cors({
            origin: "*",  // Allow all origins for ESP8266
            credentials: false,  // No need for credentials for ESP8266
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"]
        })(req, res, next);
    } else {
        // Fallback in case the origin doesn't match allowed origins
        res.status(403).send("Forbidden");
    }
};

// Apply the CORS middleware globally for all routes
app.use(corsOptions);



app.use( express.json() );
app.use( express.urlencoded({ extended : false  }) );
app.use( cookieParser() );
// app.use( rfidMiddleware );


// Creating an HTTP server
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["https://rfid-frontend-gold.vercel.app", "http://localhost:3000"], // Ensure this matches your frontend
        methods: ["GET", "POST"]
    }
});

// Attach `io` to the Express app
app.set("io", io);

// Load WebSocket handler
require("./socket/socketHandler")(io);

// routes
const rfidRoutes = require("./routes/rfid")(io);
app.use('/scan' , rfidRoutes);
app.use('/' , baseRouter );

// port
portfinder.basePort = 3000;
portfinder.getPort((err, port) => {
    if (err) {
        console.error('Error finding a free port:', err);
    } else {
        server.listen(port, () => {
        console.log(`Server listening on port ${port}`);
        });
    }
});
