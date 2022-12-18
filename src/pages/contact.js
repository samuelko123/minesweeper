import React from 'react'
import axios, { AxiosError } from 'axios'
import { LoadingButton } from '@mui/lab'
import {
	Alert,
	Stack,
} from '@mui/material'
import { BaseHeader } from '../components/atoms/Header'
import { BaseTextField } from '../components/atoms/TextFields'
import { HTTP_STATUS } from '../utils/constants'

export default function Page() {
	const [name, setName] = React.useState('')
	const [email, setEmail] = React.useState('')
	const [message, setMessage] = React.useState('')

	const [success, setSuccess] = React.useState(false)
	const [error, setError] = React.useState(null)
	const [loading, setLoading] = React.useState(false)

	const handleSubmit = async (e) => {
		e.preventDefault()

		setSuccess(false)
		setError(null)
		setLoading(true)

		try {
			await axios.post('/api/contact', {
				name,
				email,
				message,
			})
			setSuccess(true)
		} catch (err) {
			if (err instanceof AxiosError) {
				if (err.response.status === HTTP_STATUS.NOT_FOUND) {
					setError('Error 404 - Sorry, the message cannot find its destination')
				} else if (err.response.status === HTTP_STATUS.BAD_REQUEST) {
					const msg = 'Please correct your input:\n' + err.response.data.error.map((obj, index) => `${index + 1}. ${obj.message}`).join('\n')
					setError(msg)
				} else {
					setError(err.response.data)
				}
			} else {
				setError(err.message)
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<Stack
			component='form'
			gap={2}
			sx={{
				maxWidth: 600,
			}}
			onSubmit={handleSubmit}
		>
			<BaseHeader>Contact me</BaseHeader>
			<BaseTextField
				label='Name'
				value={name}
				onChange={setName}
			/>
			<BaseTextField
				label='Email'
				value={email}
				onChange={setEmail}
			/>
			<BaseTextField
				label='Message'
				value={message}
				onChange={setMessage}
				multiline
				rows={10}
			/>
			<LoadingButton
				type='submit'
				variant='contained'
				loading={loading}
				sx={{ alignSelf: 'flex-start' }}
			>
				Submit
			</LoadingButton>
			{error &&
				<Alert
					severity='error'
					sx={{
						display: 'inline-flex',
						width: 'fit-content',
						whiteSpace: 'pre-wrap',
					}}
				>
					{typeof error === 'object' ?
						JSON.stringify(error, null, 2) :
						error
					}
				</Alert>
			}
			{success &&
				<Alert severity='success'>
					Message sent successfully
				</Alert>
			}
		</Stack>
	)
}