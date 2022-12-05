import { Provider as ReduxProvider } from 'react-redux'
import { CssBaseline } from '@mui/material'
import { store } from '../slices'
import '../styles/global.css'

export default function App(props) {
	const {
		Component,
		pageProps: { ...pageProps },
	} = props

	return (
		<ReduxProvider store={store}>
			<CssBaseline />
			<Component {...pageProps} />
		</ReduxProvider>
	)
}