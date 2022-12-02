export default function App(props) {
	const {
		Component,
		pageProps: { ...pageProps },
	} = props

	return (
		<Component {...pageProps} />
	)
}