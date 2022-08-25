import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from 'lib/prisma'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const session = await getSession({ req })
		const { symbol, company_name, document, description, image } = req.body

		// Session must exist...
		if (!session) {
			return res.status(401).end()
		}

		// Only accept POST request.
		if (req.method !== 'POST') {
			return res.status(401).end('Only suport POST request!')
		}

		// Call prisma to create a new entity.
		const entity = await prisma.stock.create({
			data: {
				symbol,
				company_name,
				document,
				description,
				image
			}
		})
		return res.status(201).json(entity)
	} catch (error) {
		return res.status(500).send(error)
	}
}
