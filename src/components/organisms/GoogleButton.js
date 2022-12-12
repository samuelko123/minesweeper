import React from 'react'
import {
	GoogleAuthProvider,
	browserLocalPersistence,
	getAuth,
	setPersistence,
	signInWithPopup,
	signOut,
} from 'firebase/auth'
import GoogleIcon from '../../images/google.svg'
import { LoginButton } from '../molecules/LoginButton'
import {
	Alert,
	Stack,
	Typography,
} from '@mui/material'
import { FirebaseContext } from './FirebaseProvider'

export const GoogleButton = () => {
	const {
		app,
	} = React.useContext(FirebaseContext)

	const [auth, setAuth] = React.useState(null)
	const [currentUser, setCurrentUser] = React.useState(auth?.currentUser)
	const [error, setError] = React.useState(null)

	React.useEffect(() => {
		if (app) {
			const _auth = getAuth(app)
			_auth.onAuthStateChanged(user => setCurrentUser(user))
			setAuth(_auth)
		}
	}, [app])

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
				<Typography>You are signed in as <b>{currentUser.displayName}</b>.</Typography>
			}
		</Stack>
	)
}