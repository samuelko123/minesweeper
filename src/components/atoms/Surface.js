import { Paper } from '@mui/material'

export const BaseSurface = (props) => {
	const { children } = props

	return (
		<Paper
			elevation={2}
			sx={{
				backgroundColor: (theme) => theme.palette.surface,
			}}
		>
			{children}
		</Paper>
	)
}