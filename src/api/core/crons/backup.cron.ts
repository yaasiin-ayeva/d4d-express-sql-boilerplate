import { schedule_backup } from "../utils/core.util";

const backupScheduleCron = async () => {
    schedule_backup();
};

export {
    backupScheduleCron
}