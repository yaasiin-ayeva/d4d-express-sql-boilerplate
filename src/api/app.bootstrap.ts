import { Request, Response } from "express";
import rateLimit from "express-rate-limit";

import EnvConfig from "../api/config/environment.config";
import { AppDataSource } from "../api/config/database.config";
import morganConfig from "../api/config/morgan.config";
import logger from "../api/config/logger.config";
import swaggerSpec from "../api/config/swagger.config";

import { runSeeders } from "../api/core/seeders/index.seeder";
import { scheduleCrons } from "../api/core/crons/index.cron";
import { ENVIRONMENT } from "../api/core/types/enums";

import express = require("express");

import swaggerUi = require('swagger-ui-express');
import apiRouter from "./core/routes/index.route";

const compression = require('compression');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const publicContent = require('../../app.json');
const PORT = EnvConfig.API_PORT;

const app = express();

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

// Disable x-powered-by
app.disable("x-powered-by");

// Serve static files
app.use(`/${EnvConfig.UPLOAD_PATH}`, express.static(EnvConfig.UPLOAD_PATH));

// API Routes with CORS policy
app.use('/api', apiRouter);

// Documentation with Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

app.get('/', (_, res) => {
    res.send(publicContent);
});

// Error handler
app.use((error: any, req: Request, res: Response) => {
    let statusCode = error.statusCode || 500;
    let errorMessage = statusCode === 500 ? 'Internal Server Error' : error.message;
    let stack = isNaN(Number(error.statusCode)) ? error.stack : null;

    logger.error(`Error ${statusCode}: ${errorMessage} ${stack ? 'Stack' + stack : ''}`, { url: req.url, method: req.method });

    return res.status(statusCode).json({
        success: false,
        error: errorMessage,
        payload: error.payload || null
    });
});

// Initialize Datasource
AppDataSource.initialize().then(async () => {
    logger.info('Datasource initialized successfully');

    // Run default Seeders
    await runSeeders();

    // Schedule Crons
    scheduleCrons();

    // Listening to port
    app.listen(PORT, () => {
        logger.info(`${EnvConfig.API_NAME} has been successfully started on port ${PORT} in ${EnvConfig.env} mode`);
    });

}).catch((error => {
    logger.error(`Datasource Error: ${error.message}`);
}));