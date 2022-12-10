import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
} from '@mui/material'
import React from 'react'

export const BaseDropdown = (props) => {
	const {
		label,
		value,
		options,
		onChange,
	} = props

	return (
		<FormControl>
			<InputLabel>{label}</InputLabel>
			<Select
				size='small'
				autoWidth={true}
				value={value}
				label={label}
				onChange={(e) => onChange(e.target.value)}
				MenuProps={{
					MenuListProps: {
						sx: {
							padding: 0,
						},
					},
				}}
			>
				{
					options.map(option => {
						if (!option || option.label === undefined || option.value === undefined) {
							return null
						}

						return (
							<MenuItem
								key={option.value}
								value={option.value}
							>
								{option.label}
							</MenuItem>
						)
					})
				}
			</Select>
		</FormControl>
	)
}