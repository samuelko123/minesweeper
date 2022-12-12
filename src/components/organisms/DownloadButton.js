import React from 'react'
import {
	child,
	get,
	getDatabase,
	ref,
} from 'firebase/database'
import {
	Alert,
	Stack,
} from '@mui/material'
import { FirebaseContext } from './FirebaseProvider'
import { useDispatch } from 'react-redux'
import { load as loadSettings } from '../../slices/settings'
import { getAuth } from 'firebase/auth'
import { LoadingButton } from '@mui/lab'

export const DownloadButton = () => {
	const {
		app,
	} = React.useContext(FirebaseContext)

	const dispatch = useDispatch()

	const [database, setDatabase] = React.useState(null)
	const [error, setError] = React.useState(null)
	const [success, setSuccess] = React.useState(false)
	const [currentUser, setCurrentUser] = React.useState(null)
	const [loading, setLoading] = React.useState(false)

	React.useEffect(() => {
		if (app) {
			const db = getDatabase(app)
			setDatabase(db)

			const auth = getAuth(app)
			auth.onAuthStateChanged(user => setCurrentUser(user))
		}
	}, [app])

	const upload = async () => {
		setLoading(true)
		setSuccess(false)
		setError(null)

		try {
			const dbRef = ref(database)
			const uid = currentUser.uid
			const key = `users/${uid}`
			const snapshot = await get(child(dbRef, key))
			if (snapshot.exists()) {
				const settings = snapshot.val()
				dispatch(loadSettings(settings))
			} else {
				throw new Error('No data available')
			}

			setSuccess(true)
		} catch (err) {
			setError(err)
		} finally {
			setLoading(false)
		}
	}

	if (!currentUser) {
		return null
	}

	return (
		<Stack gap={1} alignItems='flex-start'>
			<LoadingButton
				onClick={upload}
				variant='contained'
				loading={loading}
			>
				Download
			</LoadingButton>
			{error &&
				<Alert severity='error'>
					{error.message}
				</Alert>
			}
			{success &&
				<Alert severity='success'>
					Downloaded successfully
				</Alert>
			}
		</Stack>
	)
}