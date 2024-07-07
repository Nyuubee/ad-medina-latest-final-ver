// https://next-auth.js.org/getting-started/typescript
import { DefaultSession, DefaultUser } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'
import type { Roles } from '~/server/database/schema'

declare module "next-auth/jwt" {
    export interface JWT extends DefaultJWT {
        id: number
        firstName?: string
        middleName?: string
        lastName?: string
        oauth?: "google"
        roles: Roles[]
        toBind?: boolean
    }
}
declare module "next-auth" {
    export interface User extends DefaultUser {
        name: string
        id: number
        firstName?: string
        middleName?: string
        lastName?: string
        oauth?: "google"
        roles: Roles[]
        toBind?: boolean
    }

    export interface Session extends DefaultSession {
        user?: User
    }
}
