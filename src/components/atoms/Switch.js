import React from 'react'
import {
	FormControlLabel,
	FormGroup,
	Switch,
} from '@mui/material'

export const BaseSwitch = (props) => {
	const {
		checked,
		label,
		onChange: handleChange,
	} = props

	return (
		<FormGroup>
			<FormControlLabel
				label={label}
				control={
					<Switch
						checked={checked}
						onChange={handleChange}
					/>
				}
			/>
		</FormGroup>
	)
}