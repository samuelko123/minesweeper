import React from 'react'
import { MenuItem } from '@mui/material'

export const BaseMenuItem = (props) => {
	const {
		children,
		startIcon,
		...otherProps
	} = props

	const {
		sx,
		...remainingProps
	} = otherProps

	return (
		<MenuItem
			divider
			sx={{
				display: 'flex',
				flexDirection: 'row',
				gap: 1,
				width: '100%',
				padding: 2,
				...sx,
			}}
			{...remainingProps}
		>
			{startIcon || null}
			{children}
		</MenuItem>
	)
}