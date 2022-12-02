import React from 'react'
const constants = require('../lib/constants')

export default class Button extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			mouse_down: false,
		}
	}

	handleMouseEvent = (e, mouse_event) => {
		switch (mouse_event) {
			case constants.MOUSE_DOWN:
				if (e.buttons === constants.MOUSE_LEFT || e.buttons === constants.MOUSE_BOTH) { this.setState({ mouse_down: true }) }
				break
			case constants.MOUSE_UP:
			case constants.MOUSE_LEAVE:
				this.setState({ mouse_down: false })
				break
			case constants.MOUSE_CLICK:
				this.props.notifyClick()
				break
			default: // Do Nothing
		}
	}

	render() {
		let offset
		if (this.state.mouse_down) { offset = constants.BUTTON_CLICKED }
		else { offset = this.props.status }

		return (
			<div
				className='comp-button'
				style={{ backgroundPosition: '-29px -' + (offset * constants.BUTTON_HEIGHT) + 'px' }}
				onMouseDown={(e) => this.handleMouseEvent(e, constants.MOUSE_DOWN)}
				onMouseUp={(e) => this.handleMouseEvent(e, constants.MOUSE_UP)}
				onMouseLeave={(e) => this.handleMouseEvent(e, constants.MOUSE_LEAVE)}
				onClick={(e) => this.handleMouseEvent(e, constants.MOUSE_CLICK)}
			></div>
		)
	}
}