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
			expect(newState).toEqual({
				status: GAME_STATUS.READY,
				settings: payload,
				statistics: {
					cellCount: 12,
					safeCount: 7,
				},
				board: [
					[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
					[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
					[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
					[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
				],
				mines: [
					[CELL_VALUE.EMPTY, CELL_VALUE.EMPTY, CELL_VALUE.EMPTY],
					[CELL_VALUE.EMPTY, CELL_VALUE.MINED, CELL_VALUE.EMPTY],
					[CELL_VALUE.MINED, CELL_VALUE.EMPTY, CELL_VALUE.EMPTY],
					[CELL_VALUE.MINED, CELL_VALUE.MINED, CELL_VALUE.MINED],
				],
			})
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
				statistics: {
					cellCount: 12,
					safeCount: 7,
				},
				board: [
					[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
					[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
					[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
					[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
				],
				mines: [
					[CELL_VALUE.MINED, CELL_VALUE.MINED, CELL_VALUE.MINED],
					[CELL_VALUE.MINED, CELL_VALUE.MINED, CELL_VALUE.EMPTY],
					[CELL_VALUE.MINED, CELL_VALUE.MINED, CELL_VALUE.MINED],
					[CELL_VALUE.MINED, CELL_VALUE.MINED, CELL_VALUE.MINED],
				],
			}

			const payload = {
				row: 1,
				col: 1,
			}

			// action
			const newState = reducer(oldState, revealCell(payload))

			// assert
			expect(newState.mines).toEqual([
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
				statistics: {
					cellCount: 12,
					safeCount: 7,
				},
				board: [
					[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
					[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
					[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
					[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
				],
				mines: [
					[CELL_VALUE.EMPTY, CELL_VALUE.EMPTY, CELL_VALUE.EMPTY],
					[CELL_VALUE.EMPTY, CELL_VALUE.MINED, CELL_VALUE.EMPTY],
					[CELL_VALUE.MINED, CELL_VALUE.EMPTY, CELL_VALUE.EMPTY],
					[CELL_VALUE.MINED, CELL_VALUE.MINED, CELL_VALUE.MINED],
				],
			}

			const payload = {
				row: 0,
				col: 0,
			}

			// action
			const newState = reducer(oldState, revealCell(payload))

			// assert
			expect(newState.status).toEqual(GAME_STATUS.PLAYING)
			expect(newState.mines).toEqual([
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
				statistics: {
					cellCount: 12,
					safeCount: 7,
				},
				board: [
					[CELL_STATE.HIDDEN, CELL_STATE.FLAGGED, CELL_STATE.HIDDEN],
					[CELL_STATE.HIDDEN, CELL_STATE.REVEALED, CELL_STATE.HIDDEN],
					[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
					[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
				],
				mines: [
					[0, 0, 0],
					[1, 2, 1],
					[-1, 5, -1],
					[-1, -1, -1],
				],
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
				statistics: {
					cellCount: 12,
					safeCount: 7,
				},
				board: [
					[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
					[CELL_STATE.HIDDEN, CELL_STATE.REVEALED, CELL_STATE.HIDDEN],
					[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
					[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
				],
				mines: [
					[0, 0, 0],
					[1, 2, 1],
					[-1, 5, -1],
					[-1, -1, -1],
				],
			}

			const payload = {
				row: 0,
				col: 1,
			}

			// action
			const newState = reducer(oldState, revealCell(payload))

			// assert
			expect(newState.status).toEqual(GAME_STATUS.PLAYING)
			expect(newState.board).toEqual([
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
				statistics: {
					cellCount: 12,
					safeCount: 7,
				},
				board: [
					[CELL_STATE.REVEALED, CELL_STATE.HIDDEN, CELL_STATE.REVEALED],
					[CELL_STATE.REVEALED, CELL_STATE.REVEALED, CELL_STATE.REVEALED],
					[CELL_STATE.HIDDEN, CELL_STATE.FLAGGED, CELL_STATE.HIDDEN],
					[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
				],
				mines: [
					[0, 0, 0],
					[1, 2, 1],
					[-1, 5, -1],
					[-1, -1, -1],
				],
			}

			const payload = {
				row: 2,
				col: 0,
			}

			// action
			const newState = reducer(oldState, revealCell(payload))

			// assert
			expect(newState.status).toEqual(GAME_STATUS.LOSE)
			expect(newState.board).toEqual([
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
				statistics: {
					cellCount: 12,
					safeCount: 7,
				},
				board: [
					[CELL_STATE.REVEALED, CELL_STATE.HIDDEN, CELL_STATE.REVEALED],
					[CELL_STATE.REVEALED, CELL_STATE.REVEALED, CELL_STATE.REVEALED],
					[CELL_STATE.HIDDEN, CELL_STATE.REVEALED, CELL_STATE.HIDDEN],
					[CELL_STATE.HIDDEN, CELL_STATE.FLAGGED, CELL_STATE.HIDDEN],
				],
				mines: [
					[0, 0, 0],
					[1, 2, 1],
					[-1, 5, -1],
					[-1, -1, -1],
				],
			}

			const payload = {
				row: 0,
				col: 1,
			}

			// action
			const newState = reducer(oldState, revealCell(payload))

			// assert
			expect(newState.status).toEqual(GAME_STATUS.WIN)
			expect(newState.board).toEqual([
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
				board: [
					[CELL_STATE.HIDDEN, CELL_STATE.REVEALED, CELL_STATE.REVEALED],
					[CELL_STATE.FLAGGED, CELL_STATE.PEEKED, CELL_STATE.FLAGGED],
					[CELL_STATE.REVEALED, CELL_STATE.FLAGGED, CELL_STATE.FLAGGED],
					[CELL_STATE.FLAGGED, CELL_STATE.HIDDEN, CELL_STATE.REVEALED],
				],
			}

			const payload = {
				row: 0,
				col: 0,
			}

			// action
			const newState = reducer(oldState, toggleFlag(payload))

			// assert
			expect(newState.board[0][0]).toEqual(CELL_STATE.FLAGGED)
		})

		it('removes flag from flagged cell', () => {
			// arrange
			const oldState = {
				status: GAME_STATUS.PLAYING,
				board: [
					[CELL_STATE.HIDDEN, CELL_STATE.REVEALED, CELL_STATE.REVEALED],
					[CELL_STATE.FLAGGED, CELL_STATE.PEEKED, CELL_STATE.FLAGGED],
					[CELL_STATE.REVEALED, CELL_STATE.FLAGGED, CELL_STATE.FLAGGED],
					[CELL_STATE.FLAGGED, CELL_STATE.HIDDEN, CELL_STATE.REVEALED],
				],
			}

			const payload = {
				row: 1,
				col: 0,
			}

			// action
			const newState = reducer(oldState, toggleFlag(payload))

			// assert
			expect(newState.board[1][0]).toEqual(CELL_STATE.HIDDEN)
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
				statistics: {
					cellCount: 12,
					safeCount: 7,
				},
				board: [
					[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
					[CELL_STATE.FLAGGED, CELL_STATE.HIDDEN, CELL_STATE.FLAGGED],
					[CELL_STATE.REVEALED, CELL_STATE.FLAGGED, CELL_STATE.FLAGGED],
					[CELL_STATE.FLAGGED, CELL_STATE.HIDDEN, CELL_STATE.REVEALED],
				],
				mines: [
					[0, 0, 0],
					[1, 2, 1],
					[-1, 5, -1],
					[-1, -1, -1],
				],
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
				statistics: {
					cellCount: 12,
					safeCount: 7,
				},
				board: [
					[CELL_STATE.REVEALED, CELL_STATE.HIDDEN, CELL_STATE.FLAGGED],
					[CELL_STATE.REVEALED, CELL_STATE.HIDDEN, CELL_STATE.REVEALED],
					[CELL_STATE.FLAGGED, CELL_STATE.REVEALED, CELL_STATE.HIDDEN],
					[CELL_STATE.FLAGGED, CELL_STATE.FLAGGED, CELL_STATE.FLAGGED],
				],
				mines: [
					[0, 0, 0],
					[1, 2, 1],
					[-1, 5, -1],
					[-1, -1, -1],
				],
			}

			const payload = {
				row: 1,
				col: 0,
			}

			// action
			const newState = reducer(oldState, chordCell(payload))

			// assert
			expect(newState.board).toEqual([
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
				statistics: {
					cellCount: 12,
					safeCount: 7,
				},
				board: [
					[CELL_STATE.HIDDEN, CELL_STATE.REVEALED, CELL_STATE.REVEALED],
					[CELL_STATE.FLAGGED, CELL_STATE.PEEKED, CELL_STATE.FLAGGED],
					[CELL_STATE.REVEALED, CELL_STATE.FLAGGED, CELL_STATE.FLAGGED],
					[CELL_STATE.FLAGGED, CELL_STATE.HIDDEN, CELL_STATE.REVEALED],
				],
			}

			const payload = {
				row: 0,
				col: 0,
			}

			// action
			const newState = reducer(oldState, peekOneCell(payload))

			// assert
			expect(newState.board).toEqual([
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
				statistics: {
					cellCount: 12,
					safeCount: 7,
				},
				board: [
					[CELL_STATE.HIDDEN, CELL_STATE.REVEALED, CELL_STATE.REVEALED],
					[CELL_STATE.FLAGGED, CELL_STATE.PEEKED, CELL_STATE.FLAGGED],
					[CELL_STATE.REVEALED, CELL_STATE.FLAGGED, CELL_STATE.FLAGGED],
					[CELL_STATE.FLAGGED, CELL_STATE.HIDDEN, CELL_STATE.REVEALED],
				],
			}

			const payload = {
				row: 1,
				col: 0,
			}

			// action
			const newState = reducer(oldState, peekOneCell(payload))

			// assert
			expect(newState.board).toEqual([
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
				statistics: {
					cellCount: 12,
					safeCount: 7,
				},
				board: [
					[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.HIDDEN],
					[CELL_STATE.HIDDEN, CELL_STATE.HIDDEN, CELL_STATE.FLAGGED],
					[CELL_STATE.REVEALED, CELL_STATE.FLAGGED, CELL_STATE.FLAGGED],
					[CELL_STATE.FLAGGED, CELL_STATE.PEEKED, CELL_STATE.REVEALED],
				],
			}

			const payload = {
				row: 0,
				col: 1,
			}

			// action
			const newState = reducer(oldState, peekNeighborCells(payload))

			// assert
			expect(newState.board).toEqual([
				[CELL_STATE.PEEKED, CELL_STATE.PEEKED, CELL_STATE.PEEKED],
				[CELL_STATE.PEEKED, CELL_STATE.PEEKED, CELL_STATE.FLAGGED],
				[CELL_STATE.REVEALED, CELL_STATE.FLAGGED, CELL_STATE.FLAGGED],
				[CELL_STATE.FLAGGED, CELL_STATE.HIDDEN, CELL_STATE.REVEALED],
			])
		})
	})
})