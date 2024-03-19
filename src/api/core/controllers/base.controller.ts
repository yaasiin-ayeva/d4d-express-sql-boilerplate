import BaseService from "../services/base.service";

export class BaseController<T, S extends BaseService<T>> {

    protected readonly service: S;

    constructor(service: S) {
        this.service = service;
    }
}