import React from 'react'
import { MenuItem } from '@mui/material'
import { BaseStack } from './Stack'

export const BaseMenuItem = React.forwardRef((props, ref) => {
	const {
		children,
		startIcon,
		...otherProps
	} = props

	return (
		<MenuItem
			ref={ref}
			{...otherProps}
			divider
			sx={{ padding: 2 }}
		>
			<BaseStack
				gap={1}
				flexDirection='row'
			>
				{startIcon || null}
				{children}
			</BaseStack>
		</MenuItem>
	)
})