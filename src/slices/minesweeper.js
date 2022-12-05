import { createSlice } from '@reduxjs/toolkit'
import seedrandom from 'seedrandom'

// =============
//  helper functions
// =============

const callFnOnNeighborCells = (state, row, col, fn) => {
	const {
		rowCount,
		colCount,
	} = state.settings

	const i1 = Math.max(row - 1, 0)
	const i2 = Math.min(row + 1, rowCount - 1)
	const j1 = Math.max(col - 1, 0)
	const j2 = Math.min(col + 1, colCount - 1)

	for (let i = i1; i <= i2; i++) {
		for (let j = j1; j <= j2; j++) {
			fn(i, j)
		}
	}
}

const callFnOnAllCells = (state, fn) => {
	const {
		rowCount,
		colCount,
	} = state.settings

	for (let i = 0; i < rowCount; i++) {
		for (let j = 0; j < colCount; j++) {
			fn(i, j)
		}
	}
}

const resetPeek = (state) => {
	callFnOnAllCells(state, (i, j) => {
		if (state.board[i][j] === CELL_STATE.PEEKED) {
			state.board[i][j] = CELL_STATE.HIDDEN
		}
	})
}

const revealCellHelper = (state, row, col) => {
	const {
		rowCount,
		colCount,
		seed,
	} = state.settings

	const {
		safeCount,
	} = state.statistics

	// handle first click
	if (state.status === GAME_STATUS.READY) {
		state.status = GAME_STATUS.PLAYING

		// move mine away
		if (state.mines[row][col] === CELL_VALUE.MINED) {
			const randomFn = seedrandom(seed)

			let x, y
			do {
				x = Math.floor(randomFn() * rowCount)
				y = Math.floor(randomFn() * colCount)
			} while (
				state.mines[x][y] === CELL_VALUE.MINED ||
				(x === row && y === col)
			)

			state.mines[row][col] = CELL_VALUE.EMPTY
			state.mines[x][y] = CELL_VALUE.MINED
		}

		// calculate neighbor mine count
		callFnOnAllCells(state, (i, j) => {
			if (state.mines[i][j] !== CELL_VALUE.MINED) {
				return
			}

			callFnOnNeighborCells(state, i, j, (i, j) => {
				if (state.mines[i][j] !== CELL_VALUE.MINED) {
					state.mines[i][j]++
				}
			})
		})
	}

	// do nothing if cell is not hidden
	if (state.board[row][col] !== CELL_STATE.HIDDEN) {
		return
	}

	// handle lose if cell is mined
	if (state.mines[row][col] === CELL_VALUE.MINED) {
		state.status = GAME_STATUS.LOSE
		state.board[row][col] = CELL_STATE.EXPLODED

		callFnOnAllCells(state, (i, j) => {
			const cellValue = state.mines[i][j]
			const cellState = state.board[i][j]

			if (
				cellValue === CELL_VALUE.MINED &&
				cellState !== CELL_STATE.EXPLODED &&
				cellState !== CELL_STATE.FLAGGED
			) {
				state.board[i][j] = CELL_STATE.REVEALED
			}

			if (
				cellValue !== CELL_VALUE.MINED &&
				cellState === CELL_STATE.FLAGGED
			) {
				state.board[i][j] = CELL_STATE.WRONG
			}
		})

		return
	}

	// reveals neighbor cells recursively if cell has no neighbor mines
	state.board[row][col] = CELL_STATE.REVEALED
	const toBeRevealed = [{
		row: row,
		col: col,
	}]

	while (toBeRevealed.length !== 0) {
		const cell = toBeRevealed.pop()
		state.board[cell.row][cell.col] = CELL_STATE.REVEALED

		if (state.mines[cell.row][cell.col] === CELL_VALUE.EMPTY) {
			callFnOnNeighborCells(state, cell.row, cell.col, (i, j) => {
				if (
					(i !== cell.row || j !== cell.col)
					&& state.board[i][j] === CELL_STATE.HIDDEN
					&& state.mines[i][j] !== CELL_VALUE.MINED
				) {
					toBeRevealed.push({
						row: i,
						col: j,
					})
				}
			})
		}
	}

	// check win condition
	const revealedCount = state.board.flat().reduce((prev, curr) => {
		return prev + (curr === CELL_STATE.REVEALED ? 1 : 0)
	}, 0)
	const isWin = (revealedCount === safeCount)

	// handle win
	if (isWin) {
		state.status = GAME_STATUS.WIN

		callFnOnAllCells(state, (i, j) => {
			if (state.mines[i][j] === CELL_VALUE.MINED) {
				state.board[i][j] = CELL_STATE.FLAGGED
			}
		})
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

// =============
//  initial state
// =============

const INITIAL_STATE = Object.freeze({
	status: GAME_STATUS.INIT,
	settings: {
		rowCount: 0,
		colCount: 0,
		mineCount: 0,
		seed: undefined,
	},
	statistics: {
		cellCount: 0,
		safeCount: 0,
	},
	mines: [[]],
	board: [[]],
})

// =============
//  slice
// =============

const minesweeperSlice = createSlice({
	name: 'minesweeper',
	initialState: INITIAL_STATE,
	reducers: {
		createGame: (state, { payload }) => {
			const {
				rowCount,
				colCount,
				mineCount,
				seed,
			} = payload

			state.settings = {
				rowCount: rowCount,
				colCount: colCount,
				mineCount: mineCount,
				seed: seed,
			}

			state.statistics = {
				cellCount: rowCount * colCount,
				safeCount: rowCount * colCount - mineCount,
			}

			const arr = Array(rowCount).fill(null)
				.map(() => Array(colCount).fill(CELL_VALUE.EMPTY))
				.map((row, rowIndex) => {
					const MINEDCountOnRow = mineCount - rowIndex * colCount
					if (MINEDCountOnRow >= colCount) {
						return row.fill(CELL_VALUE.MINED)
					} else if (MINEDCountOnRow > 0) {
						return row.fill(CELL_VALUE.MINED, 0, MINEDCountOnRow)
					} else {
						return row
					}
				})

			const randomFn = seedrandom(seed)
			callFnOnAllCells(state, (i, j) => {
				const x = Math.floor(randomFn() * rowCount)
				const y = Math.floor(randomFn() * colCount)
				const temp = arr[i][j]
				arr[i][j] = arr[x][y]
				arr[x][y] = temp
			})

			state.status = GAME_STATUS.READY
			state.mines = arr
			state.board = Array(rowCount).fill(Array(colCount).fill(CELL_STATE.HIDDEN))
		},
		revealCell: (state, { payload }) => {
			const {
				row,
				col,
			} = payload

			revealCellHelper(state, row, col)
		},
		toggleFlag: (state, { payload }) => {
			const {
				row,
				col,
			} = payload

			if (state.board[row][col] === CELL_STATE.HIDDEN) {
				state.board[row][col] = CELL_STATE.FLAGGED
			} else if (state.board[row][col] === CELL_STATE.FLAGGED) {
				state.board[row][col] = CELL_STATE.HIDDEN
			}
		},
		chordCell: (state, { payload }) => {
			const {
				row,
				col,
			} = payload

			const cellValue = state.mines[row][col]
			const cellState = state.board[row][col]

			if (
				cellValue <= 0 ||
				cellState !== CELL_STATE.REVEALED
			) {
				return
			}

			let flagCount = 0
			callFnOnNeighborCells(state, row, col, (i, j) => {
				if (state.board[i][j] === CELL_STATE.FLAGGED) {
					flagCount++
				}
			})

			if (flagCount === cellValue) {
				callFnOnNeighborCells(state, row, col, (i, j) => {
					if (state.board[i][j] === CELL_STATE.HIDDEN) {
						revealCellHelper(state, i, j)
					}
				})
			}
		},
		peekOneCell: (state, { payload }) => {
			const {
				row,
				col,
			} = payload

			resetPeek(state)
			if (state.board[row][col] === CELL_STATE.HIDDEN) {
				state.board[row][col] = CELL_STATE.PEEKED
			}
		},
		peekNeighborCells: (state, { payload }) => {
			const {
				row,
				col,
			} = payload

			resetPeek(state)
			callFnOnNeighborCells(state, row, col, (i, j) => {
				if (state.board[i][j] === CELL_STATE.HIDDEN) {
					state.board[i][j] = CELL_STATE.PEEKED
				}
			})
		},
	},
})

export const {
	createGame,
	revealCell,
	toggleFlag,
	chordCell,
	peekOneCell,
	peekNeighborCells,
} = minesweeperSlice.actions

export const minesweeperReducer = minesweeperSlice.reducer

export const minesweeperSelector = state => state.minesweeper