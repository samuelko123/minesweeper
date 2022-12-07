import {
	FormControl,
	InputLabel,
	Select,
} from '@mui/material'
import React from 'react'
import { BaseMenuItem } from './MenuItem'

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
							<BaseMenuItem
								key={option.value}
								value={option.value}
							>
								{option.label}
							</BaseMenuItem>
						)
					})
				}
			</Select>
		</FormControl>
	)
}