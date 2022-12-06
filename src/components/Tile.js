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
import Zero from '../images/0.svg'
import One from '../images/1.svg'
import Two from '../images/2.svg'
import Three from '../images/3.svg'
import Four from '../images/4.svg'
import Five from '../images/5.svg'
import Six from '../images/6.svg'
import Seven from '../images/7.svg'
import Eight from '../images/8.svg'
import Explode from '../images/explode.svg'
import Flag from '../images/flag.svg'
import Hidden from '../images/hidden.svg'
import Mine from '../images/mine.svg'
import Wrong from '../images/wrong.svg'

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

	const width = 30
	const height = 30

	const [buttons, setButtons] = React.useState(null)

	const dispatch = useDispatch()

	let img
	switch (cell.state) {
		case CELL_STATE.HIDDEN:
			img = <Hidden viewBox='0 0 100 100' width={width} height={height} />
			break
		case CELL_STATE.FLAGGED:
			img = <Flag viewBox='0 0 100 100' width={width} height={height} />
			break
		case CELL_STATE.PEEKED:
			img = <Zero viewBox='0 0 100 100' width={width} height={height} />
			break
		case CELL_STATE.EXPLODED:
			img = <Explode viewBox='0 0 100 100' width={width} height={height} />
			break
		case CELL_STATE.WRONG:
			img = <Wrong viewBox='0 0 100 100' width={width} height={height} />
			break
		case CELL_STATE.REVEALED:
			switch (cell.value) {
				case CELL_VALUE.MINED:
					img = <Mine viewBox='0 0 100 100' width={width} height={height} />
					break
				case CELL_VALUE.EMPTY:
					img = <Zero viewBox='0 0 100 100' width={width} height={height} />
					break
				case 1:
					img = <One viewBox='0 0 100 100' width={width} height={height} />
					break
				case 2:
					img = <Two viewBox='0 0 100 100' width={width} height={height} />
					break
				case 3:
					img = <Three viewBox='0 0 100 100' width={width} height={height} />
					break
				case 4:
					img = <Four viewBox='0 0 100 100' width={width} height={height} />
					break
				case 5:
					img = <Five viewBox='0 0 100 100' width={width} height={height} />
					break
				case 6:
					img = <Six viewBox='0 0 100 100' width={width} height={height} />
					break
				case 7:
					img = <Seven viewBox='0 0 100 100' width={width} height={height} />
					break
				case 8:
					img = <Eight viewBox='0 0 100 100' width={width} height={height} />
					break
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
			{img}
		</td>
	)
}