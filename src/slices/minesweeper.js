import { createSlice } from '@reduxjs/toolkit'
import seedrandom from 'seedrandom'

// =============
//  helper functions
// =============

const initGameHelper = (settings) => {
	const {
		rowCount,
		colCount,
		mineCount,
		seed,
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
	const randomFn = seedrandom(seed)
	for (let i = 0; i < rowCount; i++) {
		for (let j = 0; j < colCount; j++) {

			const x = Math.floor(randomFn() * rowCount)
			const y = Math.floor(randomFn() * colCount)
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
			seed,
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

	// do nothing if cell is not hidden or peeked
	if (
		state.board[row][col].state !== CELL_STATE.HIDDEN &&
		state.board[row][col].state !== CELL_STATE.PEEKED
	) {
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
		seed: undefined,
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

			if (state.board[row][col].state === CELL_STATE.HIDDEN) {
				state.board[row][col].state = CELL_STATE.FLAGGED
				state.data.flagCount++
			} else if (state.board[row][col].state === CELL_STATE.FLAGGED) {
				state.board[row][col].state = CELL_STATE.HIDDEN
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

			if (
				state.status !== GAME_STATUS.PLAYING &&
				state.status !== GAME_STATUS.READY
			) {
				return
			}

			state.data.peeking = true
			callFnOnAllCells(state, (i, j) => {
				if (row === i && col === j) {
					if (state.board[i][j].state === CELL_STATE.HIDDEN) {
						state.board[i][j].state = CELL_STATE.PEEKED
					}
				} else if (state.board[i][j].state === CELL_STATE.PEEKED) {
					state.board[i][j].state = CELL_STATE.HIDDEN
				}
			})
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
			callFnOnAllCells(state, (i, j) => {
				if (Math.abs(row - i) <= 1 && Math.abs(col - j) <= 1) {
					if (state.board[i][j].state === CELL_STATE.HIDDEN) {
						state.board[i][j].state = CELL_STATE.PEEKED
					}
				} else if (state.board[i][j].state === CELL_STATE.PEEKED) {
					state.board[i][j].state = CELL_STATE.HIDDEN
				}
			})
		},
		resetPeek: (state) => {
			state.data.peeking = false
			callFnOnAllCells(state, (i, j) => {
				if (state.board[i][j].state === CELL_STATE.PEEKED) {
					state.board[i][j].state = CELL_STATE.HIDDEN
				}
			})
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