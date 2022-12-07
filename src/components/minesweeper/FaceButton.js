import React from 'react'
import { Button } from '@mui/material'
import { IconContext } from 'react-icons'

export const FaceButton = (props) => {
	const {
		onClick: handleClick,
		label,
		children,
	} = props

	return (
		<Button
			onClick={handleClick}
			size='small'
			aria-label={label}
			disableFocusRipple
			disableRipple
			sx={{
				minWidth: 24,
				width: 30,
				height: 30,
				padding: 0,
				borderRadius: 0,

				backgroundColor: '#c0c0c0',
				':hover': {
					backgroundColor: '#c0c0c0',
				},

				boxShadow: '1px 1px 2px #555',
				':active': {
					boxShadow: '1px 1px 2px #555 inset',
				},
			}}
		>
			<IconContext.Provider
				value={{
					color: '#ffff00',
					size: 24,
				}}
			>
				{children}
			</IconContext.Provider>
		</Button>
	)
}