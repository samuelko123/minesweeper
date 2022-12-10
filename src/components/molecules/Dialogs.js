import React from 'react'
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from '@mui/material'

export const BaseDialog = (props) => {
	const {
		open,
		onClose: handleClose,
		title,
		children,
		showCancelButton,
		actionButton,
	} = props

	return (
		<Dialog
			open={open}
			onClose={handleClose}
		>
			<DialogTitle>
				{title}
			</DialogTitle>
			<DialogContent>
				{children}
			</DialogContent>
			<DialogActions>
				{showCancelButton &&
					<Button onClick={handleClose}>
						Cancel
					</Button>
				}
				{actionButton}
			</DialogActions>
		</Dialog >
	)
}