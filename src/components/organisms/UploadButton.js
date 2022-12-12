import React from 'react'
import {
	getDatabase,
	ref,
	set,
} from 'firebase/database'
import {
	Alert,
	Button,
	Stack,
} from '@mui/material'
import { FirebaseContext } from './FirebaseProvider'
import { useSelector } from 'react-redux'
import { settingsSelector } from '../../slices/settings'
import { getAuth } from 'firebase/auth'

export const UploadButton = () => {
	const {
		app,
	} = React.useContext(FirebaseContext)

	const [database, setDatabase] = React.useState(null)
	const [error, setError] = React.useState(null)
	const [success, setSuccess] = React.useState(false)
	const [currentUser, setCurrentUser] = React.useState(null)

	const settings = useSelector(settingsSelector)

	React.useEffect(() => {
		if (app) {
			const db = getDatabase(app)
			setDatabase(db)

			const auth = getAuth(app)
			auth.onAuthStateChanged(user => setCurrentUser(user))
		}
	}, [app])

	const upload = async () => {
		setSuccess(false)
		setError(null)

		try {
			const uid = currentUser.uid
			const key = `users/${uid}`
			await set(ref(database, key), settings)

			setSuccess(true)
		} catch (err) {
			setError(err)
		}
	}

	if (!currentUser) {
		return null
	}

	return (
		<Stack gap={1} alignItems='flex-start'>
			<Button
				onClick={upload}
				variant='contained'
			>
				Upload
			</Button>
			{error &&
				<Alert severity='error'>
					{error.message}
				</Alert>
			}
			{success &&
				<Alert severity='success'>
					Uploaded successfully
				</Alert>
			}
		</Stack>
	)
}