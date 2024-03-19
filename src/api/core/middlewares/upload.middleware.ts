import { NextFunction, Request, Response } from "express";
import multer = require('multer');
import EnvConfig from "../../config/environment.config";
import logger from "../../config/logger.config";
import { clean_dir } from "../utils/FileHandling.util";
import ErrorResponse from "../utils/errorResponse.util";


const documentsFolder = EnvConfig.UPLOAD_PATH;
const uploadKey = EnvConfig.UPLOAD_KEY;

const NO_FILE_FOUND = "No file found";
const SOMETHING_WENT_WRONG = "Something went wrong";

const ALLOWED_FORMATS = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']

const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, documentsFolder)
    },
    filename: function (req, file, cb) {
        const fileUniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + fileUniqueName)
    }
})

const upload = multer({
    storage: multerStorage,
    limits: { fileSize: 1024 * 1024 * 1024 * 10 }, // 10GB limit
    // fileFilter: (req, file, cb) => {
    //     if (file.mimetype !== 'text/csv') {
    //         cb(new Error('Only CSV files are allowed'));
    //     } else {
    //         cb(null, true);
    //     }
    // }
});

export default async function uploadMiddleware(req: Request, res: Response, next: NextFunction) {
    try {

        const handleUpload = upload.single(uploadKey);

        handleUpload(req, res, async (error: any) => {

            if (!req.file) {
                next(new Error(NO_FILE_FOUND));
            } else if (!ALLOWED_FORMATS.includes(req.file.mimetype)) {
                clean_dir(req.file.path);  /// Need Improving
                next(new ErrorResponse('Incorrect File Format', 400));
            } else if (error) {
                next(new ErrorResponse(`${SOMETHING_WENT_WRONG} while uploading file: ${error.message}`, 500));
            } else {
                logger.info(`File ${req.file.originalname} saved successfully on the server at ${req.file.path}`);
                next();
            }
        });
    } catch (e) {
        next(e);
    }
}