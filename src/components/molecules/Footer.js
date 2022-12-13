import {
	Box,
	Tooltip,
} from '@mui/material'
import { FaGithub } from 'react-icons/fa'
import { ExternalLink } from '../atoms/Links'

export const Footer = (props) => {
	const {
		githubHref,
		iconSize,
	} = props

	return (
		<Box
			component='footer'
			sx={{
				marginTop: 5,
				alignSelf: 'center',
			}}
		>
			<Box component='span'>Samuel Ko | </Box>
			<ExternalLink
				target='_blank'
				rel='noopener noreferrer'
				href={githubHref}
				disableIcon
			>
				<Tooltip
					title='Source code'
					placement='top'
				>
					<Box
						component='span'
						sx={{ verticalAlign: 'text-top' }}
					>
						<FaGithub size={iconSize} />
					</Box>
				</Tooltip>
			</ExternalLink>
		</Box>
	)
}