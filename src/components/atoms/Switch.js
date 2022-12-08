import * as React from 'react'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'

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