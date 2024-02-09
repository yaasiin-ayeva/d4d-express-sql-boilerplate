require('module-alias/register');

import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";

import EnvConfig from "@config/environment.config";
import { AppDataSource } from "@config/database.config";
import morganConfig from "@config/morgan.config";
import logger from "@config/logger.config";

import { runSeeders } from "@seeders/index.seeder";
import ErrorResponse from "@utils/errorResponse.util";
import { scheduleCrons } from "@crons/index.cron";
import { ENVIRONMENT } from "@enums";

import apiRouter from "@router";

import express = require("express");

const cookieParser = require('cookie-parser');
const compression = require('compression');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

const publicContent = require('@public-content');
const PORT = EnvConfig.API_PORT;

const app = express();

const corsAllowedOrigins = [EnvConfig.AUTHORIZED];

const corsOptions = {
    origin: function (origin: any, callback: any) {
        if (corsAllowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new ErrorResponse('Not allowed by CORS', 403));
        }
    },
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Credentials'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
}

// Rate Limit
const apiLimiter = rateLimit({
    windowMs: EnvConfig.WINDOWS_MS,
    max: EnvConfig.MAX,
    standardHeaders: EnvConfig.STANDARD_HEADERS,
    legacyHeaders: EnvConfig.LEGACY_HEADERS,
});

app.use(morganConfig.successHandler);
app.use(morganConfig.errorHandler);

// Security on http headers
app.use(helmet());

// Parse json request
app.use(express.json());

// Parse urlencoded request
app.use(bodyParser.urlencoded({ extended: true }));

// gzip compression
app.use(compression());

// API limiter
if (EnvConfig.env === ENVIRONMENT.production) {
    app.use(apiLimiter);
}

// Enable CORS for all requests in production
if (EnvConfig.env === ENVIRONMENT.production) {
    app.use(cors(corsOptions));
    app.use(cors());
    app.options('*', cors(corsOptions));
}

// cookie parser
app.use(cookieParser());

// Serve static files
app.use(`/${EnvConfig.UPLOAD_PATH}`, express.static(EnvConfig.UPLOAD_PATH));

app.use('/api', apiRouter);

app.get('/', (_, res) => {
    res.send(publicContent);
});

// Initialize Datasource
AppDataSource.initialize().then(async () => {
    logger.info('Datasource initialized successfully');
    await runSeeders();
}).catch((error => {
    logger.error(`Datasource Error: ${error.message}`);
}));

// Crons Runners
scheduleCrons();

app.use((error: any, req: Request, res: Response, next: NextFunction) => {

    if (isNaN(Number(error.statusCode))) {
        var stack = error.stack;
    }

    logger.error(`Error ${error.statusCode}: ${error.message} ${stack ? 'Stack' + stack : ''}`, { url: req.url, method: req.method },);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        error: statusCode === 500 ? 'Internal Server Error' : error.message
    });
});

app.listen(PORT, () => {
    logger.info(`${EnvConfig.API_NAME} has been successfully started on port ${PORT} in ${EnvConfig.env} mode`);
});