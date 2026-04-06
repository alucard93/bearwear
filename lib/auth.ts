import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

import { db } from '@/app/db'
import * as schema from '@/app/db/schema'

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),

  user: {
    modelName: 'userTable',
  },

  session: {
    modelName: 'sessionTable',
  },
})
