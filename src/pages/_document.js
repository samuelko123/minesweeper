import Document, {
	Head,
	Html,
	Main,
	NextScript,
} from 'next/document'

export default class MyDocument extends Document {
	render() {
		return (
			<Html lang='en'>
				<Head>
					<meta charSet='utf-8' />
					<meta name='description' content='The classic Minesweeper game built by Samuel Ko' />
					<meta property='og:title' content='Minesweeper' />
					<meta property='og:type' content='website' />
					<meta property='og:url' content='https://minesweeper.samuelko123.com/' />
					<meta property='og:image' content='https://minesweeper.samuelko123.com/og-image.png' />
					<meta property='og:description' content='The classic Minesweeper game built by Samuel Ko' />
					<link rel='manifest' href='site.webmanifest' />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}