import { User } from "../../models/hr/user.model";
import BaseService from "../base.service";

export class UserService extends BaseService<User> {

    constructor() {
        super(User);
    }

    public async findById(id: any) {
        return await this.repo.createQueryBuilder("users")
            .where("users.id = :id", { id: id })
            .getOne();
    }

    public async findByEmail(email: string) {
        return await this.repo.createQueryBuilder("users")
            .where("users.email = :email", { email: email })
            .getOne();
    }

    public async findByPhone(phone: string) {
        return await this.repo.createQueryBuilder("users")
            .where("users.phone = :phone", { phone: phone })
            .getOne();
    }
}