import {
	InputLabel,
	NativeSelect,
} from '@material-ui/core'
import React from 'react'
const constants = require('../lib/constants')

export default class Dropdown extends React.Component {

	handleChange = (e) => {
		const val = parseInt(e.target.value)
		this.props.notifyChange(val)
	}

	render() {
		const arr = []
		const modes = constants.MODES
		for (let i = 0, n = modes.length; i < n; i++) {
			arr.push(
				<option
					key={i}
					value={i}
					hidden={i === constants.MODE_CUSTOM}
				>{modes[i]}</option>,
			)
		}

		return (
			<div className='comp-select'>
				<InputLabel htmlFor='select'>Mode</InputLabel>
				<NativeSelect
					id='select'
					value={this.props.mode}
					onChange={this.handleChange}
				>
					{arr}
				</NativeSelect>
			</div>
		)
	}
}