import React from 'react'
import { AppBar } from '@mui/material'

export const BaseAppBar = (props) => {
	const { children } = props

	return (
		<AppBar
			elevation={2}
			sx={{
				position: 'static',
				padding: (theme) => theme.spacing(1),
				paddingLeft: (theme) => theme.spacing(2),
				paddingRight: (theme) => theme.spacing(2),
				height: (theme) => theme.spacing(7),
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center',
			}}
		>
			{children}
		</AppBar>
	)
}