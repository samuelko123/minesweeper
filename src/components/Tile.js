import React from 'react'
const constants = require('../lib/constants')

export const Tile = (props) => {
	const {
		peek,
		tile_value,
		tile_state,
		notifyMouseEvent,
		notifyTouchEvent,
		notifyLongTouchEvent,
		row,
		col,
	} = props

	let timer = null
	let touch = false
	let touch_start_time = 0

	const handleMouseEvent = (e, mouse_event) => {
		e.preventDefault()
		if (!touch && notifyMouseEvent) {
			notifyMouseEvent(row, col, e.buttons, mouse_event, e.ctrlKey)
			touch = false
		}
	}

	const handleTouchStart = () => {
		touch = true // Workaround to prevent mouse event

		// Set timer for touch event
		timer = setTimeout(() => {
			if (notifyLongTouchEvent) { notifyLongTouchEvent(row, col) }
		}, constants.LONG_TOUCH_DURATION)
		touch_start_time = new Date()
	}

	const handleTouchEnd = () => {
		// If short touch, halt the long touch event
		clearTimeout(timer)

		// If short touch, call touch event
		// (Long touch has been handled by timer)
		if (((new Date()).getTime() - touch_start_time.getTime()) < constants.LONG_TOUCH_DURATION) { notifyTouchEvent(row, col) }
	}

	let offset
	switch (tile_state) {
		case constants.TILE_STATE_CLICKED:
			offset = (tile_value === constants.BOMB_VALUE ? constants.TILE_STATE_BOMB : tile_value)
			break
		case constants.TILE_STATE_RED_BOMB:
		case constants.TILE_STATE_NO_BOMB:
		case constants.TILE_STATE_FLAGGED:
			offset = tile_state
			break
		default:
			if (peek) { offset = constants.TILE_STATE_CLICKED }
			else { offset = constants.TILE_STATE_INIT }
	}

	return (
		<td
			style={{ backgroundPosition: '0px -' + offset * constants.TILE_HEIGHT + 'px' }}
			onMouseDown={(e) => handleMouseEvent(e, constants.MOUSE_DOWN)}
			onMouseUp={(e) => handleMouseEvent(e, constants.MOUSE_UP)}
			onMouseEnter={(e) => handleMouseEvent(e, constants.MOUSE_ENTER)}
			onMouseLeave={(e) => handleMouseEvent(e, constants.MOUSE_LEAVE)}
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
		/>
	)
}