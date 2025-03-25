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

app.use(cors({
    origin: allowedOrigins,   // Let CORS handle it
    credentials: true,        // Allows cookies/auth headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"]
}));

// Fix preflight CORS issues
app.options("*", cors()); 


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
