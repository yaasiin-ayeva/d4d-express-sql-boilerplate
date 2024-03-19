const parse_joi_error = (validator: any, req: any) => {
    const schema = validator.body.options({ abortEarly: false });
    const { error } = schema.validate(req.body);

    const parsedErrors = {};

    if (error) {
        error.details?.forEach((detail: any) => {
            const key = detail.context.key;
            const errorMessage = detail.message.replace(/['"]+/g, '');
            parsedErrors[key] = parsedErrors[key] ? `${parsedErrors[key]}, ${errorMessage}` : errorMessage;
        });

        error.message = "Kindly provide valid input";
    }

    return { error, parsedErrors };
};

export { parse_joi_error };
