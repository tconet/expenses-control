import multer from 'multer'
import multerS3 from 'multer-s3'
import crypto from 'crypto'
import { S3Client } from '@aws-sdk/client-s3'

const s3 = new S3Client({
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY,
		secretAccessKey: process.env.AWS_SECRET_KEY
	},
	region: process.env.AWS_REGION
})

const upload = multer({
	storage: multerS3({
		s3,
		bucket: process.env.AWS_BUCKET,
		acl: 'public-read',
		contentType: multerS3.AUTO_CONTENT_TYPE,
		metadata(req, file, cb) {
			cb(null, { fieldName: file.fieldname })
		},
		key: (req, file, cb) => {
			crypto.randomBytes(16, (err, hash) => {
				if (err) cb(err)

				const fileName = `${hash.toString('hex')}-${file.originalname}`
				cb(null, fileName)
			})
		}
	})
})

export default upload
