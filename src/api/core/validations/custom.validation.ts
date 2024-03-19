const password = (value: any, helpers: any) => {
    if (value.length < 8) {
        return helpers.message('password must be at least 8 characters');
    }
    if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        return helpers.message('password must contain at least 1 letter and 1 number');
    }
    return value;
};

// const confirmPassword = (value: any, helpers: any) => {
//     if (value !== this.password) {
//         return helpers.message('passwords should match');
//     }
//     return value;
// };

export {
    password
}