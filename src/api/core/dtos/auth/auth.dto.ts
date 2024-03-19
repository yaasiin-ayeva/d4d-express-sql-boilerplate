import { Gender } from "../../types/types"

export interface SigninDto {
    email: string,
    password: string,
    remember_me?: boolean
}

export interface ForgotPasswordDto {
    email: string
}

export interface SignupDto {
    first_name: string
    last_name: string
    email: string
    phone_number: string
    password: string
    gender?: Gender,
    address?: string,
    businesses?: any[],
    wallets?: any[]
}