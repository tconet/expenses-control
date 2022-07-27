import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from 'lib/prisma'
import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

export const authOptions = {
	// Configure one or more authentication providers
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
			profile(profile) {
				return {
					id: profile.id.toString(),
					name: profile.name || profile.login,
					username: profile.login,
					email: profile.email,
					image: profile.avatar_url
				}
			}
		})
	],
	session: {
		// Choose how you want to save the user session.
		// The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
		// If you use an `adapter` however, we default it to `"database"` instead.
		// You can still force a JWT session by explicitly defining `"jwt"`.
		// When using `"database"`, the session cookie will only contain a `sessionToken` value,
		// which is used to look up the session in the database.
		strategy: 'jwt'
	},
	adapter: PrismaAdapter(prisma),
	callbacks: {
		async session({ session }) {
			return session
		},
		async jwt({ token, account, user }) {
			/**
			 * Use an if branch to check for the existence of parameters (apart from token).
			 * If they exist, this means that the callback is being invoked for the first time
			 * (i.e. the user is being signed in). This is a good place to persist additional
			 * data like an access_token in the JWT. Subsequent invocations will only contain
			 * the token parameter.
			 * DOC: https://next-auth.js.org/configuration/options#session
			 */
			if (account) {
				const profiles = await prisma.profile.findMany({
					where: {
						User: {
							email: user.email
						}
					}
				})
				let roles: Array<string> = []
				profiles.forEach((element) => {
					roles.push(element.role)
				})
				token.accessToken = account.access_token
				token.user = user
				token.profiles = roles
			}
			return token
		}
	},
	pages: {
		signIn: '/login',
		error: '/login'
	}
}
export default NextAuth(authOptions)
