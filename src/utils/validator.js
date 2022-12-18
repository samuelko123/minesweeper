import Ajv from 'ajv'
import { betterAjvErrors } from '@apideck/better-ajv-errors'
import { BadRequestError } from './errors'

export class Validator {
	static _ajv = new Ajv({
		removeAdditional: false,
		useDefaults: true,
		coerceTypes: true,
		allErrors: true,
		logger: false,
	})
		.addKeyword('isNotEmpty', {
			type: 'string',
			validate: function (schema, data) {
				return typeof data === 'string' && data.trim() !== ''
			},
			errors: {
				message: 'cannot be empty',
			},
		})

	static validate(schema, obj) {
		this._ajv.compile(schema)
		const is_valid = this._ajv.validate(schema, obj)
		if (!is_valid) {
			const errors = betterAjvErrors({
				schema,
				data: obj,
				errors: this._ajv.errors,
			})
			throw new BadRequestError(errors)
		}

		return obj
	}
}