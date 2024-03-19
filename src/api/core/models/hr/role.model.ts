import { Entity, Column, ManyToMany, JoinTable } from "typeorm";
import BaseModel from "../base.model";
import { AppDataSource } from "../../../config/database.config";
import { ROLE } from "../../types/enums";
import { Permission } from "./permission.model";


@Entity("roles")
export class Role extends BaseModel {

    @Column({
        type: "varchar",
        unique: true
    })
    name: string;

    @Column({
        type: "enum",
        enum: ROLE,
        default: ROLE.user
    })
    type: ROLE;

    @Column({
        type: "varchar",
        default: ""
    })
    description: string;

    @ManyToMany(type => Permission)
    @JoinTable()
    permissions: Permission[];

    static async isRoleExists(name: string): Promise<boolean> {
        const role = await AppDataSource.getRepository(Role).findOne({ where: { name } });
        return !!role;
    }

    static async getDefaultAdminRole(): Promise<Role> {
        const role = await AppDataSource.getRepository(Role).findOne({ where: { name: ROLE.admin } });
        return role;
    }

    static async getDefaultUserRole(): Promise<Role> {
        const role = await AppDataSource.getRepository(Role).findOne({
            where: { type: ROLE.user },
        });
        return role;
    }

    constructor(role: Partial<Role>) {
        super();
        Object.assign(this, role);
    }
}
