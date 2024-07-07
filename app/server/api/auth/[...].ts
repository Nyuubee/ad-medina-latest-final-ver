// file: ~/server/api/auth/[...].ts
import CredentialsProvider from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from '#auth'
import { db, tables } from '~/server/database'
import { DrizzleError, and, eq } from 'drizzle-orm'
import * as auth from '~/server/utils/auth'
import { derivePassword } from '@clinic/crypto'
import GoogleProvider from 'next-auth/providers/google'
import { JWT } from 'next-auth/jwt'
async function getAuthWithUser(username: string) {
    return await db.query.auth.findFirst({
        where: and(
            eq(tables.auth.username, username),
        ),
        columns: {
            salt: true,
            username: true,
            password: true,
        },
        with: {
            user: {
                columns: {
                    id: true,
                    firstName: true,
                    middleName: true,
                    lastName: true,
                    email: true,
                },
            },
            banlist: true,
        }
    })
}

async function authenticate(credentials: auth.LoginProps, auth: Awaited<ReturnType<typeof getAuthWithUser>>) {
    if (auth == undefined) {
        return undefined
    }
    const hashedHex = await derivePassword(credentials.password, auth.salt)
    if (auth.password.localeCompare(hashedHex) == 0) {
        return auth.user.id
    }
    return undefined
}

export default NuxtAuthHandler({
    // A secret string you define, to ensure correct encryption
    //secret: process.env.AUTH_SECRET, // TODO
    session: {
        strategy: 'jwt',
    },
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: '/login',
    },
    providers: [

        // https://next-auth.js.org/providers/google#example
        // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
        GoogleProvider.default({
            clientId: process.env.GOOGLE_CLIENT_ID || 'enter-your-client-id-here',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'enter-your-client-secret-here',
            // Google only provides Refresh Token to an application the first time a user signs in.
            // To force Google to re-issue a Refresh Token, the user needs to remove the application from their account and sign 
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
        CredentialsProvider.default({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: { label: 'Username', type: 'text', placeholder: '(hint: chani)' },
                password: { label: 'Hashed Password', type: 'text', placeholder: 'hashed password' }
            },

            async authorize(credentials: auth.LoginProps) {
                let auth: Awaited<ReturnType<typeof getAuthWithUser>> | undefined = undefined;
                try {
                    auth = await getAuthWithUser(credentials.username)
                } catch (error) {
                    if (error instanceof DrizzleError) {
                        if (error.message == 'Found non unique or inexistent value') {
                            throw createError({
                                statusCode: 401,
                                statusMessage: "Invalid username or password"
                            })
                        }
                        throw createError({
                            statusCode: 401,
                            statusMessage: JSON.stringify(error)
                        })
                    } else {
                        throw createError({
                            statusCode: 500, // Internal Server Error
                            statusMessage: JSON.stringify(error)
                        })
                    }
                }

                //Note: return null cause https://next-auth.js.org/configuration/pages#sign-in-page will trigger error=CredentialsSignin
                if (auth == null) {
                    return null
                }
                if (auth?.banlist) {
                    throw createError({
                        statusCode: 403,
                        statusMessage: "banned user"
                    })
                }
                const userId = await authenticate(credentials, auth)
                // read auth note above 
                if (userId == null) {
                    return null
                }

                return {
                    id: userId,
                    name: auth.username,
                    firstName: auth.user.firstName,
                    lastName: auth.user.lastName,
                    middleName: auth.user.middleName,
                    email: auth.user.email,
                }
            },
        }),
    ],

    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider == "google" && profile?.email ) {
                // console.log("GOOGLE", account)
                // insert or update oauth
                await db.insert(tables.oauth).values({
                    providerAccountId: account.providerAccountId,
                    provider: account.provider,
                    email: profile.email!,
                    access_token: account.access_token!,
                    refresh_token: account.refresh_token!,
                    expires_at: account.expires_at?.toString() ?? '',
                    scope: account.scope!,
                    token_type: 'Bearer',
                    id_token: account.id_token ?? '',
                    type: 'oauth',
                }).onConflictDoUpdate({
                    target: tables.oauth.providerAccountId,
                    set: {
                        access_token: account.access_token!,
                        refresh_token: account.refresh_token!,
                        expires_at: account.expires_at?.toString() ?? '',
                        scope: account.scope!,
                        token_type: 'Bearer',
                        id_token: account.id_token ?? '',
                        type: 'oauth',
                        // updatedAt: new Date(),
                    }
                })
                return true;
            }
            return true
        },
        async jwt({ token, user, profile, account }) {
            const isSignIn = user ? true : false;
            if (isSignIn) {
                // oauth
                if (account?.provider == "google") {
                    // check oauth for existing
                    const oauth = await oauthByAccountId(account.providerAccountId)
                    if (oauth?.google == undefined) {
                        token.toBind = true;
                        return token
                    }
                    user.id = oauth.google?.user.id
                }
                // console.log("USER", user)
                const userEntry = await userWithAuthAndRoles(user.id as number)
                // if (profile) {
                //     console.log('PROFILE', profile)
                //     // check if oauth email is bound to a user
                // }
                // console.log('OAUTH', userEntry?.google?.oauth)
                if (userEntry) {
                    user.name = userEntry.auth.username
                    user.firstName = userEntry.firstName
                    user.middleName = userEntry.middleName
                    user.lastName = userEntry.lastName
                    user.id = userEntry.id
                    token.roles = userEntry.roles.map((role) => role.role)
                    if (userEntry.google?.oauth) {
                        token.oauth = userEntry.google.oauth.provider
                    }
                }
                if (typeof user.id == 'number') {
                    const log: {
                        userId: number,
                        method: "POST",
                        path: string,
                    } = {
                        userId: user.id,
                        method: 'POST',
                        path: "/api/auth/callback/credentials",
                    }
                    await logAction(log).catch((error) => {
                        console.error('Failed to log action', log)
                    })
                }
                return Promise.resolve({
                    id: user.id,
                    name: user.name,
                    sub: token.sub,
                    firstName: user.firstName,
                    middleName: user.middleName,
                    lastName: user.lastName,
                    picture: token.picture,
                    email: token.email,
                    oauth: token.oauth,
                    roles: token.roles,
                } as JWT)
            }
            return token
        },

        async session({ session, token }) {
            // console.log({ session, token })

            if (token) {
                if (token.toBind && token.sub) {
                    const oauth = await oauthByAccountId(token.sub)
                    if (oauth?.google) {
                        token.id = oauth.google.user.id
                        // names
                        token.name = oauth.google.user.auth.username
                        token.firstName = oauth.google.user.firstName
                        token.middleName = oauth.google.user.middleName
                        token.lastName = oauth.google.user.lastName
                        token.oauth = oauth.provider
                        token.email = oauth.google.user.email
                        token.toBind = undefined;
                    }
                }
                session.user = {
                    id: token.id as number,
                    name: token.name as string,
                    email: token.email as string,
                    image: token.picture as string,
                    firstName: token.firstName,
                    lastName: token.lastName,
                    middleName: token.middleName,
                    oauth: token.oauth,
                    roles: token.roles,
                    toBind: token.toBind,
                }

            }
            if (session.user?.id) {
                const roles = await db.query.userRole.findMany({
                    where: and(
                        eq(tables.userRole.userId, session.user.id),
                    ),
                }).catch((error) => {
                    console.error('Failed to get roles', error)
                    throw error
                })
                session.user.roles = roles.map((role) => role.role)
            }
            return session
        },
    },
    events: {
        linkAccount: async (message) => {
            console.log('EV: LINK ACCOUNT', message)
        }
    }
})

async function oauthByAccountId(providerAccountId: string) {
    const oauth = await db.query.oauth.findFirst({
        where: eq(tables.oauth.providerAccountId, providerAccountId),
        columns: {
            email: true,
            provider: true,
        },
        with: {
            google: {
                with: {
                    user: {
                        with: {
                            auth: {
                                columns: {
                                    username: true,
                                }
                            }
                        }
                    }
                }
            }
        }
    })
    return oauth
}

async function userWithAuthAndRoles(id: number) {
    return db.query.user.findFirst({
        where: eq(tables.user.id, id as number),
        columns: {
            id: true,
            email: true,
            firstName: true,
            middleName: true,
            lastName: true,
        },
        with: {
            auth: true,
            google: {
                with: {
                    oauth: {
                        columns: {
                            provider: true,
                        },
                    },
                },
            },
            roles: true
        }
    })
}
