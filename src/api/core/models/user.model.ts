import { AppDataSource } from "@config/database.config";
import { GENDER, ROLE, USER_ONLINE_STATUS } from "@enums";
import { Gender, Role, UserOnlineStatus } from "@types";
import * as bcrypt from 'bcrypt';
import * as Jwt from 'jwt-simple';
import BaseModel from "./base.model";
import { BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm";
import { IsEmail, IsNotEmpty } from 'class-validator';
import * as Dayjs from 'dayjs';
import EnvConfig from "@config/environment.config";

@Entity("user")
export class User extends BaseModel {

    @Column({
        length: 32,
        unique: true
    })
    username: string;

    @Column({ type: "varchar" })
    @IsNotEmpty()
    first_name: string;

    @Column({ type: "varchar" })
    @IsNotEmpty()
    last_name: string;

    @Column({
        type: "varchar",
        unique: true,
        nullable: false,
        length: 128
    })
    @IsEmail()
    email: string;

    @Column({
        type: "varchar",
        unique: true,
        nullable: false,
        length: 128
    })
    @IsNotEmpty()
    phone_number: string;

    @Column({ type: "varchar" })
    password: string;

    @Column({
        type: "varchar",
        nullable: true,
        default: null
    })
    picture: string;

    @Column({
        type: "enum",
        enum: GENDER,
        default: GENDER.NOT_SPECIFIED
    })
    gender: Gender;

    @Column({
        type: "date",
        nullable: true,
        default: null,
    })
    birthdate: Date;

    @Column({
        type: "enum",
        enum: ROLE,
        default: ROLE.user
    })
    role: Role;

    @Column({
        type: "varchar",
        nullable: true,
        default: null
    })
    reset_password_token: string;

    @Column({
        type: "timestamp",
        nullable: true,
        default: null
    })
    reset_password_expire: Date;

    @Column({
        type: "enum",
        enum: USER_ONLINE_STATUS,
        default: USER_ONLINE_STATUS.online
    })
    online_status: UserOnlineStatus;

    @Column({ type: "boolean", default: false })
    is_email_verified: boolean;

    @Column({ type: "boolean", default: false })
    is_phone_number_verified: boolean;

    @Column({ type: "boolean", default: true })
    enabled: boolean;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            const saltRounds = 12;
            this.password = await bcrypt.hash(this.password, saltRounds);
        }
    }

    @BeforeInsert()
    async generateUsername() {
        if (!this.username || this.username === '') {
            this.username = await this.generateUniqueUsername();
        }
    }

    token(duration?: number): string {
        const payload = {
            exp: Dayjs().add(duration || EnvConfig.ACCESS_TOKEN_DURATION, 'minutes').unix(),
            iat: Dayjs().unix(),
            sub: this.id
        };
        return Jwt.encode(payload, EnvConfig.ACCESS_TOKEN_SECRET);
    }

    async passwordMatches(plainTextPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainTextPassword, this.password);
    }

    static async isEmailTaken(email: string): Promise<boolean> {
        const user = await AppDataSource.getRepository(User).findOne({ where: { email } });
        return !!user;
    }

    static async isPhoneNumberTaken(phone_number: string): Promise<boolean> {
        const user = await AppDataSource.getRepository(User).findOne({ where: { phone_number } });
        return !!user;
    }

    static async isUserNameTaken(username: string): Promise<boolean> {
        const user = await AppDataSource.getRepository(User).findOne({ where: { username } });
        return !!user;
    }

    static async isUserExists(email: string, phone_number?: string, username?: string): Promise<boolean> {
        const user = await AppDataSource.getRepository(User).findOne({ where: { email, phone_number } });
        return !!user;
    }

    private async generateUniqueUsername(): Promise<string> {

        const str = this.first_name + this.last_name;

        // Sanitize the string to remove special characters
        const usernameBase = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase();
        let username = usernameBase.slice(0, 15);
        username += this.id.toString();

        return username;
    }

    get whitelist(): string[] {
        return [
            'id',
            'username',
            'email',
            'role',
            'created_at',
            'updated_at'
        ]
    }

    constructor(user: Partial<User>) {
        super();
        Object.assign(this, user);
    }
}