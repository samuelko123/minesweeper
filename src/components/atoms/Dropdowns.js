import React from 'react'
import { BaseMenuItem } from './MenuItem'
import { BaseTextField } from './TextFields'

export const BaseDropdown = (props) => {
	const {
		label,
		value,
		options,
		onChange,
		inputProps,
	} = props

	return (
		<BaseTextField
			select
			value={value}
			label={label}
			onChange={(val) => onChange(val)}
			{...inputProps}
		>
			{
				options.map(option => {
					if (!option || option.label === undefined || option.value === undefined) {
						return null
					}

					return (
						<BaseMenuItem
							key={option.value}
							value={option.value}
						>
							{option.label}
						</BaseMenuItem>
					)
				})
			}
		</BaseTextField>
	)
}