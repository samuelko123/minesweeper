import {
	Box,
	List,
	ListSubheader,
	Paper,
} from '@mui/material'
import React from 'react'

export const BaseList = (props) => {
	const {
		children,
		title,
	} = props

	return (
		<Box>
			<ListSubheader
				component='h5'
				sx={{ margin: 0 }}
			>
				{title}
			</ListSubheader>
			<Paper>
				<List>
					{children}
				</List>
			</Paper>
		</Box>
	)
}