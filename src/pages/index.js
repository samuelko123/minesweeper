import { App } from '../components/minesweeper/App'
import { Footer } from '../components/molecules/Footer'

export default function Page() {
	return (
		<App
			footer={
				<Footer
					githubHref='https://github.com/samuelko123/minesweeper'
					iconSize={20}
				/>
			}
		/>
	)
}
