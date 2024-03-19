import logger from "../../config/logger.config";

export function scheduleCrons() {

    const crons = [
    ];

    logger.info('Scheduling crons...');

    for (const cron of crons) {
        try {
            cron();
            logger.info(`${cron.name} seeding completed`);
        } catch (error) {
            logger.error(`Error when running ${cron.name}: ${error}`);
        }
    }

    logger.info('Crons scheduling run completed.');
}