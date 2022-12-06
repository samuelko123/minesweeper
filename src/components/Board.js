import React from 'react'
import {
	useDispatch,
	useSelector,
} from 'react-redux'
import {
	chordCell,
	minesweeperSelector,
	peekNeighborCells,
	peekOneCell,
	resetPeek,
	revealCell,
	toggleFlag,
} from '../slices/minesweeper'

import { Tile } from './Tile'

const MOUSE_CLICK = Object.freeze({
	LEFT: 1,
	RIGHT: 2,
	BOTH: 3,
	MIDDLE: 4,
})

export const Board = () => {
	const {
		board,
	} = useSelector(minesweeperSelector)

	const [buttons, setButtons] = React.useState(null)

	const dispatch = useDispatch()

	const handleMouseDown = (e, row, col) => {
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

	const handleMouseUp = (e, row, col) => {
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

	const handleMouseEnter = (e, row, col) => {
		e.preventDefault()
		setButtons(e.buttons)
		switch (e.buttons) {
			case MOUSE_CLICK.LEFT:
				dispatch(peekOneCell({
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

	const handleMouseLeave = (e) => {
		e.preventDefault()
		dispatch(resetPeek())
		setButtons(null)
	}

	return (
		<table id='board'>
			<tbody>
				{board && board.map((arr, row) => (
					<tr key={row}>
						{arr.map((cell, col) => (
							<Tile
								key={`${col},${row}`}
								cell={cell}
								onMouseDown={(e) => handleMouseDown(e, row, col)}
								onMouseUp={(e) => handleMouseUp(e, row, col)}
								onMouseEnter={(e) => handleMouseEnter(e, row, col)}
								onMouseLeave={(e) => handleMouseLeave(e, row, col)}
							/>
						))}
					</tr>
				))}
			</tbody>
		</table>
	)
}