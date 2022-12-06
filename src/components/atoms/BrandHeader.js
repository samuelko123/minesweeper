import React from 'react'
import { BaseLink } from './Links'
import { BaseHeader } from './Header'

export const BrandHeader = (props) => {
	const {
		title,
		href,
	} = props

	return (
		<BaseLink href={href}>
			<BaseHeader
				sx={{
					cursor: 'pointer',
				}}
			>
				{title}
			</BaseHeader>
		</BaseLink>
	)
}