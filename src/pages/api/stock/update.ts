import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from 'lib/prisma'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const session = await getSession({ req })
		const { id, symbol, company_name, document, description, image } = req.body

		// Session must exist...
		if (!session) {
			return res.status(401).end()
		}

		// Only accept PUT request.
		if (req.method !== 'PUT') {
			return res.status(401).end('Only suport PUT request!')
		}

		// Call prisma to create a new profile.
		const entity = await prisma.stock.update({
			where: {
				id: id
			},
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
		console.log('ERRO..' + error)
		return res.status(500).send(error)
	}
}
