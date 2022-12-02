import {
	InputLabel,
	TextField,
} from '@material-ui/core'
import React from 'react'
const regexUtil = require('../lib/regexUtil.js')

export default class NumberInput extends React.Component {

	constructor(props) {
		super(props)
		this.state = { value: this.props.value }
	}

	handleLostFocus = (e) => {
		let val = regexUtil.getNumber(e.target.value)
		val = Math.max(val, this.props.min)
		val = Math.min(val, this.props.max)
		if (val !== this.props.value) {
			this.props.notifyChange(val)
		}

		this.setState({ value: val })
	}

	handleChange = (e) => {
		this.setState({ value: regexUtil.getNumber(e.target.value) })
	}

	render() {
		return (
			<div className='comp-input'>
				<InputLabel htmlFor={this.props.name}>{this.props.name}</InputLabel>
				<TextField
					id={this.props.name}
					value={this.state.value}
					onChange={this.handleChange}
					onBlur={this.handleLostFocus}
					inputProps={{
						style: {
							textAlign: 'center',
							width: '3em',
						},
					}}
					autoComplete='off'
				></TextField>
			</div>
		)
	}
}
