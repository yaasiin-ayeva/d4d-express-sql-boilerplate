
import { AppDataSource } from "../api/config/database.config";


const waterfall = require('async/waterfall');

AppDataSource.initialize().then(async () => {
    waterfall([
        async function (callback) {
            try {
                //
                callback(null);
            } catch (error) {
                callback(error);
            }
        },
        async function (callback) {
            try {
                
                //
                callback(null);
            } catch (error) {
                callback(error);
            }
        },
        async function (callback) {
            try {
                //
                callback(null);
            } catch (error) {
                callback(error);
            }
        }
    ], function (error) {
        if (error) {
            console.error(error);
            process.exit(1);
        } else {
            console.log('Seeding completed');
        }
    });
});