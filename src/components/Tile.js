import React from 'react'
import { useDispatch } from 'react-redux'
import {
	CELL_STATE,
	CELL_VALUE,
	chordCell,
	peekNeighborCells,
	peekOneCell,
	resetPeek,
	revealCell,
	toggleFlag,
} from '../slices/minesweeper'

const MOUSE_CLICK = Object.freeze({
	LEFT: 1,
	RIGHT: 2,
	BOTH: 3,
	MIDDLE: 4,
})

export const Tile = (props) => {
	const {
		cell,
	} = props

	const {
		row,
		col,
	} = cell

	const [buttons, setButtons] = React.useState(null)

	const dispatch = useDispatch()

	let img
	if (cell.state === CELL_STATE.HIDDEN) {
		img = 'hidden'
	} else if (cell.state === CELL_STATE.FLAGGED) {
		img = 'flag'
	} else if (cell.state === CELL_STATE.PEEKED) {
		img = '0'
	} else {
		if (cell.state === CELL_STATE.EXPLODED) {
			img = 'explode'
		} else if (cell.state === CELL_STATE.WRONG) {
			img = 'wrong'
		} else if (cell.value === CELL_VALUE.MINED) {
			img = 'mine'
		} else {
			img = cell.value
		}
	}

	const handleMouseDown = (e) => {
		e.preventDefault()
		setButtons(e.buttons)
		switch (e.buttons) {
			case MOUSE_CLICK.LEFT:
				dispatch(peekOneCell({
					row,
					col,
				}))
				break
			case MOUSE_CLICK.RIGHT:
				dispatch(toggleFlag({
					row,
					col,
				}))
				break
			case MOUSE_CLICK.MIDDLE:
			case MOUSE_CLICK.BOTH:
				dispatch(peekNeighborCells({
					row,
					col,
				}))
				break
		}
	}

	const handleMouseUp = (e) => {
		e.preventDefault()
		dispatch(resetPeek({
			row,
			col,
		}))
		switch (buttons) {
			case MOUSE_CLICK.LEFT:
				dispatch(revealCell({
					row,
					col,
				}))
				break
			case MOUSE_CLICK.MIDDLE:
			case MOUSE_CLICK.BOTH:
				dispatch(chordCell({
					row,
					col,
				}))
				break
		}
		setButtons(null)
	}

	const handleMouseLeave = (e) => {
		e.preventDefault()
		dispatch(resetPeek({
			row,
			col,
		}))
		setButtons(null)
	}

	return (
		<td
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			onMouseEnter={handleMouseDown}
			onMouseLeave={handleMouseLeave}
		>
			<img
				src={`/images/${img}.svg`}
				width={20}
				height={20}
			/>
		</td>
	)
}