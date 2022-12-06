import React from 'react'
import { Typography } from '@mui/material'

export const BaseHeader = React.forwardRef((props, ref) => {
	return (
		<Typography
			ref={ref}
			{...props}
			variant='h6'
			component='h6'
			noWrap
		/>
	)
})