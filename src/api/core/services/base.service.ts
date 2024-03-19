import { DeepPartial, EntityTarget, FindOptionsWhere, Repository, UpdateResult } from "typeorm";
import { AppDataSource } from "../../config/database.config";

export default class BaseService<T> {

    protected readonly repo: Repository<T>;

    constructor(model: EntityTarget<T>) {
        this.repo = AppDataSource.getRepository(model);
    }

    public async create(data: T | DeepPartial<T>) {
        return await this.repo.save(data);
    }

    async findAll(): Promise<T[]> {
        return await this.repo.find();
    }

    async findById(id: number): Promise<T | null> {
        return await this.repo.findOne({
            where: { id: id } as unknown as FindOptionsWhere<T>
        });
    }

    async update(id: number, data: Partial<T> | any): Promise<T | null> {

        const updateResult: UpdateResult = await this.repo.update(id, data);

        if (updateResult.affected && updateResult.affected > 0) {
            return await this.findById(id);
        } else {
            return null;
        }
    }

    async delete(id: number): Promise<boolean> {
        const entityToDelete = await this.findById(id);
        if (!entityToDelete) return false;

        await this.repo.remove(entityToDelete);
        return true;
    }

    async wipe(): Promise<boolean> {
        await this.repo.delete(
            {}
        );
        return true;
    }
}
