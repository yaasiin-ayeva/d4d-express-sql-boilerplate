import "reflect-metadata";
import { DataSource } from "typeorm";
import EnvConfig from "@config/environment.config";
import { ENVIRONMENT } from "@enums";

export const AppDataSource = new DataSource({
    type: EnvConfig.DB_TYPE as any,
    host: EnvConfig.DB_HOST,
    port: EnvConfig.DB_PORT,
    username: EnvConfig.DB_USER,
    password: EnvConfig.DB_PASS,
    database: EnvConfig.DB_NAME,
    synchronize: EnvConfig.DB_SYNC,
    logging: EnvConfig.DB_LOGGING,
    entities: [
        EnvConfig.env === ENVIRONMENT.production ? "dist/api/core/models/**/*.js" : "src/api/core/models/**/*.ts",
        EnvConfig.env === ENVIRONMENT.test ? "test/api/core/models/**/*.js" : "src/api/core/models/**/*.ts",
        EnvConfig.env === ENVIRONMENT.development ? "src/api/core/models/**/*.ts" : "src/api/core/models/**/*.ts",
    ],
    migrations: [],
    subscribers: [],
    cache: EnvConfig.DB_CACHE,
    extra: {
        connectionLimit: EnvConfig.DB_CONNEXION_LIMIT,
    }
});