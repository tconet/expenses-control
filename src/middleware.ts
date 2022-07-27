import { withAuth } from 'next-auth/middleware'

// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
export default withAuth({
	callbacks: {
		async authorized({ req, token }) {
			/*
			if (req.nextUrl.pathname === '/admin') {
				return token?.userRole === 'admin'
			}*/

			var roles: Array<string> = token?.profiles as Array<string>
			if (token && roles.indexOf('ADMIN') >= 0) {
				return true
			}

			// only requires the user to be logged in
			return !!token
		}
	}
})

export const config = { matcher: ['/profile/display', '/profile'] }
