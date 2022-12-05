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
		if (state.board[i][j].state === CELL_STATE.PEEKED) {
			state.board[i][j].state = CELL_STATE.HIDDEN
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
	} = state.data

	// handle first click
	if (state.status === GAME_STATUS.READY) {
		state.status = GAME_STATUS.PLAYING

		// move mine away
		if (state.board[row][col].value === CELL_VALUE.MINED) {
			const randomFn = seedrandom(seed)

			let x, y
			do {
				x = Math.floor(randomFn() * rowCount)
				y = Math.floor(randomFn() * colCount)
			} while (
				state.board[x][y].value === CELL_VALUE.MINED ||
				(x === row && y === col)
			)

			state.board[row][col].value = CELL_VALUE.EMPTY
			state.board[x][y].value = CELL_VALUE.MINED
		}

		// calculate neighbor mine count
		callFnOnAllCells(state, (i, j) => {
			if (state.board[i][j].value !== CELL_VALUE.MINED) {
				return
			}

			callFnOnNeighborCells(state, i, j, (i, j) => {
				if (state.board[i][j].value !== CELL_VALUE.MINED) {
					state.board[i][j].value++
				}
			})
		})
	}

	// do nothing if cell is not hidden
	if (state.board[row][col].state !== CELL_STATE.HIDDEN) {
		return
	}

	// handle lose if cell is mined
	if (state.board[row][col].value === CELL_VALUE.MINED) {
		state.status = GAME_STATUS.LOSE
		state.board[row][col].state = CELL_STATE.EXPLODED

		callFnOnAllCells(state, (i, j) => {
			const cellValue = state.board[i][j].value
			const cellState = state.board[i][j].state

			if (
				cellValue === CELL_VALUE.MINED &&
				cellState !== CELL_STATE.EXPLODED &&
				cellState !== CELL_STATE.FLAGGED
			) {
				state.board[i][j].state = CELL_STATE.REVEALED
			}

			if (
				cellValue !== CELL_VALUE.MINED &&
				cellState === CELL_STATE.FLAGGED
			) {
				state.board[i][j].state = CELL_STATE.WRONG
			}
		})

		return
	}

	// reveals neighbor cells recursively if cell has no neighbor mines
	state.board[row][col].state = CELL_STATE.REVEALED
	const toBeRevealed = [{
		row: row,
		col: col,
	}]

	while (toBeRevealed.length !== 0) {
		const cell = toBeRevealed.pop()
		state.board[cell.row][cell.col].state = CELL_STATE.REVEALED

		if (state.board[cell.row][cell.col].value === CELL_VALUE.EMPTY) {
			callFnOnNeighborCells(state, cell.row, cell.col, (i, j) => {
				if (
					(i !== cell.row || j !== cell.col)
					&& state.board[i][j].state === CELL_STATE.HIDDEN
					&& state.board[i][j].value !== CELL_VALUE.MINED
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
		return prev + (curr.state === CELL_STATE.REVEALED ? 1 : 0)
	}, 0)
	const isWin = (revealedCount === safeCount)

	// handle win
	if (isWin) {
		state.status = GAME_STATUS.WIN

		callFnOnAllCells(state, (i, j) => {
			if (state.board[i][j].value === CELL_VALUE.MINED) {
				state.board[i][j].state = CELL_STATE.FLAGGED
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
	data: {
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

			state.data = {
				cellCount: rowCount * colCount,
				safeCount: rowCount * colCount - mineCount,
			}

			const arr = Array(state.data.cellCount)
			arr.fill({
				value: CELL_VALUE.EMPTY,
				state: CELL_STATE.HIDDEN,
			})
			arr.fill({
				value: CELL_VALUE.MINED,
				state: CELL_STATE.HIDDEN,
			}, 0, mineCount)

			const randomFn = seedrandom(seed)
			arr.forEach((_, i, arr) => {
				const x = Math.floor(randomFn() * state.data.cellCount)
				const temp = arr[x]
				arr[x] = arr[i]
				arr[i] = temp
			})

			state.status = GAME_STATUS.READY
			state.board = arr.reduce((rows, elem, index) =>{
				if (index % colCount === 0) {
					rows.push([elem])
				} else {
					rows[rows.length - 1].push(elem)
				}

				return rows
			}, [])
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

			if (state.board[row][col].state === CELL_STATE.HIDDEN) {
				state.board[row][col].state = CELL_STATE.FLAGGED
			} else if (state.board[row][col].state === CELL_STATE.FLAGGED) {
				state.board[row][col].state = CELL_STATE.HIDDEN
			}
		},
		chordCell: (state, { payload }) => {
			const {
				row,
				col,
			} = payload

			const cellValue = state.board[row][col].value
			const cellState = state.board[row][col].state

			if (
				cellValue <= 0 ||
				cellState !== CELL_STATE.REVEALED
			) {
				return
			}

			let flagCount = 0
			callFnOnNeighborCells(state, row, col, (i, j) => {
				if (state.board[i][j].state === CELL_STATE.FLAGGED) {
					flagCount++
				}
			})

			if (flagCount === cellValue) {
				callFnOnNeighborCells(state, row, col, (i, j) => {
					if (state.board[i][j].state === CELL_STATE.HIDDEN) {
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
			if (state.board[row][col].state === CELL_STATE.HIDDEN) {
				state.board[row][col].state = CELL_STATE.PEEKED
			}
		},
		peekNeighborCells: (state, { payload }) => {
			const {
				row,
				col,
			} = payload

			resetPeek(state)
			callFnOnNeighborCells(state, row, col, (i, j) => {
				if (state.board[i][j].state === CELL_STATE.HIDDEN) {
					state.board[i][j].state = CELL_STATE.PEEKED
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