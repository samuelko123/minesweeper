import { HTTP_STATUS } from './constants'

export class UnauthorizedError extends Error {
	constructor() {
		super()
		this.message = 'Login failed'
		this.status = HTTP_STATUS.UNAUTHORIZED
	}
}

export class BadRequestError extends Error {
	constructor(message) {
		super()
		this.message = message
		this.status = HTTP_STATUS.BAD_REQUEST
	}
}

export class MethodNotAllowedError extends Error {
	constructor(message) {
		super()
		this.message = message
		this.status = HTTP_STATUS.METHOD_NOT_ALLOWED
	}
}