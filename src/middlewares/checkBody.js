import { Validator } from '../utils/validator'

export const checkBody = (schema) => {
	return async (req) => {
		Validator.validate(schema, req.body)
	}
}