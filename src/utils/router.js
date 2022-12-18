import { HTTP_STATUS } from './constants'
import { MethodNotAllowedError } from './errors'

export class Router {
	constructor() {
		this._middlewares = []
		this._handlers = {}
	}

	use(fn) {
		this._middlewares.push(fn)
	}

	route() {
		return async (req, res) => {
			try {
				const handler = this._handlers[req.method]
				if (!handler) {
					res.setHeader('Allow', Object.keys(this._handlers))
					throw new MethodNotAllowedError(`The requested resource does not support http method '${req.method}'`)
				}

				for (const middleware of this._middlewares) {
					await middleware(req, res)
				}

				const data = await handler(req, res)
				if (res.statusCode === HTTP_STATUS.NO_CONTENT) {
					res.end()
				} else {
					res.json(data)
				}
			} catch (err) {
				const status = err.status || HTTP_STATUS.SERVER_ERROR
				const data = { error: status === HTTP_STATUS.SERVER_ERROR ? 'Something went wrong' : err.message }
				res.status(status).json(data)

				if (status === HTTP_STATUS.SERVER_ERROR) {
					// eslint-disable-next-line no-console
					console.log(err.stack)
				}
			}
		}
	}

	get(fn) { this._handlers['GET'] = fn }
	post(fn) { this._handlers['POST'] = fn }
	put(fn) { this._handlers['PUT'] = fn }
	patch(fn) { this._handlers['PATCH'] = fn }
	delete(fn) { this._handlers['DELETE'] = fn }
}