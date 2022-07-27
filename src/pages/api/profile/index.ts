import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { bio, phone, role, email, id } = req.body
		const session = await getSession({ req })

		// Session must exist...
		if (!session) {
			return res.status(401).end()
		}

		// GET list all profile for the current user.
		if (req.method === 'GET') {
			const profiles = await prisma.profile.findMany({
				where: {
					User: {
						email: session.user.email
					}
				}
			})
			return res.status(201).json(profiles)
		}

		// DELETE the profile.
		if (req.method === 'DELETE') {
			await prisma.profile.delete({
				where: {
					id: req.query.id
				}
			})
			return res.status(200).send('Perfil excluído com sucesso!')
		}

		// Update the profile.
		if (req.method === 'PUT') {
			// Call prisma to update profile.
			const profile = await prisma.profile.update({
				where: {
					id: id
				},
				data: {
					email: email,
					bio,
					phone,
					role
				}
			})
			return res.status(201).json(profile)
		}

		// Call prisma to create a new profile.
		const newProfile = await prisma.profile.create({
			data: {
				email: email,
				bio,
				phone,
				role,
				User: { connect: { email: session.user.email } }
			}
		})
		return res.status(201).json(newProfile)
	} catch (error) {
		console.log(error)
		return res.status(500).send(error)
	}
}
