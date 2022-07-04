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
	secret: process.env.NEXTAUTH_SECRET,
	adapter: PrismaAdapter(prisma),
	callbacks: {
		session: ({ session, user }) => ({
			...session,
			user: {
				...session.user,
				id: user.id,
				namename: user.username
			}
		})
	}
}
export default NextAuth(authOptions)
