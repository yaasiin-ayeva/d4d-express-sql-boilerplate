import * as Joi from 'joi';

const sharedGetByIdSchema = {
    body: Joi.object().keys({
        id: Joi.number().required(),
    }),
};

const sharedGetByNameSchema = {
    body: Joi.object().keys({
        name: Joi.string().required().label('Name'),
    }),
};

const sharedGetByIdAndNameSchema = {
    body: Joi.object().keys({
        name: Joi.string().required().label('Name'),
        id: Joi.number().required().label('Id'),
    }),
};

const sharedGetBySlugSchema = {
    body: Joi.object().keys({
        slug: Joi.string().required(),
    }),
};

const sharedGetByLabelSchema = {
    body: Joi.object().keys({
        label: Joi.string().required(),
    }),
};

export {
    sharedGetByIdSchema,
    sharedGetByNameSchema,
    sharedGetBySlugSchema,
    sharedGetByLabelSchema,
    sharedGetByIdAndNameSchema
}