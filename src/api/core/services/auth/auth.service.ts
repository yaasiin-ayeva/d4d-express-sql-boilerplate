import * as jwt from "jsonwebtoken";
import { Repository } from "typeorm";
import { AppDataSource } from "../../../config/database.config";
import EnvConfig from "../../../config/environment.config";
import { SignupDto, SigninDto, ForgotPasswordDto } from "../../dtos/auth/auth.dto";
import { User } from "../../models/hr/user.model";
import { ENVIRONMENT } from "../../types/enums";
import ErrorResponse from "../../utils/errorResponse.util";
import { Role } from "../../models/hr/role.model";


const crypto = require('crypto');

export default class AuthService {

    private readonly userRepo: Repository<User>;

    constructor() {
        this.userRepo = AppDataSource.getRepository(User);
    }

    public async signup(data: SignupDto) {
        const queryRunner = this.userRepo.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const isUserExists = await queryRunner.manager
                .getRepository(User)
                .createQueryBuilder('user')
                .where('user.email = :email OR user.phone_number = :phone_number',
                    { email: data.email, phone_number: data.phone_number }
                )
                .getOne();

            if (isUserExists) {
                throw new ErrorResponse('User already exists', 409);
            }

            const defaultRole = await Role.getDefaultUserRole();
            const userData = this.userRepo.create({
                ...data,
                role: defaultRole
            });
            const user = await queryRunner.manager.save(userData);

            await queryRunner.commitTransaction();

            return user.getInfo();

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    public async signin(data: SigninDto) {

        const user = await this.userRepo.createQueryBuilder("user")
            .where("user.email = :email", { email: data.email })
            .leftJoinAndSelect('user.role', 'roles')
            .getOne();

        if (!user) {

            await new Promise(resolve => setTimeout(resolve,
                Math.floor(Math.random() * 7000)
            ));

            throw new ErrorResponse('Incorrect email or password!', 404);
        } else {

            const isPasswordMatch = await user.passwordMatches(data.password);

            if (isPasswordMatch) {

                const token = await AuthService.signToken(user);
                await user.updateLastLogin();
                return { token, data: user.getInfo() };

            } else {
                await new Promise(resolve => setTimeout(resolve,
                    Math.floor(Math.random() * 7000)
                ));
                throw new ErrorResponse("Incorrect email or password!", 401);
            }
        }
    }

    public async signout() {
        // No need to do anything, stateless server, client side implementation
        return true;
    }

    public async forgotPassword(data: ForgotPasswordDto) {

        const user = await this.userRepo.createQueryBuilder("users")
            .where("users.email = :email", { email: data.email })
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
            reset_password_expire: new Date(resetPasswordExpire)
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