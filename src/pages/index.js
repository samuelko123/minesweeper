import { App } from '../components/minesweeper/App'
import {
	Box,
	Tooltip,
} from '@mui/material'
import { FaGithub } from 'react-icons/fa'
import { BaseStack } from '../components/atoms/Stack'
import { IconContext } from 'react-icons'

export default function Page() {
	return (
		<>
			<BaseStack gap={2}>
				<Box
					component='main'
					sx={{ padding: 2 }}
				>
					<App
						footer={
							<footer>
								<span>Samuel Ko | </span>
								<Tooltip title='Source code'>
									<a target='_blank' rel='noopener noreferrer' href='https://github.com/samuelko123/minesweeper'>
										<IconContext.Provider value={{ size: 20 }}>
											<FaGithub />
										</IconContext.Provider>
									</a>
								</Tooltip>
							</footer>
						}
					/>
				</Box>
			</BaseStack>
		</>
	)
}
