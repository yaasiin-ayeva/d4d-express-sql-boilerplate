import logger from "../../../config/logger.config";
import { Role } from "../../models/hr/role.model";
import { ROLE } from "../../../core/types/enums";

const seedDefaultRoles = async () => {
    try {
        const default_roles_names = [ROLE.admin, ROLE.user];

        for (const role_name of default_roles_names) {
            if (!await Role.isRoleExists(role_name)) {
                const role = new Role({ name: role_name, type: ROLE[role_name], permissions: [] });
                await role.save();
                logger.info(`Default role "${role_name}" seeded.`);
            } else {
                logger.info(`Default role "${role_name}" already exists in the database.`);
            }
        }
    } catch (error) {
        logger.error('Error seeding default user:', error);
    }
};

export default seedDefaultRoles;