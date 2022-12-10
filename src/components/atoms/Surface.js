import { Paper } from '@mui/material'

export const BaseSurface = (props) => {
	const { children } = props

	return (
		<Paper
			rounded
			elevation={2}
			sx={{
				backgroundColor: '#eee',
			}}
		>
			{children}
		</Paper>
	)
}