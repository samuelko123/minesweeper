import { initializeApp } from 'firebase/app'
import React from 'react'

export const FirebaseContext = React.createContext({})

export const FirebaseProvider = (props) => {
	const { children } = props

	const [app, setApp] = React.useState(null)

	React.useEffect(() => {
		const firebaseConfig = {
			apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
			authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
			databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
			projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
			storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
			messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
			appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
			measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
		}

		const _app = initializeApp(firebaseConfig)
		setApp(_app)
	}, [])

	return (
		<FirebaseContext.Provider
			value={{ app }}
		>
			{children}
		</FirebaseContext.Provider>
	)
}