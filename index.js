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
const allowedOrigins = ["https://your-vercel-app.vercel.app"];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    }
}));

app.use( express.json() );
app.use( express.urlencoded({ extended : false  }) );
app.use( cookieParser() );
// app.use( rfidMiddleware );


// Creating an HTTP server
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3001", // Ensure this matches your frontend
        methods: ["GET", "POST"]
    }
});

// Attach `io` to the Express app
app.set("io", io);

// Load WebSocket handler
require("./socket/socketHandler")(io);

// routes
const rfidRoutes = require("./routes/rfid")(io);
app.use('/' , baseRouter );
app.use('/scan' , rfidRoutes);

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
