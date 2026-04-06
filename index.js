import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";
import passport from 'passport';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import './config/passport.js';

import { authLimiter, generalLimiter } from "./middlewares/rateLimiters.js";

import adminRouter from "./routes/adminRoutes.js";
import authRouter from "./routes/authRoutes.js";
import transactionRouter from "./routes/transactionRoutes.js";
import dashboardRouter from "./routes/dashboardDataRoutes.js";


import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
const swaggerDocument = JSON.parse(fs.readFileSync('./swagger-output.json', 'utf-8'));

const app = express();
const PORT = process.env.PORT || 5000;
let server;


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors({
    origin: true, 
    credentials: true 
}));
app.set('trust proxy', 1);

app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(express.json());
app.use(ExpressMongoSanitize());
app.use(passport.initialize());

app.use('/api/zorvyn-fintech/admin', generalLimiter, adminRouter);
app.use('/api/zorvyn-fintech/auth', authLimiter, authRouter);
app.use('/api/zorvyn-fintech/transactions', generalLimiter, transactionRouter);
app.use('/api/zorvyn-fintech/dashboard', generalLimiter, dashboardRouter);

//Function to start the server
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected successfully');

        server = app.listen(PORT, () => {
            console.log('Boot successful...');
            console.log(`Server is running on PORT: ${PORT}`);
        });

    } catch (error) {
        console.error("Error starting server:", error.message);
        process.exit(1);
    }
};

startServer();


const closeServer = async () => {
    try {
        console.log('Shutting down server...');

        if (server) {
            server.close(() => {
                console.log('HTTP server closed');
            });
        }

        await mongoose.disconnect();
        console.log('MongoDB disconnected successfully');
        console.log('Server closed...');
        process.exit(0);
    } catch (error) {
        console.error("Error during shutdown:", error.message);
        process.exit(1);
    }
};


process.on('SIGINT', closeServer);  
process.on('SIGTERM', closeServer);  