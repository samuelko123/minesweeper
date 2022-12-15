import React from 'react'
import Head from 'next/head'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import {
	AppBar,
	CssBaseline,
	Stack,
	ThemeProvider,
} from '@mui/material'
import {
	persistor,
	store,
} from '../slices'
import '../styles/global.css'
import { BrandHeader } from '../components/atoms/BrandHeader'
import { MenuButton } from '../components/organisms/MenuButton'
import {
	MdHome,
	MdOutlineHelp,
	MdSettings,
} from 'react-icons/md'
import { theme } from '../styles/theme'
import { IconContext } from 'react-icons'
import { Footer } from '../components/molecules/Footer'

export default function App(props) {
	const {
		Component,
		pageProps: { ...pageProps },
	} = props

	return (
		<ReduxProvider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<ThemeProvider theme={theme}>
					<IconContext.Provider value={{ color: theme.palette.primary.main }}>
						<Head>
							<title>Minesweeper</title>
							<meta charSet='utf-8' />
							<meta name='viewport' content='width=device-width, initial-scale=1' />
							<meta name='description' content='The classic Minesweeper game built by Samuel Ko' />
							<meta property='og:title' content='Minesweeper' />
							<meta property='og:type' content='website' />
							<meta property='og:url' content='https://minesweeper.samuelko123.com/' />
							<meta property='og:image' content='https://minesweeper.samuelko123.com/og-image.png' />
							<meta property='og:description' content='The classic Minesweeper game built by Samuel Ko' />
							<link rel='manifest' href='site.webmanifest' />
						</Head>
						<CssBaseline />
						<AppBar>
							<BrandHeader
								href='/'
								title='Minesweeper'
							/>
							<MenuButton
								size={32}
								items={[
									{
										href: '/',
										icon: <MdHome />,
										title: 'Home',
									},
									{
										href: '/settings',
										icon: <MdSettings />,
										title: 'Settings',
									},
									{
										href: '/how-to-play',
										icon: <MdOutlineHelp />,
										title: 'How To Play',
									},
								]}
							/>
						</AppBar>
						<Stack
							component='main'
							padding={2}
						>
							<Component {...pageProps} />
							<Footer
								githubHref='https://github.com/samuelko123/minesweeper'
								iconSize={20}
							/>
						</Stack>
					</IconContext.Provider>
				</ThemeProvider>
			</PersistGate>
		</ReduxProvider>
	)
}