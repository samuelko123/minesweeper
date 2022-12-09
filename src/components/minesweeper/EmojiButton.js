import React from 'react'
import { Button } from '@mui/material'
import { BorderedBox } from '../molecules/BorderedBox'

export const EmojiButton = (props) => {
	const {
		onClick: handleClick,
		label,
		children,
	} = props

	const [pressed, setPressed] = React.useState(false)

	const handleMouseDown = () => {
		setPressed(true)
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
				onTouchStart={handleMouseDown}
				onTouchEnd={handleMouseUp}
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
					fontSize: 24,
				}}
			>
				{children}
			</Button>
		</BorderedBox>
	)
}