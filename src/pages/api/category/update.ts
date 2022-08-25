import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from 'lib/prisma'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const session = await getSession({ req })
		const { name, image, id } = req.body

		// Session must exist...
		if (!session) {
			return res.status(401).end()
		}

		// Only accept PUT request.
		if (req.method !== 'PUT') {
			return res.status(401).end('Only suport PUT request!')
		}

		// Call prisma to create a new profile.
		const category = await prisma.category.update({
			where: {
				id: id
			},
			data: {
				name,
				image
			}
		})
		return res.status(201).json(category)
	} catch (error) {
		console.log('ERRO..' + error)
		return res.status(500).send(error)
	}
}
