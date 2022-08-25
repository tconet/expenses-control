import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from 'lib/prisma'
import AWS from 'aws-sdk'

// https://www.npmjs.com/package/react-aws-s3
// S3 client configuration
const s3Client = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_SECRET_KEY
})

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const session = await getSession({ req })

		// Session must exist...
		if (!session) {
			return res.status(401).end()
		}

		// Only accept DELETE request.
		if (req.method !== 'DELETE') {
			return res.status(401).end('Only suport DELETE request!')
		}

		// Get the stock to be deleted based on it's id.
		const entity = await prisma.stock.findUnique({
			where: {
				id: req.query.id
			}
		})

		// Must exists
		// Before delete the entity, first we must delete
		// the image from AWS S3 storage.
		if (entity) {
			// Build the S3 request params.
			const imageUrl = entity.image.split('/')
			const params = {
				Bucket: process.env.AWS_BUCKET,
				Key: imageUrl[3] // The third index is the object key
			}
			// Delete the object from S3
			await s3Client.deleteObject(params).promise()
			// Delete the entity
			await prisma.stock.delete({
				where: {
					id: req.query.id
				}
			})
			// Return success message.
			return res.status(200).send('Ação excluída com sucesso!')
		} else {
			// Something goes wrong...
			return res.status(500).send('Erro ou excluir Ação.')
		}
	} catch (error) {
		console.log('ERRO..' + error)
		return res.status(500).send(error)
	}
}
