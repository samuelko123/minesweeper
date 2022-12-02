import React from 'react'
import { Box } from '@mui/material'

export const Counter = (props) => {
	const { value } = props

	const absInt = Math.floor(Math.abs(value))
	const text = absInt.toString().padStart(3, '0')

	return (
		<Box sx={{
			fontFamily: 'Digital Dismay',
			fontSize: 36,
			letterSpacing: 2,
			padding: '2px 4px 2px 8px',
			lineHeight: 1,
			backgroundColor: 'black',
			color: 'red',
		}}>
			{text}
		</Box>
	)
}