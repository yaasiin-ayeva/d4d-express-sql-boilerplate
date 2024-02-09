import * as Joi from 'joi';
import { password } from '@validations/custom.validation';

const registerValidator = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
        name: Joi.string().required(),
    }),
};

const loginValidator = {
    body: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
        remember_me: Joi.boolean().optional(),
    })
}

const logoutValidator = {
    body: Joi.object().keys({
        refreshToken: Joi.string().required(),
    }),
};

const refreshTokensValidator = {
    body: Joi.object().keys({
        refreshToken: Joi.string().required(),
    }),
};

const forgotPasswordValidator = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
    }),
};

const resetPasswordValidator = {
    query: Joi.object().keys({
        token: Joi.string().required(),
    }),
    body: Joi.object().keys({
        password: Joi.string().required().custom(password),
    }),
};

const verifyEmailValidator = {
    query: Joi.object().keys({
        token: Joi.string().required(),
    }),
};


export {
    registerValidator,
    loginValidator,
    logoutValidator,
    refreshTokensValidator,
    forgotPasswordValidator,
    resetPasswordValidator,
    verifyEmailValidator,
};