import { List } from '@mui/material'

export const BaseList = (props) => {
	const { children } = props

	return (
		<List disablePadding>
			{children}
		</List>
	)
}