import React from 'react'
import { ListItem } from '@mui/material'

export const BaseListItem = React.forwardRef((props, ref) => {
	const {
		children,
		...otherProps
	} = props

	return (
		<ListItem
			ref={ref}
			divider
			{...otherProps}
			sx={{
				gap: 1,
				alignItems: 'flex-start',
			}}
		>
			{children}
		</ListItem>
	)
})