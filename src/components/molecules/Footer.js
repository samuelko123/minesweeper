import {
	Box,
	Tooltip,
} from '@mui/material'
import { IconContext } from 'react-icons'
import { FaGithub } from 'react-icons/fa'

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
			<span>Samuel Ko | </span>
			<Tooltip
				title='Source code'
				placement='top'
			>
				<a
					target='_blank'
					rel='noopener noreferrer'
					href={githubHref}
				>
					<span
						style={{ verticalAlign: 'text-top' }}
					>
						<IconContext.Provider value={{ size: iconSize }}>
							<FaGithub />
						</IconContext.Provider>
					</span>
				</a>
			</Tooltip>
		</Box>
	)
}