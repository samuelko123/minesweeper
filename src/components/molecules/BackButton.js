import React from 'react'
import { useRouter } from 'next/router'
import { MdArrowBackIos } from 'react-icons/md'
import { LoadingButton } from '@mui/lab'

export const BackButton = (props) => {
	const { href } = props

	const router = useRouter()
	const [loading, setLoading] = React.useState(false)

	return (
		<LoadingButton
			variant='outlined'
			startIcon={<MdArrowBackIos />}
			loading={loading}
			onClick={() => {
				setLoading(true)
				router.push(href)
			}}
			sx={{ alignSelf: 'flex-start' }}
		>
			Back
		</LoadingButton>
	)
}