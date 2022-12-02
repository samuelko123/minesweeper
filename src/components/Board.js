import React from 'react'
import { Tile } from './Tile'
const arr2D = require('../lib/arr2D')
const constants = require('../lib/constants')
const minesweeper = require('../lib/minesweeper')

export const Board = (props) => {
	const {
		board_width,
		board_height,
		bomb_count,
		notifyFlagChange,
		notifyGameStatus,
		notifyTilePeek,
	} = props

	const non_bomb_tiles = board_width * board_height - bomb_count
	let mouse = 0
	let tile_value = arr2D.create(board_height, board_width, 0)
	let tile_state = arr2D.create(board_height, board_width, constants.TILE_STATE_INIT)
	let peek_state = arr2D.create(board_height, board_width, false)
	let enabled = true
	let started = false

	// Make sure blank tile for first click (or non-bomb tile if too many bombs)
	const populateBoard = (start_row, start_col) => {
		started = true
		tile_value = minesweeper.createBoard(board_height, board_width, bomb_count, start_row, start_col, constants.BOMB_VALUE)
		notifyGameStatus(constants.GAME_STATUS_START)
		handleTileLeftClick(start_row, start_col)
	}

	const handleTileTouchEvent = (row, col) => {
		if (tile_state[row][col] === constants.TILE_STATE_CLICKED) { HandleTileBothClick(row, col) }
		else { handleTileLeftClick(row, col) }
	}

	const handleTileLongTouchEvent = (row, col) => {
		flagTile(row, col)
	}

	const handleTileLeftClick = (row, col) => {
		// If not yet started, populate board
		if (!started) {
			populateBoard(row, col)
		}

		// If flagged or clicked, do nothing
		else if (tile_state[row][col] === constants.TILE_STATE_FLAGGED
			|| tile_state[row][col] === constants.TILE_STATE_CLICKED
			|| tile_state[row][col] === constants.TILE_STATE_NO_BOMB) {
			// Do nothing
		}

		// If it's bomb, game over
		else if (tile_value[row][col] === constants.BOMB_VALUE) {
			tile_state[row][col] = constants.TILE_STATE_RED_BOMB
			handleGameLose()
		}

		else {
			// Click the tile
			tile_state[row][col] = constants.TILE_STATE_CLICKED

			// If tile is zero, click adjacent non-bomb tiles
			tile_state = minesweeper.OpenNonBombAdj(tile_value, tile_state, row, col, constants.BOMB_VALUE, constants.TILE_STATE_FLAGGED, constants.TILE_STATE_CLICKED)

			// Check whether win
			if (arr2D.getCount(tile_state, constants.TILE_STATE_CLICKED) === non_bomb_tiles) {
				handleGameWin()
			}
		}
	}

	// Toggle flag on tile if not clicked
	const flagTile = (row, col) => {
		if (started) {
			if (tile_state[row][col] !== constants.TILE_STATE_CLICKED) {
				if (tile_state[row][col] === constants.TILE_STATE_FLAGGED) {
					tile_state[row][col] = constants.TILE_STATE_INIT
					notifyFlagChange(false)
				}
				else if (tile_state[row][col] === constants.TILE_STATE_INIT) {
					tile_state[row][col] = constants.TILE_STATE_FLAGGED
					notifyFlagChange(true)
				}
			}
		}
	}

	// Peek 1 tile
	const peekTile = (row, col, active) => {
		peek_state[row][col] = active
		notifyTilePeek(active)
	}

	// Peek 9 tiles
	const peekTileAdj = (row, col, active) => {
		arr2D.callFnOnAdj(peek_state, row, col, (i, j) => {
			peek_state[i][j] = active
		})

		notifyTilePeek(active)
	}

	// Quit peek mode
	const peekTileReset = () => {
		peek_state = arr2D.create(board_height, board_width, false)
		notifyTilePeek(false)
	}

	// If the tile's number equals surrounding flag count,
	// click the surrounding tiles
	const HandleTileBothClick = (row, col) => {
		const adjBombCount = tile_value[row][col]

		if (adjBombCount > 0 && tile_state[row][col] === constants.TILE_STATE_CLICKED) {
			const flag_count = arr2D.getAdjCount(tile_state, row, col, constants.TILE_STATE_FLAGGED)
			if (flag_count === adjBombCount) {
				arr2D.callFnOnAdj(tile_value, row, col, handleTileLeftClick)
			}
		}
	}

	const handleTileMouseEvent = (row, col, mouse_button, mouse_event, ctrl) => {
		if (mouse_event === constants.MOUSE_ENTER) {
			switch (mouse_button) {
				case constants.MOUSE_LEFT:
					peekTile(row, col, true)
					break
				case constants.MOUSE_BOTH:
				case constants.MOUSE_MIDDLE:
					peekTileAdj(row, col, true)
					break
				default: // Do Nothing
			}
		}
		else if (mouse_event === constants.MOUSE_LEAVE) {
			switch (mouse_button) {
				case constants.MOUSE_LEFT:
					peekTile(row, col, false)
					break
				case constants.MOUSE_BOTH:
				case constants.MOUSE_MIDDLE:
					peekTileAdj(row, col, false)
					break
				default: // Do Nothing
			}
		}
		else if (mouse_event === constants.MOUSE_DOWN) {
			switch (mouse_button) {
				case constants.MOUSE_RIGHT:
					flagTile(row, col)
					break
				case constants.MOUSE_LEFT:
					if (ctrl) { flagTile(row, col) }
					else { peekTile(row, col, true) }
					break
				case constants.MOUSE_BOTH:
				case constants.MOUSE_MIDDLE:
					if (!ctrl) { peekTileAdj(row, col, true) }
					break
				default: // Do Nothing
			}

			mouse = mouse_button
		}
		else if (mouse_event === constants.MOUSE_UP) {
			peekTileReset()

			// Note: Mouse up's event_buttons is undefined
			switch (mouse) {
				case constants.MOUSE_LEFT:
					handleTileLeftClick(row, col)
					break
				case constants.MOUSE_BOTH:
				case constants.MOUSE_MIDDLE:
					HandleTileBothClick(row, col)
					break
				default: // Do Nothing
			}

			// Reset mouse button
			mouse = 0
		}
	}

	const handleGameLose = () => {
		tile_state = arr2D.map(tile_state, (arr, i, j) => {
			if (tile_value[i][j] === constants.BOMB_VALUE) {
				if (arr[i][j] !== constants.TILE_STATE_RED_BOMB && arr[i][j] !== constants.TILE_STATE_FLAGGED) {
					arr[i][j] = constants.TILE_STATE_CLICKED
				}
			}
			else if (arr[i][j] === constants.TILE_STATE_FLAGGED) {
				arr[i][j] = constants.TILE_STATE_NO_BOMB
			}
		})

		enabled = false
		notifyGameStatus(constants.GAME_STATUS_LOSE)
	}

	// Flag all bomb tiles
	const handleGameWin = () => {
		tile_state = arr2D.map(tile_state, (arr, i, j) => {
			if (tile_value[i][j] === constants.BOMB_VALUE) {
				arr[i][j] = constants.TILE_STATE_FLAGGED
			}
		})

		enabled = false
		notifyGameStatus(constants.GAME_STATUS_WIN)
	}

	return (
		<table id='board'>
			<tbody>
				{
					tile_value.map((arr, row) => {
						return (
							<tr key={row}>
								{arr.map((_, col) => {
									return (
										<Tile
											key={col + '_' + row}
											peek={peek_state[row][col]}
											tile_value={tile_value[row][col]}
											tile_state={tile_state[row][col]}
											notifyMouseEvent={enabled ? handleTileMouseEvent : null}
											notifyTouchEvent={enabled ? handleTileTouchEvent : null}
											notifyLongTouchEvent={enabled ? handleTileLongTouchEvent : null}
											row={row}
											col={col}
										/>
									)
								})
								}
							</tr>
						)
					})
				}
			</tbody>
		</table>
	)
}