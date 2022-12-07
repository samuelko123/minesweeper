import React from 'react'
import { Button } from '@mui/material'
import { BorderedBox } from '../molecules/BorderedBox'

const MOUSE_CLICK = Object.freeze({
	LEFT: 1,
})

export const FaceButton = (props) => {
	const {
		onClick: handleClick,
		label,
		children,
	} = props

	const [pressed, setPressed] = React.useState(false)

	const handleMouseDown = (e) => {
		if (e.buttons === MOUSE_CLICK.LEFT) {
			setPressed(true)
		}
	}

	const handleMouseUp = () => {
		setPressed(false)
	}

	return (
		<BorderedBox
			borderWidth={4}
			raised={!pressed}
			sunken={pressed}
		>
			<Button
				onClick={handleClick}
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
				size='small'
				aria-label={label}
				disableFocusRipple
				disableRipple
				sx={{
					minWidth: 24,
					width: 36,
					height: 36,
					padding: 0,
					borderRadius: 0,
					fontSize: 24,
				}}
			>
				{children}
			</Button>
		</BorderedBox>
	)
}