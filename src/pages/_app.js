import { CssBaseline } from '@mui/material'
import '../styles/global.css'

export default function App(props) {
	const {
		Component,
		pageProps: { ...pageProps },
	} = props

	return (
		<>
			<CssBaseline />
			<Component {...pageProps} />
		</>
	)
}