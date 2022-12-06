import {
	CELL_STATE,
	CELL_VALUE,
	GAME_MODE,
	GAME_STATUS,
	chordCell,
	initGame,
	peekNeighborCells,
	peekOneCell,
	minesweeperReducer as reducer,
	resetPeek,
	revealCell,
	setMode,
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
	describe('initGame', () => {
		it('populates settings and randomised mines', () => {
			// arrange
			const payload = {
				rowCount: 4,
				colCount: 3,
				mineCount: 5,
				seed: 'seed',
			}

			// action
			const newState = reducer(undefined, initGame(payload))

			// assert
			expect(newState.status).toEqual(GAME_STATUS.READY)
			expect(newState.settings).toEqual(payload)
			expect(newState.data).toEqual({
				cellCount: 12,
				safeCount: 7,
				flagCount: 0,
				peeking: false,
			})
			expect(getStates(newState.board)).toEqual([
				[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
				[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
				[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
				[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
			])
			expect(getValues(newState.board)).toEqual([
				[CELL_VALUE.EMPTY, CELL_VALUE.EMPTY, CELL_VALUE.EMPTY],
				[CELL_VALUE.EMPTY, CELL_VALUE.MINED, CELL_VALUE.EMPTY],
				[CELL_VALUE.MINED, CELL_VALUE.EMPTY, CELL_VALUE.EMPTY],
				[CELL_VALUE.MINED, CELL_VALUE.MINED, CELL_VALUE.MINED],
			])
		})
	})

	describe('revealCell', () => {
		it('does nothing if game is not ready/playing', () => {
			const oldState = {
				status: GAME_STATUS.WIN,
			}

			const payload = {
				row: 1,
				col: 1,
			}

			const newState = reducer(oldState, revealCell(payload))
			expect(newState).toEqual(oldState)
		})

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
		it('does nothing if game is not playing', () => {
			const oldState = {
				status: GAME_STATUS.WIN,
			}

			const payload = {
				row: 1,
				col: 1,
			}

			const newState = reducer(oldState, toggleFlag(payload))
			expect(newState).toEqual(oldState)
		})

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
				data: {
					flagCount: 5,
				},
			}

			const payload = {
				row: 0,
				col: 0,
			}

			// action
			const newState = reducer(oldState, toggleFlag(payload))

			// assert
			expect(newState.board[0][0].state).toEqual(CELL_STATE.FLAGGED)
			expect(newState.data.flagCount).toEqual(oldState.data.flagCount + 1)
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
				data: {
					flagCount: 5,
				},
			}

			const payload = {
				row: 1,
				col: 0,
			}

			// action
			const newState = reducer(oldState, toggleFlag(payload))

			// assert
			expect(newState.board[1][0].state).toEqual(CELL_STATE.HIDDEN)
			expect(newState.data.flagCount).toEqual(oldState.data.flagCount - 1)
		})
	})

	describe('chordCell', () => {
		it('does nothing if game is not playing', () => {
			const oldState = {
				status: GAME_STATUS.WIN,
			}

			const payload = {
				row: 1,
				col: 1,
			}

			const newState = reducer(oldState, chordCell(payload))
			expect(newState).toEqual(oldState)
		})

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
		it('does nothing if game is not ready/playing', () => {
			const oldState = {
				status: GAME_STATUS.WIN,
			}

			const payload = {
				row: 1,
				col: 1,
			}

			const newState = reducer(oldState, peekOneCell(payload))
			expect(newState).toEqual(oldState)
		})

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
		it('does nothing if game is not ready/playing', () => {
			const oldState = {
				status: GAME_STATUS.WIN,
			}

			const payload = {
				row: 1,
				col: 1,
			}

			const newState = reducer(oldState, peekNeighborCells(payload))
			expect(newState).toEqual(oldState)
		})

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

	describe('resetPeek', () => {
		it('resets peek status', () => {
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
					peeking: true,
				},
				board: buildBoard(
					[
						[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
						[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.FLAGGED],
						[CELL_STATE.REVEALED, CELL_STATE.FLAGGED, CELL_STATE.FLAGGED],
						[CELL_STATE.FLAGGED, CELL_STATE.PEEKED, CELL_STATE.REVEALED],
					]),
			}

			// action
			const newState = reducer(oldState, resetPeek())

			// assert
			expect(getStates(newState.board)).toEqual([
				[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
				[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.FLAGGED],
				[CELL_STATE.REVEALED, CELL_STATE.FLAGGED, CELL_STATE.FLAGGED],
				[CELL_STATE.FLAGGED, CELL_STATE.HIDDEN, CELL_STATE.REVEALED],
			])
		})
	})

	describe('setMode', () => {
		const testCases = [
			['easy', GAME_MODE.EASY],
			['medium', GAME_MODE.MEDIUM],
			['hard', GAME_MODE.HARD],
		]

		test.each(testCases)(
			'%s',
			(_, mode) => {
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
					mode: mode,
				}

				// action
				const newState = reducer(oldState, setMode(payload))

				// assert
				expect(newState.status).toEqual(GAME_STATUS.READY)
				expect(newState.settings.mode).toEqual(mode)
				expect(newState.data.peeking).toEqual(false)
				expect(newState.data.flagCount).toEqual(0)
				expect(getStates(newState.board).flat()).toEqual(
					expect.arrayContaining([CELL_STATE.HIDDEN]),
				)
				expect(getValues(newState.board).flat()).toEqual(
					expect.arrayContaining([CELL_VALUE.EMPTY, CELL_VALUE.MINED]),
				)
			},
		)
	})
})