import { Box } from '@mui/material'

export const BorderedBox = (props) => {
	const {
		borderWidth,
		raised,
		sunken,
		children,
		...otherProps
	} = props

	const white = '#fff'
	const gray = '#808080'
	const {
		sx,
		...remainingProps
	} = otherProps

	return (
		<Box
			sx={{
				margin: 0,
				padding: 0,
				borderStyle: 'solid',
				borderWidth: borderWidth,
				borderTopColor: sunken ? gray : white,
				borderLeftColor: sunken ? gray : white,
				borderRightColor: raised ? gray : white,
				borderBottomColor: raised ? gray : white,
				...sx,
			}}
			{...remainingProps}
		>
			{children}
		</Box>
	)
}