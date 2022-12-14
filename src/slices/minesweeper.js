import { createSlice } from '@reduxjs/toolkit'

// =============
//  helper functions
// =============

const initGameHelper = (settings) => {
	const {
		rowCount,
		colCount,
		mineCount,
		mode,
	} = settings

	// init empty board
	const arr = Array(rowCount).fill(null)
		.map(() => Array(colCount).fill(null))

	// put mines
	let minesLeft = mineCount
	for (let i = 0; i < rowCount; i++) {
		for (let j = 0; j < colCount; j++) {
			arr[i][j] = {
				value: minesLeft > 0 ? CELL_VALUE.MINED : CELL_VALUE.EMPTY,
				state: CELL_STATE.HIDDEN,
				row: i,
				col: j,
			}

			minesLeft--
		}
	}

	// randomise mines
	for (let i = 0; i < rowCount; i++) {
		for (let j = 0; j < colCount; j++) {

			const x = Math.floor(Math.random() * rowCount)
			const y = Math.floor(Math.random() * colCount)
			const temp = arr[i][j].value
			arr[i][j].value = arr[x][y].value
			arr[x][y].value = temp
		}
	}

	return {
		status: GAME_STATUS.READY,
		settings: {
			rowCount,
			colCount,
			mineCount,
			mode,
		},
		data: {
			cellCount: rowCount * colCount,
			safeCount: rowCount * colCount - mineCount,
			flagCount: 0,
			peeking: false,
		},
		board: arr,
	}
}

const restartGame = (state) => {
	const {
		status,
		settings,
		data,
		board,
	} = initGameHelper(state.settings)

	state.status = status
	state.settings = settings
	state.data = data
	state.board = board
}

const getNeighborCells = (board, row, col) => {
	const rowCount = board.length
	const colCount = board[0].length

	const i1 = Math.max(row - 1, 0)
	const i2 = Math.min(row + 1, rowCount - 1)
	const j1 = Math.max(col - 1, 0)
	const j2 = Math.min(col + 1, colCount - 1)

	const cells = []
	for (let i = i1; i <= i2; i++) {
		for (let j = j1; j <= j2; j++) {
			cells.push(board[i][j])
		}
	}

	return cells
}

const revealCellHelper = (state, row, col) => {
	const {
		rowCount,
		colCount,
	} = state.settings

	const {
		safeCount,
	} = state.data

	const clickedCell = state.board[row][col]

	// handle first click
	if (state.status === GAME_STATUS.READY) {
		state.status = GAME_STATUS.PLAYING

		// move mines away
		getNeighborCells(state.board, row, col).map(neighborCell => {
			if (neighborCell.value === CELL_VALUE.MINED) {
				let x, y, targetCell
				do {
					x = Math.floor(Math.random() * rowCount)
					y = Math.floor(Math.random() * colCount)
					targetCell = state.board[x][y]
				} while (
					targetCell.value === CELL_VALUE.MINED ||
					(
						Math.abs(targetCell.row - clickedCell.row) <= 1 &
						Math.abs(targetCell.col - clickedCell.col) <= 1
					)
				)

				neighborCell.value = CELL_VALUE.EMPTY
				targetCell.value = CELL_VALUE.MINED
			}
		})

		// calculate neighbor mine count
		for (const r of state.board) {
			for (const cell of r) {
				if (cell.value !== CELL_VALUE.MINED) {
					continue
				}

				getNeighborCells(state.board, cell.row, cell.col).map(cell => {
					if (cell.value !== CELL_VALUE.MINED) {
						cell.value++
					}
				})
			}
		}
	}

	// do nothing if cell is not hidden or peeked
	if (
		clickedCell.state !== CELL_STATE.HIDDEN &&
		clickedCell.state !== CELL_STATE.PEEKED
	) {
		return
	}

	// handle lose if cell is mined
	if (clickedCell.value === CELL_VALUE.MINED) {
		state.status = GAME_STATUS.LOSE
		clickedCell.state = CELL_STATE.EXPLODED

		for (const r of state.board) {
			for (const cell of r) {
				if (
					cell.value === CELL_VALUE.MINED &&
					cell.state !== CELL_STATE.EXPLODED &&
					cell.state !== CELL_STATE.FLAGGED
				) {
					cell.state = CELL_STATE.REVEALED
				}

				if (
					cell.value !== CELL_VALUE.MINED &&
					cell.state === CELL_STATE.FLAGGED
				) {
					cell.state = CELL_STATE.WRONG
				}
			}
		}

		return
	}

	// reveals neighbor cells recursively if cell has no neighbor mines
	clickedCell.state = CELL_STATE.REVEALED
	const toBeRevealed = [clickedCell]

	while (toBeRevealed.length !== 0) {
		const focusCell = toBeRevealed.pop()
		focusCell.state = CELL_STATE.REVEALED

		if (focusCell.value === CELL_VALUE.EMPTY) {
			getNeighborCells(state.board, focusCell.row, focusCell.col).map(neighborCell => {
				if (
					(neighborCell.row !== focusCell.row || neighborCell.col !== focusCell.col)
					&& neighborCell.state === CELL_STATE.HIDDEN
					&& neighborCell.value !== CELL_VALUE.MINED
				) {
					toBeRevealed.push(neighborCell)
				}
			})
		}
	}

	// check win condition
	const revealedCount = state.board.flat().reduce((prev, curr) => {
		return prev + (curr.state === CELL_STATE.REVEALED ? 1 : 0)
	}, 0)
	const isWin = (revealedCount === safeCount)

	// handle win
	if (isWin) {
		state.status = GAME_STATUS.WIN

		for (const r of state.board) {
			for (const cell of r) {
				if (cell.value === CELL_VALUE.MINED) {
					cell.state = CELL_STATE.FLAGGED
				}
			}
		}
	}
}

// =============
//  constants
// =============

export const CELL_VALUE = Object.freeze({
	EMPTY: 0,
	MINED: -1,
})

export const CELL_STATE = Object.freeze({
	HIDDEN: 0,
	REVEALED: 1,
	PEEKED: 2,
	FLAGGED: 3,
	EXPLODED: 4,
	WRONG: 5,
})

export const GAME_STATUS = Object.freeze({
	INIT: 0,
	READY: 1,
	PLAYING: 2,
	WIN: 3,
	LOSE: 4,
})

export const LIMIT = {
	MIN_COL: 1,
	MAX_COL: 99,
	MIN_ROW: 1,
	MAX_ROW: 99,
}

export const GAME_MODE = Object.freeze({
	EASY: 0,
	MEDIUM: 1,
	HARD: 2,
	CUSTOM: 3,
})

// =============
//  slice
// =============

const minesweeperSlice = createSlice({
	name: 'minesweeper',
	initialState: initGameHelper({
		rowCount: 9,
		colCount: 9,
		mineCount: 10,
		mode: GAME_MODE.EASY,
	}),
	reducers: {
		initGame: (state, { payload }) => {
			const {
				status,
				settings,
				data,
				board,
			} = initGameHelper(payload)

			state.status = status
			state.settings = settings
			state.data = data
			state.board = board
		},
		revealCell: (state, { payload }) => {
			const {
				row,
				col,
			} = payload

			if (
				state.status !== GAME_STATUS.PLAYING &&
				state.status !== GAME_STATUS.READY
			) {
				return
			}

			revealCellHelper(state, row, col)
		},
		toggleFlag: (state, { payload }) => {
			const {
				row,
				col,
			} = payload

			if (
				state.status !== GAME_STATUS.PLAYING &&
				state.status !== GAME_STATUS.READY
			) {
				return
			}

			const cell = state.board[row][col]
			if (cell.state === CELL_STATE.HIDDEN) {
				cell.state = CELL_STATE.FLAGGED
				state.data.flagCount++
			} else if (cell.state === CELL_STATE.FLAGGED) {
				cell.state = CELL_STATE.HIDDEN
				state.data.flagCount--
			}
		},
		chordCell: (state, { payload }) => {
			const {
				row,
				col,
			} = payload

			if (state.status !== GAME_STATUS.PLAYING) {
				return
			}

			const cell = state.board[row][col]
			if (
				cell.value <= 0 ||
				cell.state !== CELL_STATE.REVEALED
			) {
				return
			}

			let flagCount = 0
			getNeighborCells(state.board, row, col).map(cell => {
				if (cell.state === CELL_STATE.FLAGGED) {
					flagCount++
				}
			})

			if (flagCount === cell.value) {
				getNeighborCells(state.board, row, col).map(cell => {
					if (
						cell.state === CELL_STATE.HIDDEN ||
						cell.state === CELL_STATE.PEEKED
					) {
						revealCellHelper(state, cell.row, cell.col)
					}
				})
			}
		},
		peekOneCell: (state, { payload }) => {
			const {
				row,
				col,
			} = payload

			if (
				state.status !== GAME_STATUS.PLAYING &&
				state.status !== GAME_STATUS.READY
			) {
				return
			}

			state.data.peeking = true
			for (const r of state.board) {
				for (const cell of r) {
					if (cell.state === CELL_STATE.PEEKED) {
						cell.state = CELL_STATE.HIDDEN
					}
				}
			}

			const cell = state.board[row][col]
			if (cell.state === CELL_STATE.HIDDEN) {
				cell.state = CELL_STATE.PEEKED
			}
		},
		peekNeighborCells: (state, { payload }) => {
			const {
				row,
				col,
			} = payload

			if (
				state.status !== GAME_STATUS.PLAYING &&
				state.status !== GAME_STATUS.READY
			) {
				return
			}

			state.data.peeking = true
			for (const r of state.board) {
				for (const cell of r) {
					if (Math.abs(row - cell.row) <= 1 && Math.abs(col - cell.col) <= 1) {
						if (cell.state === CELL_STATE.HIDDEN) {
							cell.state = CELL_STATE.PEEKED
						}
					} else if (cell.state === CELL_STATE.PEEKED) {
						cell.state = CELL_STATE.HIDDEN
					}
				}
			}
		},
		resetPeek: (state) => {
			state.data.peeking = false
			for (const r of state.board) {
				for (const cell of r) {
					if (cell.state === CELL_STATE.PEEKED) {
						cell.state = CELL_STATE.HIDDEN
					}
				}
			}
		},
		setMode: (state, { payload }) => {
			const { mode } = payload

			state.settings.mode = mode
			switch (mode) {
				case GAME_MODE.EASY:
					state.settings.colCount = 9
					state.settings.rowCount = 9
					state.settings.mineCount = 10
					break
				case GAME_MODE.MEDIUM:
					state.settings.colCount = 16
					state.settings.rowCount = 16
					state.settings.mineCount = 40
					break
				case GAME_MODE.HARD:
					state.settings.colCount = 30
					state.settings.rowCount = 16
					state.settings.mineCount = 99
					break
			}

			restartGame(state)
		},
	},
})

export const {
	initGame,
	revealCell,
	toggleFlag,
	chordCell,
	peekOneCell,
	peekNeighborCells,
	resetPeek,
	setMode,
} = minesweeperSlice.actions

export const minesweeperReducer = minesweeperSlice.reducer

export const minesweeperSelector = state => state.minesweeper