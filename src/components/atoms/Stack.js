import React from 'react'
import { Stack } from '@mui/material'

export const BaseStack = React.forwardRef((props, ref) => {
	return (
		<Stack
			ref={ref}
			{...props}
		/>
	)
})