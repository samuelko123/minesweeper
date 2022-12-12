import React from 'react'
import {
	GoogleAuthProvider,
	browserLocalPersistence,
	getAuth,
	setPersistence,
	signInWithPopup,
	signOut,
} from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import GoogleIcon from '../../images/google.svg'
import { LoginButton } from '../molecules/LoginButton'
import {
	Alert,
	Stack,
	Typography,
} from '@mui/material'

export const GoogleButton = () => {
	const [auth, setAuth] = React.useState(null)
	const [currentUser, setCurrentUser] = React.useState(auth?.currentUser)
	const [error, setError] = React.useState(null)

	React.useEffect(() => {
		const firebaseConfig = {
			apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
			authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
			projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
			storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
			messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
			appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
			measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
		}

		const app = initializeApp(firebaseConfig)
		const _auth = getAuth(app)
		_auth.onAuthStateChanged(user => setCurrentUser(user))
		setAuth(_auth)
	}, [])

	const handleSignIn = async () => {
		setError(null)

		try {
			const provider = new GoogleAuthProvider()
			await setPersistence(auth, browserLocalPersistence)
			await signInWithPopup(auth, provider)
		} catch (err) {
			setError(err)
		}
	}

	const handleSignOut = async () => {
		setError(null)

		try {
			await signOut(auth)
		} catch (err) {
			setError(err)
		}
	}

	return (
		<Stack gap={1} alignItems='flex-start'>
			<LoginButton
				onClick={!currentUser ? handleSignIn : handleSignOut}
				color='google'
				startIcon={<GoogleIcon size={36} />}
			>
				{!currentUser ? 'Connect' : 'Disconnect'}
			</LoginButton>
			{error && error?.code !== 'auth/popup-closed-by-user' && error?.code !== 'auth/cancelled-popup-request' &&
				<Alert severity='error'>
					<Typography>{error.code}</Typography>
					<Typography>{error.message}</Typography>
				</Alert>
			}
			{currentUser &&
				<Typography>You are signed in as {currentUser.displayName}.</Typography>
			}
			{!currentUser &&
				<Typography>You not signed in.</Typography>
			}
		</Stack>
	)
}