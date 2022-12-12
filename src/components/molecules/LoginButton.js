import {
	Button,
	Typography,
} from '@mui/material'

export const LoginButton = (props) => {
	const {
		color,
		onClick,
		startIcon,
		children,
	} = props

	return (
		<Button
			onClick={onClick}
			color={color}
			variant='contained'
			sx={{
				padding: 0,
				textTransform: 'none',
			}}
		>
			{startIcon}
			<Typography
				paddingLeft={1}
				paddingRight={1}
			>
				{children}
			</Typography>
		</Button>
	)
}