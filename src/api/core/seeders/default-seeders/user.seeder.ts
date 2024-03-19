import EnvConfig from "../../../config/environment.config";
import logger from "../../../config/logger.config";
import { Role } from "../../models/hr/role.model";
import { User } from "../../models/hr/user.model";


const seedDefaultUser = async () => {
    try {

        const default_admin_role = await Role.getDefaultAdminRole();

        const existingUser = await User.isUserExists(
            EnvConfig.DEFAULT_USER_EMAIL,
            EnvConfig.DEFAULT_USER_PHONE,
            EnvConfig.DEFAULT_USER_USERNAME
        );

        if (!existingUser) {

            const defaultUser = new User({
                first_name: EnvConfig.DEFAULT_USER_FIRST_NAME,
                last_name: EnvConfig.DEFAULT_USER_LAST_NAME,
                email: EnvConfig.DEFAULT_USER_EMAIL,
                phone_number: EnvConfig.DEFAULT_USER_PHONE,
                username: EnvConfig.DEFAULT_USER_USERNAME,
                password: EnvConfig.DEFAULT_USER_PASSWORD,
                role: default_admin_role
            });

            await defaultUser.save();
            logger.info('Default user seeded.');
        } else {
            logger.info('Default user already exists in the database.');
        }
    } catch (error) {
        logger.error('Error seeding default user:', error);
    }
};

export default seedDefaultUser;