import axios from 'axios'
import { checkBody } from '../../middlewares/checkBody'
import { Router } from '../../utils/router'

const router = new Router()

router.use(checkBody({
	type: 'object',
	required: ['name', 'email', 'message'],
	additionalProperties: false,
	properties: {
		'name': {
			type: 'string',
		},
		'email': {
			type: 'string',
		},
		'message': {
			type: 'string',
			isNotEmpty: false,
		},
	},
}))

router.post(async (req) => {
	const {
		name,
		email,
		message,
	} = req.body

	const headers = {
		'api-key': process.env.EMAIL_API_KEY,
	}
	const data = {
		sender: {
			name: process.env.EMAIL_SENDER_NAME,
			email: process.env.EMAIL_SENDER_ADDRESS,
		},
		to: [
			{ email: process.env.EMAIL_SENDER_ADDRESS },
		],
		subject: 'New message from Minesweeper',
		htmlContent: `
			<html>
			<body>
				<p>Name: ${name}</p>
				<p>Email: ${email}</p>
				<p>Message:</p>
				<p>${message.replaceAll('\n', '<br/>')}</p>
			</body>
			</html>
		`,
	}

	await axios.post(process.env.EMAIL_API_URL, data, { headers })

	return {}
})

export default router.route()