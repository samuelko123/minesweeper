import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { CssBaseline } from '@mui/material'
import {
	persistor,
	store,
} from '../slices'
import '../styles/global.css'
import { BaseAppBar } from '../components/atoms/AppBar'
import { BrandHeader } from '../components/atoms/BrandHeader'
import Head from 'next/head'
import { MainMenu } from '../components/organisms/MainMenu'

export default function App(props) {
	const {
		Component,
		pageProps: { ...pageProps },
	} = props

	const title = 'Minesweeper'
	const desc = 'The classic Minesweeper game built by Samuel Ko'

	return (
		<ReduxProvider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<Head>
					<title>{title}</title>
					<meta charSet='utf-8' />
					<meta name='viewport' content='width=device-width, initial-scale=1' />
					<meta name='description' content={desc} />
					<meta property='og:title' content='Minesweeper' />
					<meta property='og:type' content='website' />
					<meta property='og:url' content={process.env.NEXT_PUBLIC_URL} />
					<meta property='og:image' content={process.env.NEXT_PUBLIC_URL + '/og-image.png'} />
					<meta property='og:description' content={desc} />
					<link rel='manifest' href='site.webmanifest' />
				</Head>
				<CssBaseline />
				<BaseAppBar>
					<BrandHeader
						href='/'
						title={title}
					/>
					<MainMenu buttonSize={32} />
				</BaseAppBar>
				<Component {...pageProps} />
			</PersistGate>
		</ReduxProvider>
	)
}