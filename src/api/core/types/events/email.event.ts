import * as Events from 'events';
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

import EnvConfig from '@config/environment.config';
import { User } from '@models/user.model';
import ErrorResponse from '@utils/errorResponse.util';
import { EVENTS_NAMES } from '@enums';

const emailEmitter = new Events.EventEmitter();

emailEmitter.on(EVENTS_NAMES.user_forgot_passwd as string, async (user: User, resetUrl: string) => {

    const msg = {
        to: user.email,
        from: EnvConfig.FROM_EMAIL,
        subject: 'Reset your password',
        html: `
        <p>Hi ${user.username},</p>
        <p>You requested a password reset. Click the following link to reset your password.</p>
        <a href="${resetUrl}">Reset your password</a>
        `
    };

    try {

        await sgMail.send(msg);

    } catch (error) {
        throw new ErrorResponse('Email could not be sent', 500);

    }
});


export { emailEmitter }