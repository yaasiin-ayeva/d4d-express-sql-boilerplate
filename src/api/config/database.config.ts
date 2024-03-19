import "reflect-metadata";
import { DataSource } from "typeorm";
import EnvConfig from "./environment.config";
import { ENVIRONMENT } from "../core/types/enums";

export const config = {
    type: EnvConfig.DB_TYPE as any,
    host: EnvConfig.DB_HOST,
    port: EnvConfig.DB_PORT,
    username: EnvConfig.DB_USER,
    password: EnvConfig.DB_PASS,
    database: EnvConfig.DB_NAME,
    synchronize: EnvConfig.env === ENVIRONMENT.development ? EnvConfig.DB_SYNC : false,
    logging: EnvConfig.DB_LOGGING,
    entities: [
        EnvConfig.env === ENVIRONMENT.production ? "dist/api/core/models/**/*.js" : "src/api/core/models/**/*.ts",
        EnvConfig.env === ENVIRONMENT.test ? "test/api/core/models/**/*.js" : "src/api/core/models/**/*.ts",
        EnvConfig.env === ENVIRONMENT.development ? "src/api/core/models/**/*.ts" : "src/api/core/models/**/*.ts",
    ],
    migrations: [
        EnvConfig.env === ENVIRONMENT.production ? "dist/api/core/migrations/**/*.js" : "src/api/core/migrations/**/*.ts",
        EnvConfig.env === ENVIRONMENT.test ? "test/api/core/migrations/**/*.js" : "src/api/core/migrations/**/*.ts",
        EnvConfig.env === ENVIRONMENT.development ? "src/api/core/migrations/**/*.ts" : "src/api/core/migrations/**/*.ts",
    ],
    subscribers: [],
    cache: EnvConfig.DB_CACHE,
    extra: {
        connectionLimit: EnvConfig.DB_CONNEXION_LIMIT,
    },
    migrationsRun: true,
    // migrate: true
}

export const AppDataSource = new DataSource(config);