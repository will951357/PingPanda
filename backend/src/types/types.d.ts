import "@clerk/express"
import { User as ClerkUser } from '@clerk/backend';

declare module 'express-serve-static-core' {
    interface Request {
        auth?: {
            sessionId: string | null
            userId: string | null
            actor: any | null
            session: {
                user: ClerkUser
            } | null
        }
    }
}