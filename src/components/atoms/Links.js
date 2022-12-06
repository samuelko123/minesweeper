import NextLink from 'next/link'
import { Link as MuiLink } from '@mui/material'

export const BaseLink = (props) => {
	const {
		href,
		children,
		disabled,
	} = props

	if (disabled) {
		return children
	}

	return (
		<MuiLink
			href={href}
			color='inherit'
			underline='none'
			component={NextLink}
		>
			{children}
		</MuiLink>
	)
}