import { Gender } from "@types";

export default interface RegisterDto {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
    gender: Gender
    roleId: string
}