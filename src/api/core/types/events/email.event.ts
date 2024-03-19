import * as Events from 'events';
import EnvConfig from '../../../config/environment.config';
import logger from '../../../config/logger.config';
import { User } from '../../models/hr/user.model';
import ErrorResponse from '../../utils/errorResponse.util';
import { EVENTS_NAMES } from '../enums';



const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(EnvConfig.SENDGRID_API_KEY);

const sendMail = async (msg: any) => {
    if (EnvConfig.ENABLE_EMAIL) {
        await sgMail.send(msg);
    }
}

const emailEmitter = new Events.EventEmitter();

emailEmitter.on((EVENTS_NAMES.user_register as string), async (user: User, attachment?: any) => {

    const msg = {
        to: user.email,
        from: EnvConfig.FROM_EMAIL,
        subject: `Welcome to ${EnvConfig.APP_NAME} ${user.first_name}!`,
        html: `
        <p>Hi ${user.first_name},</p>
        <p>Welcome to ${EnvConfig.APP_NAME}! We're very excited to have you on board.</p>
        <p>If you have any questions, please email us at ${EnvConfig.FROM_EMAIL}</p>
        `
    };

    try {

        await sendMail(msg);

        logger.info(`Email sent to ${user.email}`);

    } catch (error) {
        logger.error(`Email could not be sent. \n Error : ${error}`, 500);
    }

})

emailEmitter.on(EVENTS_NAMES.user_forgot_passwd as string, async (user: User, resetUrl: string) => {

    const msg = {
        to: user.email,
        from: EnvConfig.FROM_EMAIL,
        subject: 'Reset your password',
        html: `
        <p>Hi ${user.first_name},</p>
        <p>You requested a password reset. Click the following link to reset your password.</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you did not request a password reset, please ignore this email.</p>
        `
    };

    try {

        await sendMail(msg);

        logger.info(`Email sent to ${user.email}`);

    } catch (error) {
        throw new ErrorResponse(`Email could not be sent. \n Error : ${error}`, 500);
    }
});


export { emailEmitter }