import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

import { db } from '@/app/db'
import * as schema from '@/app/db/schema'

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
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
