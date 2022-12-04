import {
	CELL_STATE,
	CELL_VALUE,
	Minesweeper,
} from './minesweeper'

describe('minesweeper', () => {
	describe('constructor', () => {
		it('throws if bomb count is too high', () => {
			const fn = () => {
				new Minesweeper(10, 20, 999)
			}

			expect(fn).toThrow()
		})
	})

	describe('initBoards', () => {
		it('populates boards with 2d array', () => {
			// arrange
			const m = new Minesweeper(10, 20, 30)

			// action
			m._initBoards()

			// assert
			expect(m.boardValue).toEqual(Array(10).fill(Array(20).fill(CELL_VALUE.EMPTY)))
			expect(m.boardState).toEqual(Array(10).fill(Array(20).fill(CELL_STATE.CLOSED)))
		})
	})

	describe('placeBombs', () => {
		it('places bomb onto the board, starting from top left', () => {
			// arrange
			const m = new Minesweeper(4, 3, 5)
			m._initBoards()

			// action
			m._placeBombs()

			// assert
			expect(m.boardValue).toEqual([
				[CELL_VALUE.BOMB, CELL_VALUE.BOMB, CELL_VALUE.BOMB],
				[CELL_VALUE.BOMB, CELL_VALUE.BOMB, CELL_VALUE.EMPTY],
				[CELL_VALUE.EMPTY, CELL_VALUE.EMPTY, CELL_VALUE.EMPTY],
				[CELL_VALUE.EMPTY, CELL_VALUE.EMPTY, CELL_VALUE.EMPTY],
			])
		})
	})

	describe('shuffle', () => {
		it('shuffle the bombs on the board', () => {
			// arrange
			const m = new Minesweeper(4, 3, 5, 'seed')
			m._initBoards()
			m._placeBombs()

			// action
			m._shuffle()

			// assert
			expect(m.boardValue).toEqual([
				[CELL_VALUE.EMPTY, CELL_VALUE.EMPTY, CELL_VALUE.EMPTY],
				[CELL_VALUE.EMPTY, CELL_VALUE.BOMB, CELL_VALUE.EMPTY],
				[CELL_VALUE.BOMB, CELL_VALUE.EMPTY, CELL_VALUE.EMPTY],
				[CELL_VALUE.BOMB, CELL_VALUE.BOMB, CELL_VALUE.BOMB],
			])
		})
	})

	describe('fillAdjBombCount', () => {
		it('fills the correct adjacent bomb count on each cell', () => {
			// arrange
			const m = new Minesweeper(4, 3, 5, 'seed')
			m.boardValue = [
				[CELL_VALUE.EMPTY, CELL_VALUE.EMPTY, CELL_VALUE.EMPTY],
				[CELL_VALUE.EMPTY, CELL_VALUE.BOMB, CELL_VALUE.EMPTY],
				[CELL_VALUE.BOMB, CELL_VALUE.EMPTY, CELL_VALUE.EMPTY],
				[CELL_VALUE.BOMB, CELL_VALUE.BOMB, CELL_VALUE.BOMB],
			]

			// action
			m._fillAdjBombCount()

			// assert
			expect(m.boardValue).toEqual([
				[1, 1, 1],
				[2, -1, 1],
				[-1, 5, 3],
				[-1, -1, -1],
			])
		})
	})

	describe('createNewGame', () => {
		it('does not throw', () => {
			const fn = () => {
				const m = new Minesweeper(30, 10, 99)
				m.createNewGame()
			}

			expect(fn).not.toThrow()
		})
	})

	describe('openCell', () => {
		it('moves bomb away from first click', () => {
			// arrange
			const m = new Minesweeper(4, 3, 5, 'seed')
			m.createNewGame()
			m.boardValue = [
				[CELL_VALUE.EMPTY, CELL_VALUE.EMPTY, CELL_VALUE.EMPTY],
				[CELL_VALUE.EMPTY, CELL_VALUE.BOMB, CELL_VALUE.EMPTY],
				[CELL_VALUE.BOMB, CELL_VALUE.EMPTY, CELL_VALUE.EMPTY],
				[CELL_VALUE.BOMB, CELL_VALUE.BOMB, CELL_VALUE.BOMB],
			]

			const moveBomb = jest.spyOn(m, '_moveBombToEmptyCell')
			const fillAdj = jest.spyOn(m, '_fillAdjBombCount')

			// action
			m.openCell(1, 1)

			// assert
			expect(moveBomb).toBeCalledTimes(1)
			expect(fillAdj).toBeCalledTimes(1)
		})

		it('does nothing if clicked on flagged cell', () => {
			// arrange
			const m = new Minesweeper(4, 3, 5, 'seed')
			m.createNewGame()
			m.boardState[0][2] = CELL_STATE.FLAGGED

			// action
			m.openCell(0, 2)

			// assert
			expect(m.boardState).toEqual([
				[CELL_STATE.CLOSED, CELL_STATE.CLOSED, CELL_STATE.FLAGGED],
				[CELL_STATE.CLOSED, CELL_STATE.CLOSED, CELL_STATE.CLOSED],
				[CELL_STATE.CLOSED, CELL_STATE.CLOSED, CELL_STATE.CLOSED],
				[CELL_STATE.CLOSED, CELL_STATE.CLOSED, CELL_STATE.CLOSED],
			])
		})

		it('handles lose game if clicked on bomb', () => {
			// arrange
			const m = new Minesweeper(4, 3, 5, 'seed')
			m.createNewGame()
			m.boardValue = [
				[CELL_VALUE.EMPTY, CELL_VALUE.EMPTY, CELL_VALUE.EMPTY],
				[CELL_VALUE.EMPTY, CELL_VALUE.BOMB, CELL_VALUE.EMPTY],
				[CELL_VALUE.BOMB, CELL_VALUE.EMPTY, CELL_VALUE.EMPTY],
				[CELL_VALUE.BOMB, CELL_VALUE.BOMB, CELL_VALUE.BOMB],
			]
			m._moveBombToEmptyCell = jest.fn()
			m._handleLose = jest.fn()

			// action
			m.openCell(1, 1)

			// assert
			expect(m._handleLose).toBeCalledTimes(1)
		})

		it('handles win game if happened', () => {
			// arrange
			const m = new Minesweeper(4, 3, 5, 'seed')
			m.createNewGame()
			m.boardValue = [
				[CELL_VALUE.EMPTY, CELL_VALUE.EMPTY, CELL_VALUE.EMPTY],
				[CELL_VALUE.EMPTY, CELL_VALUE.BOMB, CELL_VALUE.EMPTY],
				[CELL_VALUE.BOMB, CELL_VALUE.EMPTY, CELL_VALUE.EMPTY],
				[CELL_VALUE.BOMB, CELL_VALUE.BOMB, CELL_VALUE.BOMB],
			]
			m.boardState = [
				[CELL_STATE.OPENED, CELL_STATE.OPENED, CELL_STATE.OPENED],
				[CELL_STATE.CLOSED, CELL_STATE.FLAGGED, CELL_STATE.OPENED],
				[CELL_STATE.FLAGGED, CELL_STATE.OPENED, CELL_STATE.OPENED],
				[CELL_STATE.FLAGGED, CELL_STATE.FLAGGED, CELL_STATE.FLAGGED],
			]
			m._handleWin = jest.fn()

			// action
			m.openCell(1, 0)

			// assert
			expect(m._handleWin).toBeCalledTimes(1)
		})
	})

	describe('moveBombToEmptyCell', () => {
		it('moves bomb to an empty cell', () => {
			// arrange
			const m = new Minesweeper(4, 3, 5, 'seed')
			m.boardValue = [
				[CELL_VALUE.BOMB, CELL_VALUE.BOMB, CELL_VALUE.BOMB],
				[CELL_VALUE.BOMB, CELL_VALUE.BOMB, CELL_VALUE.EMPTY],
				[CELL_VALUE.BOMB, CELL_VALUE.BOMB, CELL_VALUE.BOMB],
				[CELL_VALUE.BOMB, CELL_VALUE.BOMB, CELL_VALUE.BOMB],
			]

			// action
			m._moveBombToEmptyCell(1, 1)

			// assert
			expect(m.boardValue).toEqual([
				[CELL_VALUE.BOMB, CELL_VALUE.BOMB, CELL_VALUE.BOMB],
				[CELL_VALUE.BOMB, CELL_VALUE.EMPTY, CELL_VALUE.BOMB],
				[CELL_VALUE.BOMB, CELL_VALUE.BOMB, CELL_VALUE.BOMB],
				[CELL_VALUE.BOMB, CELL_VALUE.BOMB, CELL_VALUE.BOMB],
			])
		})
	})

	describe('openSafeAdjClosedCells', () => {
		it('opens safe adjacent closed cells recursively', () => {
			// arrange
			const m = new Minesweeper(4, 3, 5, 'seed')

			m.boardValue = [
				[CELL_VALUE.EMPTY, CELL_VALUE.EMPTY, CELL_VALUE.EMPTY],
				[CELL_VALUE.BOMB, CELL_VALUE.EMPTY, CELL_VALUE.BOMB],
				[CELL_VALUE.EMPTY, CELL_VALUE.BOMB, CELL_VALUE.BOMB],
				[CELL_VALUE.BOMB, CELL_VALUE.BOMB, CELL_VALUE.EMPTY],
			]

			m.boardState = [
				[CELL_STATE.CLOSED, CELL_STATE.CLOSED, CELL_STATE.FLAGGED],
				[CELL_STATE.CLOSED, CELL_STATE.CLOSED, CELL_STATE.CLOSED],
				[CELL_STATE.CLOSED, CELL_STATE.CLOSED, CELL_STATE.CLOSED],
				[CELL_STATE.CLOSED, CELL_STATE.CLOSED, CELL_STATE.CLOSED],
			]

			// action
			m._openSafeAdjClosedCells(0, 0)

			// assert
			expect(m.boardState).toEqual([
				[CELL_STATE.OPENED, CELL_STATE.OPENED, CELL_STATE.FLAGGED],
				[CELL_STATE.CLOSED, CELL_STATE.OPENED, CELL_STATE.CLOSED],
				[CELL_STATE.OPENED, CELL_STATE.CLOSED, CELL_STATE.CLOSED],
				[CELL_STATE.CLOSED, CELL_STATE.CLOSED, CELL_STATE.CLOSED],
			])
		})
	})

	describe('checkWin', () => {
		it('returns true if all non-bomb cells are opened', () => {
			// arrange
			const m = new Minesweeper(4, 3, 5, 'seed')

			m.boardValue = [
				[CELL_VALUE.EMPTY, CELL_VALUE.EMPTY, CELL_VALUE.EMPTY],
				[CELL_VALUE.EMPTY, CELL_VALUE.BOMB, CELL_VALUE.EMPTY],
				[CELL_VALUE.BOMB, CELL_VALUE.EMPTY, CELL_VALUE.EMPTY],
				[CELL_VALUE.BOMB, CELL_VALUE.BOMB, CELL_VALUE.BOMB],
			]

			m.boardState = [
				[CELL_STATE.OPENED, CELL_STATE.OPENED, CELL_STATE.OPENED],
				[CELL_STATE.OPENED, CELL_STATE.FLAGGED, CELL_STATE.OPENED],
				[CELL_STATE.CLOSED, CELL_STATE.OPENED, CELL_STATE.OPENED],
				[CELL_STATE.CLOSED, CELL_STATE.FLAGGED, CELL_STATE.CLOSED],
			]

			// action
			const isWin = m._checkWin()

			// assert
			expect(isWin).toEqual(true)
		})

		it('returns false if not all non-bomb cells are opened', () => {
			// arrange
			const m = new Minesweeper(4, 3, 5, 'seed')

			m.boardValue = [
				[CELL_VALUE.EMPTY, CELL_VALUE.EMPTY, CELL_VALUE.EMPTY],
				[CELL_VALUE.EMPTY, CELL_VALUE.BOMB, CELL_VALUE.EMPTY],
				[CELL_VALUE.BOMB, CELL_VALUE.EMPTY, CELL_VALUE.EMPTY],
				[CELL_VALUE.BOMB, CELL_VALUE.BOMB, CELL_VALUE.BOMB],
			]

			m.boardState = [
				[CELL_STATE.OPENED, CELL_STATE.OPENED, CELL_STATE.OPENED],
				[CELL_STATE.OPENED, CELL_STATE.FLAGGED, CELL_STATE.OPENED],
				[CELL_STATE.CLOSED, CELL_STATE.FLAGGED, CELL_STATE.OPENED],
				[CELL_STATE.CLOSED, CELL_STATE.FLAGGED, CELL_STATE.CLOSED],
			]

			// action
			const isWin = m._checkWin()

			// assert
			expect(isWin).toEqual(false)
		})
	})

	describe('_handleLose', () => {
		it('reveals all bombs and marks wrong flags', () => {
			// arrange
			const m = new Minesweeper(4, 3, 5, 'seed')

			m.boardValue = [
				[CELL_VALUE.EMPTY, CELL_VALUE.EMPTY, CELL_VALUE.EMPTY],
				[CELL_VALUE.BOMB, CELL_VALUE.EMPTY, CELL_VALUE.BOMB],
				[CELL_VALUE.EMPTY, CELL_VALUE.BOMB, CELL_VALUE.BOMB],
				[CELL_VALUE.BOMB, CELL_VALUE.BOMB, CELL_VALUE.EMPTY],
			]

			m.boardState = [
				[CELL_STATE.CLOSED, CELL_STATE.CLOSED, CELL_STATE.FLAGGED],
				[CELL_STATE.CLOSED, CELL_STATE.CLOSED, CELL_STATE.CLOSED],
				[CELL_STATE.CLOSED, CELL_STATE.CLOSED, CELL_STATE.CLOSED],
				[CELL_STATE.CLOSED, CELL_STATE.CLOSED, CELL_STATE.CLOSED],
			]

			// action
			m._handleLose(1, 0)

			// assert
			expect(m.boardState).toEqual([
				[CELL_STATE.CLOSED, CELL_STATE.CLOSED, CELL_STATE.WRONG_FLAG],
				[CELL_STATE.EXPLODED, CELL_STATE.CLOSED, CELL_STATE.OPENED],
				[CELL_STATE.CLOSED, CELL_STATE.OPENED, CELL_STATE.OPENED],
				[CELL_STATE.OPENED, CELL_STATE.OPENED, CELL_STATE.CLOSED],
			])
		})
	})

	describe('_handleWin', () => {
		it('flags all the bombs', () => {
			// arrange
			const m = new Minesweeper(4, 3, 5, 'seed')

			m.boardValue = [
				[CELL_VALUE.EMPTY, CELL_VALUE.EMPTY, CELL_VALUE.EMPTY],
				[CELL_VALUE.BOMB, CELL_VALUE.EMPTY, CELL_VALUE.BOMB],
				[CELL_VALUE.EMPTY, CELL_VALUE.BOMB, CELL_VALUE.BOMB],
				[CELL_VALUE.BOMB, CELL_VALUE.BOMB, CELL_VALUE.EMPTY],
			]

			m.boardState = [
				[CELL_STATE.OPENED, CELL_STATE.OPENED, CELL_STATE.OPENED],
				[CELL_STATE.FLAGGED, CELL_STATE.OPENED, CELL_STATE.FLAGGED],
				[CELL_STATE.OPENED, CELL_STATE.FLAGGED, CELL_STATE.FLAGGED],
				[CELL_STATE.FLAGGED, CELL_STATE.CLOSED, CELL_STATE.OPENED],
			]

			// action
			m._handleWin()

			// assert
			expect(m.boardState).toEqual([
				[CELL_STATE.OPENED, CELL_STATE.OPENED, CELL_STATE.OPENED],
				[CELL_STATE.FLAGGED, CELL_STATE.OPENED, CELL_STATE.FLAGGED],
				[CELL_STATE.OPENED, CELL_STATE.FLAGGED, CELL_STATE.FLAGGED],
				[CELL_STATE.FLAGGED, CELL_STATE.FLAGGED, CELL_STATE.OPENED],
			])
		})
	})

	describe('peekOneCell', () => {
		it('resets and peeks if cell is closed', () => {
			// arrange
			const m = new Minesweeper(4, 3, 5, 'seed')

			m.boardState = [
				[CELL_STATE.CLOSED, CELL_STATE.OPENED, CELL_STATE.OPENED],
				[CELL_STATE.FLAGGED, CELL_STATE.PEEKED, CELL_STATE.FLAGGED],
				[CELL_STATE.OPENED, CELL_STATE.FLAGGED, CELL_STATE.FLAGGED],
				[CELL_STATE.FLAGGED, CELL_STATE.CLOSED, CELL_STATE.OPENED],
			]

			// action
			m.peekOneCell(0, 0)

			// assert
			expect(m.boardState).toEqual([
				[CELL_STATE.PEEKED, CELL_STATE.OPENED, CELL_STATE.OPENED],
				[CELL_STATE.FLAGGED, CELL_STATE.CLOSED, CELL_STATE.FLAGGED],
				[CELL_STATE.OPENED, CELL_STATE.FLAGGED, CELL_STATE.FLAGGED],
				[CELL_STATE.FLAGGED, CELL_STATE.CLOSED, CELL_STATE.OPENED],
			])
		})

		it('resets and does not peek if cell is closed', () => {
			// arrange
			const m = new Minesweeper(4, 3, 5, 'seed')

			m.boardState = [
				[CELL_STATE.CLOSED, CELL_STATE.OPENED, CELL_STATE.OPENED],
				[CELL_STATE.FLAGGED, CELL_STATE.PEEKED, CELL_STATE.FLAGGED],
				[CELL_STATE.OPENED, CELL_STATE.FLAGGED, CELL_STATE.FLAGGED],
				[CELL_STATE.FLAGGED, CELL_STATE.CLOSED, CELL_STATE.OPENED],
			]
			// action
			m.peekOneCell(1, 0)

			// assert
			expect(m.boardState).toEqual([
				[CELL_STATE.CLOSED, CELL_STATE.OPENED, CELL_STATE.OPENED],
				[CELL_STATE.FLAGGED, CELL_STATE.CLOSED, CELL_STATE.FLAGGED],
				[CELL_STATE.OPENED, CELL_STATE.FLAGGED, CELL_STATE.FLAGGED],
				[CELL_STATE.FLAGGED, CELL_STATE.CLOSED, CELL_STATE.OPENED],
			])
		})
	})

	describe('peekAdjCells', () => {
		it('resets and peeks if cell is closed', () => {
			// arrange
			const m = new Minesweeper(4, 3, 5, 'seed')

			m.boardState = [
				[CELL_STATE.CLOSED, CELL_STATE.CLOSED, CELL_STATE.CLOSED],
				[CELL_STATE.FLAGGED, CELL_STATE.CLOSED, CELL_STATE.FLAGGED],
				[CELL_STATE.OPENED, CELL_STATE.FLAGGED, CELL_STATE.FLAGGED],
				[CELL_STATE.FLAGGED, CELL_STATE.PEEKED, CELL_STATE.OPENED],
			]

			// action
			m.peekAdjCells(0, 1)

			// assert
			expect(m.boardState).toEqual([
				[CELL_STATE.PEEKED, CELL_STATE.PEEKED, CELL_STATE.PEEKED],
				[CELL_STATE.FLAGGED, CELL_STATE.PEEKED, CELL_STATE.FLAGGED],
				[CELL_STATE.OPENED, CELL_STATE.FLAGGED, CELL_STATE.FLAGGED],
				[CELL_STATE.FLAGGED, CELL_STATE.CLOSED, CELL_STATE.OPENED],
			])
		})
	})

	describe('chordCell', () => {
		it('does nothing if cell is closed', () => {
			// arrange
			const m = new Minesweeper(4, 3, 5, 'seed')
			m.createNewGame()
			m.boardState = [
				[CELL_STATE.CLOSED, CELL_STATE.CLOSED, CELL_STATE.CLOSED],
				[CELL_STATE.FLAGGED, CELL_STATE.CLOSED, CELL_STATE.FLAGGED],
				[CELL_STATE.OPENED, CELL_STATE.FLAGGED, CELL_STATE.FLAGGED],
				[CELL_STATE.FLAGGED, CELL_STATE.CLOSED, CELL_STATE.OPENED],
			]
			m._callFnOnAdjCells = jest.fn()

			// action
			m.chordCell(2, 0)

			// assert
			expect(m._callFnOnAdjCells).not.toBeCalled()
		})

		it('opens adjacent cells if cell value equal adjacent flag count', () => {
			// arrange
			const m = new Minesweeper(4, 3, 5, 'seed')
			m.boardValue = [
				[CELL_VALUE.EMPTY, CELL_VALUE.EMPTY, CELL_VALUE.EMPTY],
				[CELL_VALUE.EMPTY, CELL_VALUE.BOMB, CELL_VALUE.EMPTY],
				[CELL_VALUE.BOMB, CELL_VALUE.EMPTY, CELL_VALUE.EMPTY],
				[CELL_VALUE.BOMB, CELL_VALUE.BOMB, CELL_VALUE.BOMB],
			]
			m.boardState = [
				[CELL_STATE.OPENED, CELL_STATE.OPENED, CELL_STATE.CLOSED],
				[CELL_STATE.CLOSED, CELL_STATE.FLAGGED, CELL_STATE.OPENED],
				[CELL_STATE.FLAGGED, CELL_STATE.OPENED, CELL_STATE.OPENED],
				[CELL_STATE.FLAGGED, CELL_STATE.FLAGGED, CELL_STATE.FLAGGED],
			]
			m._fillAdjBombCount()
			m.openCell = jest.fn()

			// action
			m.chordCell(0, 1)

			// assert
			expect(m.openCell).toBeCalledTimes(2)
		})
	})

	describe('flagCell', () => {
		it('puts flag on closed cell', () => {
			// arrange
			const m = new Minesweeper(4, 3, 5, 'seed')
			m.boardState = [
				[CELL_STATE.CLOSED, CELL_STATE.CLOSED, CELL_STATE.CLOSED],
				[CELL_STATE.FLAGGED, CELL_STATE.CLOSED, CELL_STATE.FLAGGED],
				[CELL_STATE.OPENED, CELL_STATE.FLAGGED, CELL_STATE.FLAGGED],
				[CELL_STATE.FLAGGED, CELL_STATE.CLOSED, CELL_STATE.OPENED],
			]

			// action
			m.flagCell(0, 0)

			// assert
			m.boardState[0][0] = CELL_STATE.FLAGGED
		})
	})
})