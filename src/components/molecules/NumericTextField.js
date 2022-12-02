import React from 'react'
import { BaseTextField } from '../atoms/TextFields.js'

export const NumericTextField = (props) => {
	const {
		label,
		value: defaultValue,
		min,
		max,
		onBlur,
	} = props

	const [value, setValue] = React.useState(defaultValue)

	const handleChange = (text) => {
		const regex = /[0-9]+/g
		const num = text.match(regex)
		setValue(num)
	}

	const handleBlur = () => {
		let num = value
		num = Math.max(num, min)
		num = Math.min(num, max)
		setValue(num)
		onBlur(num)
	}

	return (
		<BaseTextField
			label={label}
			value={value}
			onChange={handleChange}
			onBlur={handleBlur}
			InputLabelProps={{ shrink: true }}
		/>
	)
}