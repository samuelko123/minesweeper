import { App } from '../components/App'
import {
	Box,
	Tooltip,
} from '@mui/material'
import { FaGithub } from 'react-icons/fa'
import { BaseStack } from '../components/atoms/Stack'
import { IconContext } from 'react-icons'
import Head from 'next/head'
import Link from 'next/link'

export default function Page() {
	return (
		<>
			<Head>
				{
					[0, 1, 2, 3, 4, 5, 6, 7, 8, 'explode', 'flag', 'hidden', 'mine', 'wrong'].map(name => {
						(
							<Link
								rel='preload'
								href={`/images/${name}.svg`}
								as='image'
							/>
						)
					})
				}
			</Head>
			<BaseStack gap={2}>
				<Box
					component='main'
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						padding: 2,
					}}
				>
					<App />
				</Box>
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
			</BaseStack>
		</>
	)
}
