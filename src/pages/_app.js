import { Provider as ReduxProvider } from 'react-redux'
import { CssBaseline } from '@mui/material'
import { store } from '../slices'
import '../styles/global.css'
import { BaseAppBar } from '../components/atoms/AppBar'
import { BrandHeader } from '../components/atoms/BrandHeader'

export default function App(props) {
	const {
		Component,
		pageProps: { ...pageProps },
	} = props

	const title = 'Minesweeper'

	return (
		<ReduxProvider store={store}>
			<title>{title}</title>
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