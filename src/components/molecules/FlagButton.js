import { ToggleButton } from '@mui/material'
import { TfiFlag } from 'react-icons/tfi'

export const FlagButton = (props) => {
	const {
		onClick,
		selected,
		sx,
		size,
	} = props

	return (
		<ToggleButton
			value='flag'
			selected={selected}
			onClick={onClick}
			sx={{
				color: theme => theme.palette.primary.main,
				backgroundColor: theme => theme.palette.surface.default,
				':hover': {
					opacity: 1,
					color: theme => theme.palette.primary.main,
					backgroundColor: theme => theme.palette.surface.default,
				},
				'&.Mui-selected': {
					color: theme => theme.palette.surface.default,
					backgroundColor: theme => theme.palette.primary.main,
				},
				'&.Mui-selected:hover': {
					opacity: 1,
					color: theme => theme.palette.surface.default,
					backgroundColor: theme => theme.palette.primary.main,
				},
				...sx,
			}}
		>
			<TfiFlag
				color='inherit'
				size={size}
			/>
		</ToggleButton>
	)
}