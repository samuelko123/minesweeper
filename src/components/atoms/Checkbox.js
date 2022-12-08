import * as React from 'react'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

export const BaseCheckbox = (props) => {
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
					<Checkbox
						checked={checked}
						onChange={handleChange}
					/>
				}
			/>
		</FormGroup>
	)
}