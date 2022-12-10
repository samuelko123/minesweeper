import React from 'react'
import { ListItemText } from '@mui/material'

export const BaseListItemText = React.forwardRef((props, ref) => {
	const {
		children,
		...otherProps
	} = props

	return (
		<ListItemText
			ref={ref}
			{...otherProps}
			sx={{ flex: 1 }}
		>
			{children}
		</ListItemText>
	)
})