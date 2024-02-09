const morgan = require('morgan');
import logger from '@config/logger.config';
import EnvConfig from "@config/environment.config";

const format = EnvConfig.LOGS_TOKEN;

const successHandler = morgan(format, {
    skip: (req: any, res: any) => res.statusCode >= 400,
    stream: { write: (message: string) => logger.info(message.trim()) },
});

const errorHandler = morgan(format, {
    skip: (req: any, res: any) => res.statusCode < 400,
    stream: { write: (message: string) => logger.error(message.trim()) },
});

export default {
    successHandler,
    errorHandler
};