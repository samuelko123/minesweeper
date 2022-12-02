import React from 'react'
const constants = require('../lib/constants')

export default class Counter extends React.Component {

	render() {
		const min_digits = 3
		const arr = []
		const x = Math.abs(Math.floor(this.props.value))
		let len = Math.ceil(Math.log10(x + 1)) // Number of digits
		len = len < min_digits ? min_digits : len

		// Negative value
		if (this.props.value < 0) {
			arr.push(<div
				key='-'
				className='comp-counter-digit'
				style={{ backgroundPosition: '-16px -' + 10 * constants.DIGIT_HEIGHT + 'px' }}
			></div>)
		}

		// Display digits
		for (let i = len - 1; i >= 0; i--) {
			const digit = Math.floor((x % Math.pow(10, i + 1)) / Math.pow(10, i))
			arr.push(
				<div
					key={i}
					className='comp-counter-digit'
					style={{ backgroundPosition: '-16px -' + digit * constants.DIGIT_HEIGHT + 'px' }}
				></div>,
			)
		}

		return (
			<div className='comp-counter'>
				{arr}
			</div>
		)
	}
}
