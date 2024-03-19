import logger from "../../config/logger.config";
import seedDefaultUser from "./default-seeders/user.seeder";
import seedDefaultRoles from "./default-seeders/role.seeder";

export async function runSeeders() {

    const seeders = [
        seedDefaultRoles,
        seedDefaultUser,
    ];

    for (const seeder of seeders) {
        try {
            await seeder();
            logger.info(`${seeder.name} seeding completed`);
        } catch (error) {
            logger.error(`Error when running ${seeder.name}: ${error}`);
        }
    }
}