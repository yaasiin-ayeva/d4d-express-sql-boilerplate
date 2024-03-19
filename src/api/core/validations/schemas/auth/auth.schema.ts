import * as Joi from 'joi';
import { password } from '../../custom.validation';

const signupSchema = {
    body: Joi.object().keys({
        first_name: Joi.string().required().label('First name'),
        last_name: Joi.string().required().label('Last name'),
        gender: Joi.string().optional().label('Gender'),
        address: Joi.string().optional().empty('').default('').label('Address'),
        email: Joi.string().required().email().label('Email address'),
        phone_number: Joi.string().required().label('Phone number'),
        password: Joi.string().required().custom(password).label('Password'),
        confirm_password: Joi.string().valid(Joi.ref('password')).required().label('Password Confirmation').messages({
            'any.only': 'Passwords do not match',
        }),
        terms_and_conditions: Joi.string().label('Terms and conditions').pattern(/\btrue\b/).message('You must agree to the terms and conditions'),
    }),
};

const signinSchema = {
    body: Joi.object().keys({
        email: Joi.string().email().required().label('Email address'),
        password: Joi.string().required().label('Password'),
        remember_me: Joi.boolean().optional(),
    })
}

const forgotPasswordSchema = {
    body: Joi.object().keys({
        email: Joi.string().required().email().label('Email address'),
    }),
};

const resetPasswordSchema = {
    query: Joi.object().keys({
        token: Joi.string().required(),
    }),
    body: Joi.object().keys({
        password: Joi.string().required().custom(password),
    }),
};

const verifyEmailSchema = {
    query: Joi.object().keys({
        token: Joi.string().required(),
    }),
};

export {
    signupSchema,
    signinSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    verifyEmailSchema
};