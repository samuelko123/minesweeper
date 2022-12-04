import seedrandom from 'seedrandom'

export class Minesweeper {
	createNewGame(rowCount, colCount, bombCount, seed) {
		this.gameState = GAME_STATE.INIT

		this.rowCount = rowCount
		this.colCount = colCount
		this.bombCount = bombCount
		this.cellCount = rowCount * colCount
		this.safeCount = this.cellCount - this.bombCount
		if (this.bombCount >= this.cellCount) {
			throw new Error(`cannot place ${this.bombCount} bombs on ${this.cellCount} tiles`)
		}

		if (seed === undefined) {
			this.random = seedrandom()
		} else {
			this.random = seedrandom(seed)
		}

		this._initBoards()
		this._placeBombs()
		this._shuffle()
		this.gameState = GAME_STATE.READY
	}

	_initBoards() {
		this.boardValue = Array(this.rowCount).fill(null).map(() => {
			return Array(this.colCount).fill(CELL_VALUE.EMPTY)
		})

		this.boardState = Array(this.rowCount).fill(null).map(() => {
			return Array(this.colCount).fill(CELL_STATE.CLOSED)
		})
	}

	_placeBombs() {
		this.boardValue = this.boardValue.map((row, rowIndex) => {
			const bombCountOnRow = this.bombCount - rowIndex * this.colCount
			if (bombCountOnRow >= this.colCount) {
				return row.fill(CELL_VALUE.BOMB)
			} else if (bombCountOnRow > 0) {
				return row.fill(CELL_VALUE.BOMB, 0, bombCountOnRow)
			}

			return row
		})
	}

	_shuffle() {
		this._callFnOnAllCells((i, j) => {
			const x = Math.floor(this.random() * this.rowCount)
			const y = Math.floor(this.random() * this.colCount)
			const temp = this.boardValue[i][j]
			this.boardValue[i][j] = this.boardValue[x][y]
			this.boardValue[x][y] = temp
		})
	}

	_fillAdjBombCount() {
		this._callFnOnAllCells((i, j) => {
			if (this.boardValue[i][j] !== CELL_VALUE.BOMB) {
				return
			}

			this._callFnOnAdjCells(i, j, (i, j) => {
				if (this.boardValue[i][j] !== CELL_VALUE.BOMB) {
					this.boardValue[i][j]++
				}
			})
		})
	}

	_callFnOnAdjCells(row, col, fn) {
		const i1 = Math.max(row - 1, 0)
		const i2 = Math.min(row + 1, this.rowCount - 1)
		const j1 = Math.max(col - 1, 0)
		const j2 = Math.min(col + 1, this.colCount - 1)

		for (let i = i1; i <= i2; i++) {
			for (let j = j1; j <= j2; j++) {
				fn(i, j)
			}
		}
	}

	_callFnOnAllCells(fn) {
		for (let i = 0; i < this.rowCount; i++) {
			for (let j = 0; j < this.colCount; j++) {
				fn(i, j)
			}
		}
	}

	openCell(row, col) {
		if (this.gameState === GAME_STATE.READY) {
			this.gameState = GAME_STATE.PLAYING

			if (this.boardValue[row][col] === CELL_VALUE.BOMB) {
				this._moveBombToEmptyCell(row, col)
			}

			this._fillAdjBombCount()
		}

		if (
			this.boardState[row][col] === CELL_STATE.OPENED ||
			this.boardState[row][col] === CELL_STATE.FLAGGED
		) {
			return
		}

		if (
			this.boardValue[row][col] === CELL_VALUE.BOMB
		) {
			this._handleLose()
			return
		}

		this.boardState[row][col] = CELL_STATE.OPENED
		this._openSafeAdjClosedCells(row, col)
		if (this._checkWin()) {
			this._handleWin()
		}
	}

	_moveBombToEmptyCell(row, col) {
		let x, y
		do {
			x = Math.floor(this.random() * this.rowCount)
			y = Math.floor(this.random() * this.colCount)
		} while (
			this.boardValue[x][y] === CELL_VALUE.BOMB ||
			(x === row && y === col)
		)

		this.boardValue[row][col] = CELL_VALUE.EMPTY
		this.boardValue[x][y] = CELL_VALUE.BOMB
	}

	_openSafeAdjClosedCells(row, col) {
		const toBeOpened = [{
			row: row,
			col: col,
		}]

		while (toBeOpened.length !== 0) {
			const cell = toBeOpened.pop()
			this.boardState[cell.row][cell.col] = CELL_STATE.OPENED

			if (this.boardValue[cell.row][cell.col] === CELL_VALUE.EMPTY) {
				this._callFnOnAdjCells(cell.row, cell.col, (i, j) => {
					if (
						(i !== cell.row || j !== cell.col)
						&& this.boardState[i][j] === CELL_STATE.CLOSED
						&& this.boardValue[i][j] !== CELL_VALUE.BOMB
					) {
						toBeOpened.push({
							row: i,
							col: j,
						})
					}
				})
			}
		}
	}

	_checkWin() {
		const openedCount = this.boardState.flat().reduce((prev, curr) => {
			return prev + (curr === CELL_STATE.OPENED ? 1 : 0)
		}, 0)

		return openedCount === this.safeCount
	}

	_handleLose(row, col) {
		this.gameState = GAME_STATE.LOSE
		this.boardState[row][col] = CELL_STATE.EXPLODED

		this._callFnOnAllCells((i, j) => {
			const cellValue = this.boardValue[i][j]
			const cellState = this.boardState[i][j]

			if (
				cellValue === CELL_VALUE.BOMB &&
				cellState !== CELL_STATE.EXPLODED &&
				cellState !== CELL_STATE.FLAGGED
			) {
				this.boardState[i][j] = CELL_STATE.OPENED
			}

			if (
				cellValue !== CELL_VALUE.BOMB &&
				cellState === CELL_STATE.FLAGGED
			) {
				this.boardState[i][j] = CELL_STATE.WRONG_FLAG
			}
		})
	}

	_handleWin() {
		this.gameState = GAME_STATE.WIN

		this._callFnOnAllCells((i, j) => {
			if (this.boardValue[i][j] === CELL_VALUE.BOMB) {
				this.boardState[i][j] = CELL_STATE.FLAGGED
			}
		})
	}

	peekOneCell(row, col) {
		this.resetPeek()
		if (this.boardState[row][col] === CELL_STATE.CLOSED) {
			this.boardState[row][col] = CELL_STATE.PEEKED
		}
	}

	peekAdjCells(row, col) {
		this.resetPeek()
		this._callFnOnAdjCells(row, col, (i, j) => {
			if (this.boardState[i][j] === CELL_STATE.CLOSED) {
				this.boardState[i][j] = CELL_STATE.PEEKED
			}
		})
	}

	resetPeek() {
		this._callFnOnAllCells((i, j) => {
			if (this.boardState[i][j] === CELL_STATE.PEEKED) {
				this.boardState[i][j] = CELL_STATE.CLOSED
			}
		})
	}

	chordCell(row, col) {
		const cellValue = this.boardValue[row][col]
		const cellState = this.boardState[row][col]

		if (
			cellValue <= 0 ||
			cellState !== CELL_STATE.OPENED
		) {
			return
		}

		let flagCount = 0
		this._callFnOnAdjCells(row, col, (i, j) => {
			if (this.boardState[i][j] === CELL_STATE.FLAGGED) {
				flagCount++
			}
		})

		if (flagCount === cellValue) {
			this._callFnOnAdjCells(row, col, (i, j) => {
				if (this.boardState[i][j] === CELL_STATE.CLOSED) {
					this.openCell(i, j)
				}
			})
		}
	}

	flagCell(row, col) {
		if (this.boardState[row][col] === CELL_STATE.CLOSED) {
			this.boardState[row][col] === CELL_STATE.FLAGGED
		}
	}
}

export const CELL_VALUE = Object.freeze({
	EMPTY: 0,
	BOMB: -1,
})

export const CELL_STATE = Object.freeze({
	CLOSED: 0,
	OPENED: 1,
	PEEKED: 2,
	FLAGGED: 3,
	EXPLODED: 4,
	WRONG_FLAG: 5,
})

export const GAME_STATE = Object.freeze({
	INIT: 0,
	READY: 1,
	PLAYING: 2,
	WIN: 3,
	LOSE: 4,
})