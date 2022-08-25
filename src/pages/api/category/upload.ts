import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import nextConnect from 'next-connect'
import upload from 'src/utils/upload'

const handler = nextConnect()

handler.use(upload.single('file'))

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const session = await getSession({ req })

		// Session must exist...
		if (!session) {
			return res.status(401).end()
		}
		return res.status(201).end(req.file.location)
	} catch (error) {
		return res.status(500).send(error)
	}
})

export const config = {
	api: {
		bodyParser: false
	}
}
export default handler
