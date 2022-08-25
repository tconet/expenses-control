import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const session = await getSession({ req })
		const method = req.method

		if (!session) {
			return res.status(401).end()
		}

		switch (method) {
			case 'GET':
				const categories = await prisma.category.findMany()
				return res.status(201).json(categories)
			default:
				// Method not suported.
				return res.status(401).end()
		}
	} catch (error) {
		return res.status(500).send(error)
	}
}
