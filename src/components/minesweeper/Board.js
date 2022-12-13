import React from 'react'
import {
	useDispatch,
	useSelector,
} from 'react-redux'
import {
	CELL_STATE,
	chordCell,
	minesweeperSelector,
	peekNeighborCells,
	peekOneCell,
	resetPeek,
	revealCell,
	toggleFlag,
} from '../../slices/minesweeper'

import { Tile } from './Tile'

const MOUSE_CLICK = Object.freeze({
	LEFT: 1,
	RIGHT: 2,
	BOTH: 3,
	MIDDLE: 4,
})

export const Board = (props) => {
	const {
		tileSize,
		flagMode,
	} = props

	const {
		board,
	} = useSelector(minesweeperSelector)

	const tableRef = React.useRef(null)
	const [buttons, setButtons] = React.useState(null)

	const [tableLeft, setTableLeft] = React.useState(0)
	const [tableTop, setTableTop] = React.useState(0)

	React.useEffect(() => {
		setTableLeft(tableRef.current.offsetLeft)
		setTableTop(tableRef.current.offsetTop)
	}, [])

	const dispatch = useDispatch()

	const calcRow = (pageY) => { return Math.floor((pageY - tableTop) / tileSize) }
	const calcCol = (pageX) => { return Math.floor((pageX - tableLeft) / tileSize) }

	const handlePointerMove = (e) => {
		const row = calcRow(e.pageY)
		const col = calcCol(e.pageX)

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

	const handlePointerDown = (e) => {
		e.preventDefault()
		setButtons(e.buttons)

		const row = calcRow(e.pageY)
		const col = calcCol(e.pageX)

		switch (e.buttons) {
			case MOUSE_CLICK.LEFT:
				if (flagMode) {
					dispatch(toggleFlag({
						row: row,
						col: col,
					}))
				} else if (board[row][col].state === CELL_STATE.REVEALED) {
					dispatch(chordCell({
						row: row,
						col: col,
					}))
				} else {
					dispatch(peekOneCell({
						row: row,
						col: col,
					}))
				}
				break
			case MOUSE_CLICK.RIGHT:
				dispatch(toggleFlag({
					row: row,
					col: col,
				}))
				break
			case MOUSE_CLICK.MIDDLE:
			case MOUSE_CLICK.BOTH:
				dispatch(peekNeighborCells({
					row: row,
					col: col,
				}))
				break
		}
	}

	const handlePointerUp = (e) => {
		e.preventDefault()
		dispatch(resetPeek())

		const row = calcRow(e.pageY)
		const col = calcCol(e.pageX)

		switch (buttons) {
			case MOUSE_CLICK.LEFT:
				if (!flagMode) {
					dispatch(revealCell({
						row: row,
						col: col,
					}))
				}
				break
			case MOUSE_CLICK.MIDDLE:
			case MOUSE_CLICK.BOTH:
				dispatch(chordCell({
					row: row,
					col: col,
				}))
				break
		}
	}

	const handlePointerLeave = (e) => {
		e.preventDefault()
		dispatch(resetPeek())
	}

	return (
		<table
			ref={tableRef}
			onPointerMove={handlePointerMove}
			onPointerDown={handlePointerDown}
			onPointerUp={handlePointerUp}
			onPointerLeave={handlePointerLeave}
			style={{
				display: 'table',
				borderSpacing: 0,
				fontSize: 0,
				border: 0,
				margin: 0,
				padding: 0,
			}}
		>
			<tbody>
				{board && board.map((arr, row) => (
					<tr key={row}>
						{arr.map((cell, col) => (
							<Tile
								key={`${col},${row}`}
								cell={cell}
								width={tileSize}
								height={tileSize}
							/>
						))}
					</tr>
				))}
			</tbody>
		</table>
	)
}