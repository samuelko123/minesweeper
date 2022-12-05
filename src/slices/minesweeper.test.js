import {
	CELL_STATE,
	CELL_VALUE,
	GAME_STATUS,
	chordCell,
	createGame,
	peekNeighborCells,
	peekOneCell,
	minesweeperReducer as reducer,
	revealCell,
	toggleFlag,
} from './minesweeper'

const map2D = (arr, fn) => {
	return arr.map(row => row.map(fn))
}

const getStates = (board) => map2D(board, cell => cell.state)
const getValues = (board) => map2D(board, cell => cell.value)

const buildBoard = (states, values) => {
	return states.map((row, i) => row.map((elem, j) => {
		return {
			state: elem,
			value: values ? values[i][j] : null,
		}
	}))
}

describe('minesweeper', () => {
	describe('createGame', () => {
		it('populates settings and randomised mines', () => {
			// arrange
			const payload = {
				rowCount: 4,
				colCount: 3,
				mineCount: 5,
				seed: 'seed',
			}

			// action
			const newState = reducer(undefined, createGame(payload))

			// assert
			expect(newState.status).toEqual(GAME_STATUS.READY)
			expect(newState.settings).toEqual(payload)
			expect(newState.data).toEqual({
				cellCount: 12,
				safeCount: 7,
			})
			expect(getStates(newState.board)).toEqual([
				[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
				[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
				[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
				[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
			])
			expect(getValues(newState.board)).toEqual([
				[CELL_VALUE.MINED, CELL_VALUE.MINED, CELL_VALUE.EMPTY],
				[CELL_VALUE.EMPTY, CELL_VALUE.EMPTY, CELL_VALUE.EMPTY],
				[CELL_VALUE.MINED, CELL_VALUE.EMPTY, CELL_VALUE.EMPTY],
				[CELL_VALUE.MINED, CELL_VALUE.MINED, CELL_VALUE.EMPTY],
			])
		})
	})

	describe('revealCell', () => {
		it('removes mine from first-click cell', () => {
			// arrange
			const oldState = {
				status: GAME_STATUS.READY,
				settings: {
					rowCount: 4,
					colCount: 3,
					mineCount: 5,
					seed: 'seed',
				},
				data: {
					safeCount: 7,
				},
				board: buildBoard(
					[
						[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
						[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
						[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
						[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
					],
					[
						[CELL_VALUE.MINED, CELL_VALUE.MINED, CELL_VALUE.MINED],
						[CELL_VALUE.MINED, CELL_VALUE.MINED, CELL_VALUE.EMPTY],
						[CELL_VALUE.MINED, CELL_VALUE.MINED, CELL_VALUE.MINED],
						[CELL_VALUE.MINED, CELL_VALUE.MINED, CELL_VALUE.MINED],
					]),
			}

			const payload = {
				row: 1,
				col: 1,
			}

			// action
			const newState = reducer(oldState, revealCell(payload))

			// assert
			expect(getValues(newState.board)).toEqual([
				[CELL_VALUE.MINED, CELL_VALUE.MINED, CELL_VALUE.MINED],
				[CELL_VALUE.MINED, 8, CELL_VALUE.MINED],
				[CELL_VALUE.MINED, CELL_VALUE.MINED, CELL_VALUE.MINED],
				[CELL_VALUE.MINED, CELL_VALUE.MINED, CELL_VALUE.MINED],
			])
		})

		it('fills neighbor mine count on first click', () => {
			// arrange
			const oldState = {
				status: GAME_STATUS.READY,
				settings: {
					rowCount: 4,
					colCount: 3,
					mineCount: 5,
					seed: 'seed',
				},
				data: {
					safeCount: 7,
				},
				board: buildBoard(
					[
						[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
						[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
						[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
						[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
					],
					[
						[CELL_VALUE.EMPTY, CELL_VALUE.EMPTY, CELL_VALUE.EMPTY],
						[CELL_VALUE.EMPTY, CELL_VALUE.MINED, CELL_VALUE.EMPTY],
						[CELL_VALUE.MINED, CELL_VALUE.EMPTY, CELL_VALUE.EMPTY],
						[CELL_VALUE.MINED, CELL_VALUE.MINED, CELL_VALUE.MINED],
					]),
			}

			const payload = {
				row: 0,
				col: 0,
			}

			// action
			const newState = reducer(oldState, revealCell(payload))

			// assert
			expect(newState.status).toEqual(GAME_STATUS.PLAYING)
			expect(getValues(newState.board)).toEqual([
				[1, 1, 1],
				[2, -1, 1],
				[-1, 5, 3],
				[-1, -1, -1],
			])
		})

		it('does nothing if cell is flagged', () => {
			// arrange
			const oldState = {
				status: GAME_STATUS.PLAYING,
				settings: {
					rowCount: 4,
					colCount: 3,
					mineCount: 5,
					seed: 'seed',
				},
				data: {
					safeCount: 7,
				},
				board: buildBoard(
					[
						[CELL_STATE.HIDDEN, CELL_STATE.FLAGGED, CELL_STATE.HIDDEN],
						[CELL_STATE.HIDDEN, CELL_STATE.REVEALED, CELL_STATE.HIDDEN],
						[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
						[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
					],
					[
						[0, 0, 0],
						[1, 2, 1],
						[-1, 5, -1],
						[-1, -1, -1],
					]),
			}

			const payload = {
				row: 0,
				col: 1,
			}

			// action
			const newState = reducer(oldState, revealCell(payload))

			// assert
			expect(newState).toEqual(oldState)
		})

		it('reveals neighbor cells recursively if cell has no neighbor mines', () => {
			// arrange
			const oldState = {
				status: GAME_STATUS.PLAYING,
				settings: {
					rowCount: 4,
					colCount: 3,
					mineCount: 5,
					seed: 'seed',
				},
				data: {
					safeCount: 7,
				},
				board: buildBoard(
					[
						[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
						[CELL_STATE.HIDDEN, CELL_STATE.REVEALED, CELL_STATE.HIDDEN],
						[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
						[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
					],
					[
						[0, 0, 0],
						[1, 2, 1],
						[-1, 5, -1],
						[-1, -1, -1],
					]),
			}

			const payload = {
				row: 0,
				col: 1,
			}

			// action
			const newState = reducer(oldState, revealCell(payload))

			// assert
			expect(newState.status).toEqual(GAME_STATUS.PLAYING)
			expect(getStates(newState.board)).toEqual([
				[CELL_STATE.REVEALED, CELL_STATE.REVEALED, CELL_STATE.REVEALED],
				[CELL_STATE.REVEALED, CELL_STATE.REVEALED, CELL_STATE.REVEALED],
				[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
				[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
			])
		})

		it('loses if cell is bomb', () => {
			// arrange
			const oldState = {
				status: GAME_STATUS.PLAYING,
				settings: {
					rowCount: 4,
					colCount: 3,
					mineCount: 5,
					seed: 'seed',
				},
				data: {
					safeCount: 7,
				},
				board: buildBoard(
					[
						[CELL_STATE.REVEALED, CELL_STATE.HIDDEN, CELL_STATE.REVEALED],
						[CELL_STATE.REVEALED, CELL_STATE.REVEALED, CELL_STATE.REVEALED],
						[CELL_STATE.HIDDEN, CELL_STATE.FLAGGED, CELL_STATE.HIDDEN],
						[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
					],
					[
						[0, 0, 0],
						[1, 2, 1],
						[-1, 5, -1],
						[-1, -1, -1],
					]),
			}

			const payload = {
				row: 2,
				col: 0,
			}

			// action
			const newState = reducer(oldState, revealCell(payload))

			// assert
			expect(newState.status).toEqual(GAME_STATUS.LOSE)
			expect(getStates(newState.board)).toEqual([
				[CELL_STATE.REVEALED, CELL_STATE.HIDDEN, CELL_STATE.REVEALED],
				[CELL_STATE.REVEALED, CELL_STATE.REVEALED, CELL_STATE.REVEALED],
				[CELL_STATE.EXPLODED, CELL_STATE.WRONG, CELL_STATE.REVEALED],
				[CELL_STATE.REVEALED, CELL_STATE.REVEALED, CELL_STATE.REVEALED],
			])
		})

		it('wins if cell is bomb', () => {
			// arrange
			const oldState = {
				status: GAME_STATUS.PLAYING,
				settings: {
					rowCount: 4,
					colCount: 3,
					mineCount: 5,
					seed: 'seed',
				},
				data: {
					safeCount: 7,
				},
				board: buildBoard(
					[
						[CELL_STATE.REVEALED, CELL_STATE.HIDDEN, CELL_STATE.REVEALED],
						[CELL_STATE.REVEALED, CELL_STATE.REVEALED, CELL_STATE.REVEALED],
						[CELL_STATE.HIDDEN, CELL_STATE.REVEALED, CELL_STATE.HIDDEN],
						[CELL_STATE.HIDDEN, CELL_STATE.FLAGGED, CELL_STATE.HIDDEN],
					],
					[
						[0, 0, 0],
						[1, 2, 1],
						[-1, 5, -1],
						[-1, -1, -1],
					]),
			}

			const payload = {
				row: 0,
				col: 1,
			}

			// action
			const newState = reducer(oldState, revealCell(payload))

			// assert
			expect(newState.status).toEqual(GAME_STATUS.WIN)
			expect(getStates(newState.board)).toEqual([
				[CELL_STATE.REVEALED, CELL_STATE.REVEALED, CELL_STATE.REVEALED],
				[CELL_STATE.REVEALED, CELL_STATE.REVEALED, CELL_STATE.REVEALED],
				[CELL_STATE.FLAGGED, CELL_STATE.REVEALED, CELL_STATE.FLAGGED],
				[CELL_STATE.FLAGGED, CELL_STATE.FLAGGED, CELL_STATE.FLAGGED],
			])
		})
	})

	describe('toggleFlag', () => {
		it('puts flag on hidden cell', () => {
			// arrange
			const oldState = {
				status: GAME_STATUS.PLAYING,
				board: buildBoard(
					[
						[CELL_STATE.HIDDEN, CELL_STATE.REVEALED, CELL_STATE.REVEALED],
						[CELL_STATE.FLAGGED, CELL_STATE.PEEKED, CELL_STATE.FLAGGED],
						[CELL_STATE.REVEALED, CELL_STATE.FLAGGED, CELL_STATE.FLAGGED],
						[CELL_STATE.FLAGGED, CELL_STATE.HIDDEN, CELL_STATE.REVEALED],
					]),
			}

			const payload = {
				row: 0,
				col: 0,
			}

			// action
			const newState = reducer(oldState, toggleFlag(payload))

			// assert
			expect(newState.board[0][0].state).toEqual(CELL_STATE.FLAGGED)
		})

		it('removes flag from flagged cell', () => {
			// arrange
			const oldState = {
				status: GAME_STATUS.PLAYING,
				board: buildBoard(
					[
						[CELL_STATE.HIDDEN, CELL_STATE.REVEALED, CELL_STATE.REVEALED],
						[CELL_STATE.FLAGGED, CELL_STATE.PEEKED, CELL_STATE.FLAGGED],
						[CELL_STATE.REVEALED, CELL_STATE.FLAGGED, CELL_STATE.FLAGGED],
						[CELL_STATE.FLAGGED, CELL_STATE.HIDDEN, CELL_STATE.REVEALED],
					]),
			}

			const payload = {
				row: 1,
				col: 0,
			}

			// action
			const newState = reducer(oldState, toggleFlag(payload))

			// assert
			expect(newState.board[1][0].state).toEqual(CELL_STATE.HIDDEN)
		})
	})

	describe('chordCell', () => {
		it('does nothing if cell is not revealed', () => {
			// arrange
			const oldState = {
				status: GAME_STATUS.PLAYING,
				settings: {
					rowCount: 4,
					colCount: 3,
					mineCount: 5,
					seed: 'seed',
				},
				data: {
					safeCount: 7,
				},
				board: buildBoard(
					[
						[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
						[CELL_STATE.FLAGGED, CELL_STATE.HIDDEN, CELL_STATE.FLAGGED],
						[CELL_STATE.REVEALED, CELL_STATE.FLAGGED, CELL_STATE.FLAGGED],
						[CELL_STATE.FLAGGED, CELL_STATE.HIDDEN, CELL_STATE.REVEALED],
					],
					[
						[0, 0, 0],
						[1, 2, 1],
						[-1, 5, -1],
						[-1, -1, -1],
					]),
			}

			const payload = {
				row: 0,
				col: 0,
			}

			// action
			const newState = reducer(oldState, chordCell(payload))

			// assert
			expect(newState.board).toEqual(oldState.board)
		})

		it('reveals neighbor cells if cell value equals neighbor flag count', () => {
			// arrange
			const oldState = {
				status: GAME_STATUS.PLAYING,
				settings: {
					rowCount: 4,
					colCount: 3,
					mineCount: 5,
					seed: 'seed',
				},
				data: {
					safeCount: 7,
				},
				board: buildBoard(
					[
						[CELL_STATE.REVEALED, CELL_STATE.HIDDEN, CELL_STATE.FLAGGED],
						[CELL_STATE.REVEALED, CELL_STATE.HIDDEN, CELL_STATE.REVEALED],
						[CELL_STATE.FLAGGED, CELL_STATE.REVEALED, CELL_STATE.HIDDEN],
						[CELL_STATE.FLAGGED, CELL_STATE.FLAGGED, CELL_STATE.FLAGGED],
					],
					[
						[0, 0, 0],
						[1, 2, 1],
						[-1, 5, -1],
						[-1, -1, -1],
					]),
			}

			const payload = {
				row: 1,
				col: 0,
			}

			// action
			const newState = reducer(oldState, chordCell(payload))

			// assert
			expect(getStates(newState.board)).toEqual([
				[CELL_STATE.REVEALED, CELL_STATE.REVEALED, CELL_STATE.FLAGGED],
				[CELL_STATE.REVEALED, CELL_STATE.REVEALED, CELL_STATE.REVEALED],
				[CELL_STATE.FLAGGED, CELL_STATE.REVEALED, CELL_STATE.HIDDEN],
				[CELL_STATE.FLAGGED, CELL_STATE.FLAGGED, CELL_STATE.FLAGGED],
			])
		})
	})

	describe('peekOneCell', () => {
		it('resets and peeks if cell is hidden', () => {
			// arrange
			const oldState = {
				status: GAME_STATUS.PLAYING,
				settings: {
					rowCount: 4,
					colCount: 3,
					mineCount: 5,
					seed: 'seed',
				},
				data: {
					safeCount: 7,
				},
				board: buildBoard(
					[
						[CELL_STATE.HIDDEN, CELL_STATE.REVEALED, CELL_STATE.REVEALED],
						[CELL_STATE.FLAGGED, CELL_STATE.PEEKED, CELL_STATE.FLAGGED],
						[CELL_STATE.REVEALED, CELL_STATE.FLAGGED, CELL_STATE.FLAGGED],
						[CELL_STATE.FLAGGED, CELL_STATE.HIDDEN, CELL_STATE.REVEALED],
					]),
			}

			const payload = {
				row: 0,
				col: 0,
			}

			// action
			const newState = reducer(oldState, peekOneCell(payload))

			// assert
			expect(getStates(newState.board)).toEqual([
				[CELL_STATE.PEEKED, CELL_STATE.REVEALED, CELL_STATE.REVEALED],
				[CELL_STATE.FLAGGED, CELL_STATE.HIDDEN, CELL_STATE.FLAGGED],
				[CELL_STATE.REVEALED, CELL_STATE.FLAGGED, CELL_STATE.FLAGGED],
				[CELL_STATE.FLAGGED, CELL_STATE.HIDDEN, CELL_STATE.REVEALED],
			])
		})

		it('resets and does not peek if cell is revealed', () => {
			// arrange
			const oldState = {
				status: GAME_STATUS.PLAYING,
				settings: {
					rowCount: 4,
					colCount: 3,
					mineCount: 5,
					seed: 'seed',
				},
				data: {
					safeCount: 7,
				},
				board: buildBoard(
					[
						[CELL_STATE.HIDDEN, CELL_STATE.REVEALED, CELL_STATE.REVEALED],
						[CELL_STATE.FLAGGED, CELL_STATE.PEEKED, CELL_STATE.FLAGGED],
						[CELL_STATE.REVEALED, CELL_STATE.FLAGGED, CELL_STATE.FLAGGED],
						[CELL_STATE.FLAGGED, CELL_STATE.HIDDEN, CELL_STATE.REVEALED],
					]),
			}

			const payload = {
				row: 1,
				col: 0,
			}

			// action
			const newState = reducer(oldState, peekOneCell(payload))

			// assert
			expect(getStates(newState.board)).toEqual([
				[CELL_STATE.HIDDEN, CELL_STATE.REVEALED, CELL_STATE.REVEALED],
				[CELL_STATE.FLAGGED, CELL_STATE.HIDDEN, CELL_STATE.FLAGGED],
				[CELL_STATE.REVEALED, CELL_STATE.FLAGGED, CELL_STATE.FLAGGED],
				[CELL_STATE.FLAGGED, CELL_STATE.HIDDEN, CELL_STATE.REVEALED],
			])
		})
	})

	describe('peekNeighborCells', () => {
		it('resets and peeks if cell is hidden', () => {
			// arrange
			// arrange
			const oldState = {
				status: GAME_STATUS.PLAYING,
				settings: {
					rowCount: 4,
					colCount: 3,
					mineCount: 5,
					seed: 'seed',
				},
				data: {
					safeCount: 7,
				},
				board: buildBoard(
					[
						[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
						[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.FLAGGED],
						[CELL_STATE.REVEALED, CELL_STATE.FLAGGED, CELL_STATE.FLAGGED],
						[CELL_STATE.FLAGGED, CELL_STATE.PEEKED, CELL_STATE.REVEALED],
					]),
			}

			const payload = {
				row: 0,
				col: 1,
			}

			// action
			const newState = reducer(oldState, peekNeighborCells(payload))

			// assert
			expect(getStates(newState.board)).toEqual([
				[CELL_STATE.PEEKED, CELL_STATE.PEEKED, CELL_STATE.PEEKED],
				[CELL_STATE.PEEKED, CELL_STATE.PEEKED, CELL_STATE.FLAGGED],
				[CELL_STATE.REVEALED, CELL_STATE.FLAGGED, CELL_STATE.FLAGGED],
				[CELL_STATE.FLAGGED, CELL_STATE.HIDDEN, CELL_STATE.REVEALED],
			])
		})
	})
})