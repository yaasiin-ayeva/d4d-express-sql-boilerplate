import * as jwt from "jsonwebtoken";
import { Repository } from "typeorm";
import EnvConfig from "@config/environment.config";
import { AppDataSource } from "@config/database.config";
import ForgotPasswordDto from "../dtos/auth/forgot-password.dto";
import LoginDto from "../dtos/auth/login.dto";
import { User } from "@models/user.model";
import ErrorResponse from "@utils/errorResponse.util";
import { ENVIRONMENT } from "@enums";

const crypto = require('crypto');

export default class AuthService {

    private readonly userRepo: Repository<User>;

    constructor() {
        this.userRepo = AppDataSource.getRepository(User);
    }

    public async login(data: LoginDto) {

        const user = await this.userRepo.createQueryBuilder("user")
            .where("user.email = :email", { email: data.email })
            .getOne();

        if (!user) {
            throw new ErrorResponse('User not found', 404);
        } else {

            const isPasswordMatch = await user.passwordMatches(data.password);

            if (isPasswordMatch) {
                return await AuthService.signToken(user);
            } else {
                throw new ErrorResponse("Password does not match with record!", 401);
            }
        }
    }

    public async forgotPassword(data: ForgotPasswordDto) {

        const user = await this.userRepo.createQueryBuilder("user")
            .where("user.email = :email", { email: data.email })
            .getOne();
            
        if (!user) {
            throw new ErrorResponse('There is no user with that email', 404);
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        const resetPasswordExpire = Date.now() + EnvConfig.ACCESS_TOKEN_DURATION;    // 15 min

        await this.userRepo.update(user.id, {
            reset_password_token: resetPasswordToken,
            reset_password_expire: resetPasswordExpire
        });

        return { user, resetToken };
    }

    private static async signToken(user: any) {

        const whitelist: string[] = user.whitelist;
        const token_data: { [key: string]: any } = {};

        Object.keys(user).forEach(key => {
            if (whitelist.includes(key)) {
                token_data[key] = user[key];
            }
        });

        return jwt.sign(token_data, EnvConfig.JWT_KEY, {
            algorithm: "HS512",
            expiresIn: EnvConfig.env === ENVIRONMENT.production ? EnvConfig.JWT_PROD_EXPIRE : EnvConfig.JWT_DEV_EXPIRE
        });
    }
}