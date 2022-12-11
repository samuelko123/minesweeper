import NextLink from 'next/link'
import { Link as MuiLink } from '@mui/material'
import { HiExternalLink } from 'react-icons/hi'

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

export const ExternalLink = (props) => {
	const {
		href,
		children,
		disabled,
		disableIcon,
	} = props

	if (disabled) {
		return children
	}

	return (
		<MuiLink
			target='_blank'
			rel='noreferrer'
			href={href}
		>
			{children}
			{!disableIcon && <HiExternalLink />}
		</MuiLink>
	)
}