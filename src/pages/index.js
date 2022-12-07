import { App } from '../components/minesweeper/App'
import { Box } from '@mui/material'
import { BaseStack } from '../components/atoms/Stack'
import { Footer } from '../components/molecules/Footer'

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
							<Footer
								githubHref='https://github.com/samuelko123/minesweeper'
								iconSize={20}
							/>
						}
					/>
				</Box>
			</BaseStack>
		</>
	)
}
