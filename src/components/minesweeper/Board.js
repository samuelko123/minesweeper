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
} from '../../slices/minesweeper'

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

	const tableRef = React.useRef(null)
	const [buttons, setButtons] = React.useState(null)

	const [tableLeft, setTableLeft] = React.useState(0)
	const [tableTop, setTableTop] = React.useState(0)
	const [cellWidth] = React.useState(30)
	const [cellHeight] = React.useState(30)
	const [currentRow, setCurrentRow] = React.useState(0)
	const [currentCol, setCurrentCol] = React.useState(0)

	React.useEffect(() => {
		setTableLeft(tableRef.current.offsetLeft)
		setTableTop(tableRef.current.offsetTop)
	}, [])

	const dispatch = useDispatch()

	const handleMouseMove = (e) => {
		const row = Math.floor((e.pageY - tableTop) / cellHeight)
		const col = Math.floor((e.pageX - tableLeft) / cellWidth)
		setCurrentRow(row)
		setCurrentCol(col)

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

	const handleMouseDown = (e) => {
		e.preventDefault()
		setButtons(e.buttons)

		switch (e.buttons) {
			case MOUSE_CLICK.LEFT:
				dispatch(peekOneCell({
					row: currentRow,
					col: currentCol,
				}))
				break
			case MOUSE_CLICK.RIGHT:
				dispatch(toggleFlag({
					row: currentRow,
					col: currentCol,
				}))
				break
			case MOUSE_CLICK.MIDDLE:
			case MOUSE_CLICK.BOTH:
				dispatch(peekNeighborCells({
					row: currentRow,
					col: currentCol,
				}))
				break
		}
	}

	const handleMouseUp = (e) => {
		e.preventDefault()
		dispatch(resetPeek())

		switch (buttons) {
			case MOUSE_CLICK.LEFT:
				dispatch(revealCell({
					row: currentRow,
					col: currentCol,
				}))
				break
			case MOUSE_CLICK.MIDDLE:
			case MOUSE_CLICK.BOTH:
				dispatch(chordCell({
					row: currentRow,
					col: currentCol,
				}))
				break
		}
	}

	const handleMouseLeave = (e) => {
		e.preventDefault()
		dispatch(resetPeek())
	}

	return (
		<table
			ref={tableRef}
			onMouseMove={handleMouseMove}
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			onMouseLeave={handleMouseLeave}
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
								width={cellWidth}
								height={cellHeight}
							/>
						))}
					</tr>
				))}
			</tbody>
		</table>
	)
}