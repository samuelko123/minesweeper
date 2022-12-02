import React from 'react'
const constants = require('../lib/constants')

export default class Tile extends React.PureComponent {
	constructor(props) {
		super(props)
		this.timer = null
		this.touch = false
		this.touch_start_time = 0
	}

	handleMouseEvent = (e, mouse_event) => {
		e.preventDefault()
		if (!this.touch && this.props.notifyMouseEvent) {
			this.props.notifyMouseEvent(this.props.row, this.props.col, e.buttons, mouse_event, e.ctrlKey)
			this.touch = false
		}
	}

	handleTouchStart = () => {
		this.touch = true // Workaround to prevent mouse event

		// Set timer for touch event
		this.timer = setTimeout(() => {
			if (this.props.notifyLongTouchEvent) { this.props.notifyLongTouchEvent(this.props.row, this.props.col) }
		}, constants.LONG_TOUCH_DURATION)
		this.touch_start_time = new Date()
	}

	handleTouchEnd = () => {
		// If short touch, halt the long touch event
		clearTimeout(this.timer)

		// If short touch, call touch event
		// (Long touch has been handled by timer)
		if (((new Date()).getTime() - this.touch_start_time.getTime()) < constants.LONG_TOUCH_DURATION) { this.props.notifyTouchEvent(this.props.row, this.props.col) }
	}

	render() {
		let offset
		switch (this.props.tile_state) {
			case constants.TILE_STATE_CLICKED:
				offset = (this.props.tile_value === constants.BOMB_VALUE ? constants.TILE_STATE_BOMB : this.props.tile_value)
				break
			case constants.TILE_STATE_RED_BOMB:
			case constants.TILE_STATE_NO_BOMB:
			case constants.TILE_STATE_FLAGGED:
				offset = this.props.tile_state
				break
			default:
				if (this.props.peek) { offset = constants.TILE_STATE_CLICKED }
				else { offset = constants.TILE_STATE_INIT }
		}

		return (
			<td
				className='comp-tile'
				style={{ backgroundPosition: '0px -' + offset * constants.TILE_HEIGHT + 'px' }}
				onMouseDown={(e) => this.handleMouseEvent(e, constants.MOUSE_DOWN)}
				onMouseUp={(e) => this.handleMouseEvent(e, constants.MOUSE_UP)}
				onMouseEnter={(e) => this.handleMouseEvent(e, constants.MOUSE_ENTER)}
				onMouseLeave={(e) => this.handleMouseEvent(e, constants.MOUSE_LEAVE)}
				onTouchStart={this.handleTouchStart}
				onTouchEnd={this.handleTouchEnd}
			/>
		)
	}
}