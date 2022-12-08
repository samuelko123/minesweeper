import { Provider as ReduxProvider } from 'react-redux'
import { CssBaseline } from '@mui/material'
import { store } from '../slices'
import '../styles/global.css'
import { BaseAppBar } from '../components/atoms/AppBar'
import { BrandHeader } from '../components/atoms/BrandHeader'
import Head from 'next/head'

export default function App(props) {
	const {
		Component,
		pageProps: { ...pageProps },
	} = props

	const title = 'Minesweeper'
	const desc = 'The classic Minesweeper game built by Samuel Ko'

	return (
		<ReduxProvider store={store}>
			<Head>
				<title>{title}</title>
				<meta charSet='utf-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<meta name='description' content={desc} />
				<meta property='og:title' content='Minesweeper' />
				<meta property='og:url' content='https://minesweeper.samuelko123.com/' />
				<meta property='og:type' content='website' />
				<meta property='og:image' content='og-image.png' />
				<meta property='og:description' content={desc} />
				<link rel='manifest' href='site.webmanifest' />
			</Head>
			<CssBaseline />
			<BaseAppBar>
				<BrandHeader
					href='/'
					title={title}
				/>
			</BaseAppBar>
			<Component {...pageProps} />
		</ReduxProvider>
	)
}