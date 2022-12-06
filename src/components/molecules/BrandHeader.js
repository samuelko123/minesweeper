import React from 'react'
import { BaseLink } from '../atoms/Links'
import { BaseHeader } from '../atoms/Header'

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