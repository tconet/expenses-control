import prisma from 'lib/prisma'
import { getSession } from 'next-auth/react'

export default async function (req, res) {
	try {
		const { bio, phone, role, email } = req.body
		const session = await getSession({ req })

		if (!session) {
			return res.status(401)
		}

		const newProfile = await prisma.profile.create({
			data: {
				email: email,
				bio,
				phone,
				role,
				User: { connect: { email: session.user.email } }
			}
		})
		return res.status(200).json(newProfile)
	} catch (error) {
		return res.status(500).send(error)
	}
}
