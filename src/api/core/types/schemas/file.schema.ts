// import * as Joi from 'joi';
// import { AnySchema } from 'joi';

// import { MIME_TYPE_LIST } from 'src/api/core/types/enums';
// import { filename, path, mimetype } from 'src/api/core/types/schemas';
// import { Fieldname } from 'src/api/core/types/types';

// const file = (field_name: Fieldname): AnySchema => {
//   return Joi.object().keys({
//     id: Joi.number().optional(),
//     fieldname: Joi.string().valid(field_name).required(),
//     filename: filename().required(),
//     path: path().required(),
//     mimetype: mimetype(MIME_TYPE_LIST).required(),
//     size: Joi.number().required(),
//     owner: Joi.number().required(),
//     createdAt: Joi.date().optional().allow(null),
//     updatedAt: Joi.date().optional().allow(null),
//     deletedAt: Joi.date().optional().allow(null)
//   });
// };

// export { file }