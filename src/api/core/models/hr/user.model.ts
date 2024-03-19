import * as bcrypt from 'bcrypt';
import * as Jwt from 'jwt-simple';
import BaseModel from "../base.model";
import { BeforeInsert, BeforeUpdate, Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { IsEmail, IsNotEmpty } from 'class-validator';
import * as Dayjs from 'dayjs';
import { AppDataSource } from '../../../config/database.config';
import EnvConfig from '../../../config/environment.config';
import { GENDER, USER_ONLINE_STATUS } from '../../types/enums';
import { Gender, UserOnlineStatus } from '../../types/types';
import { generate_unique_id } from '../../utils/data-formating.util';
import { Role } from './role.model';


@Entity("users")
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

    @Index({ unique: true })
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
        type: "varchar",
        nullable: true,
        default: ""
    })
    address: string;

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

    @ManyToOne(() => Role, {
        eager: true
    })
    @JoinColumn()
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

    @Column({
        type: "timestamp",
        nullable: true,
        default: null
    })
    last_login: Date;

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
    generateUniqueUsername() {
        this.username = generate_unique_id([this.first_name, this.last_name]);
    }

    token(duration?: number): string {
        const payload = {
            exp: Dayjs().add(duration || EnvConfig.ACCESS_TOKEN_DURATION, 'minutes').unix(),
            iat: Dayjs().unix(),
            sub: this.id
        };
        return Jwt.encode(payload, EnvConfig.ACCESS_TOKEN_SECRET);
    }

    // update last login
    async updateLastLogin() {
        const userRepository = AppDataSource.getRepository(User);
        await userRepository.update({ id: this.id }, { last_login: new Date() });
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
        const user = await AppDataSource.getRepository(User).createQueryBuilder("user")
            .where("user.email = :email", { email })
            .orWhere("user.phone_number = :phone_number", { phone_number })
            .orWhere("user.username = :username", { username }).getOne();
        return !!user;
    }

    get whitelist(): string[] {
        return [
            'id',
            'username',
            'first_name',
            'last_name',
            'email',
            'phone_number',
            'address',
            'gender',
            'birthdate',
            'last_login',
            'created_at',
            'enabled',
            'online_status',
            'role',
            'updated_at'
        ]
    }

    public getInfo() {
        const whitelistedData: any = {};
        for (const field of this.whitelist) {
            whitelistedData[field] = this[field];
        }
        return whitelistedData;
    }

    constructor(user: Partial<User>) {
        super();
        Object.assign(this, user);
    }
}