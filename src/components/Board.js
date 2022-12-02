import React from 'react'
import { Tile } from './Tile'
const arr2D = require('../lib/arr2D')
const constants = require('../lib/constants')
const minesweeper = require('../lib/minesweeper')

export default class Board extends React.Component {
	constructor(props) {
		super(props)

		this.tile_value = arr2D.create(this.props.board_height, this.props.board_width, 0)
		this.tile_state = arr2D.create(this.props.board_height, this.props.board_width, constants.TILE_STATE_INIT)
		this.peek_state = arr2D.create(this.props.board_height, this.props.board_width, false)
		this.non_bomb_tiles = this.props.board_width * this.props.board_height - this.props.bomb_count
		this.mouse_button = 0
		this.enabled = true
		this.started = false
	}

	// Make sure blank tile for first click (or non-bomb tile if too many bombs)
	populateBoard = (start_row, start_col) => {
		this.started = true
		this.tile_value = minesweeper.createBoard(this.props.board_height, this.props.board_width, this.props.bomb_count, start_row, start_col, constants.BOMB_VALUE)
		this.props.notifyGameStatus(constants.GAME_STATUS_START)
		this.handleTileLeftClick(start_row, start_col)
	}

	handleTileTouchEvent = (row, col) => {
		if (this.tile_state[row][col] === constants.TILE_STATE_CLICKED) { this.HandleTileBothClick(row, col) }
		else { this.handleTileLeftClick(row, col) }
	}

	handleTileLongTouchEvent = (row, col) => {
		this.flagTile(row, col)
	}

	handleTileLeftClick = (row, col) => {
		// If not yet started, populate board
		if (!this.started) {
			this.populateBoard(row, col)
		}

		// If flagged or clicked, do nothing
		else if (this.tile_state[row][col] === constants.TILE_STATE_FLAGGED
			|| this.tile_state[row][col] === constants.TILE_STATE_CLICKED
			|| this.tile_state[row][col] === constants.TILE_STATE_NO_BOMB) {
			// Do nothing
		}

		// If it's bomb, game over
		else if (this.tile_value[row][col] === constants.BOMB_VALUE) {
			this.tile_state[row][col] = constants.TILE_STATE_RED_BOMB
			this.handleGameLose()
		}

		else {
			// Click the tile
			this.tile_state[row][col] = constants.TILE_STATE_CLICKED

			// If tile is zero, click adjacent non-bomb tiles
			this.tile_state = minesweeper.OpenNonBombAdj(this.tile_value, this.tile_state, row, col, constants.BOMB_VALUE, constants.TILE_STATE_FLAGGED, constants.TILE_STATE_CLICKED)

			// Check whether win
			if (arr2D.getCount(this.tile_state, constants.TILE_STATE_CLICKED) === this.non_bomb_tiles) {
				this.handleGameWin()
			}
		}
	}

	// Toggle flag on tile if not clicked
	flagTile = (row, col) => {
		if (this.started) {
			if (this.tile_state[row][col] !== constants.TILE_STATE_CLICKED) {
				if (this.tile_state[row][col] === constants.TILE_STATE_FLAGGED) {
					this.tile_state[row][col] = constants.TILE_STATE_INIT
					this.props.notifyFlagChange(false)
				}
				else if (this.tile_state[row][col] === constants.TILE_STATE_INIT) {
					this.tile_state[row][col] = constants.TILE_STATE_FLAGGED
					this.props.notifyFlagChange(true)
				}
			}
		}
	}

	// Peek 1 tile
	peekTile = (row, col, active) => {
		this.peek_state[row][col] = active
		this.props.notifyTilePeek(active)
	}

	// Peek 9 tiles
	peekTileAdj = (row, col, active) => {
		arr2D.callFnOnAdj(this.peek_state, row, col, (i, j) => {
			this.peek_state[i][j] = active
		})

		this.props.notifyTilePeek(active)
	}

	// Quit peek mode
	peekTileReset = () => {
		this.peek_state = arr2D.create(this.props.board_height, this.props.board_width, false)
		this.props.notifyTilePeek(false)
	}

	// If the tile's number equals surrounding flag count,
	// click the surrounding tiles
	HandleTileBothClick = (row, col) => {
		const adjBombCount = this.tile_value[row][col]

		if (adjBombCount > 0 && this.tile_state[row][col] === constants.TILE_STATE_CLICKED) {
			const flag_count = arr2D.getAdjCount(this.tile_state, row, col, constants.TILE_STATE_FLAGGED)
			if (flag_count === adjBombCount) {
				arr2D.callFnOnAdj(this.tile_value, row, col, this.handleTileLeftClick)
			}
		}
	}

	handleTileMouseEvent = (row, col, mouse_button, mouse_event, ctrl) => {
		if (mouse_event === constants.MOUSE_ENTER) {
			switch (mouse_button) {
				case constants.MOUSE_LEFT:
					this.peekTile(row, col, true)
					break
				case constants.MOUSE_BOTH:
				case constants.MOUSE_MIDDLE:
					this.peekTileAdj(row, col, true)
					break
				default: // Do Nothing
			}
		}
		else if (mouse_event === constants.MOUSE_LEAVE) {
			switch (mouse_button) {
				case constants.MOUSE_LEFT:
					this.peekTile(row, col, false)
					break
				case constants.MOUSE_BOTH:
				case constants.MOUSE_MIDDLE:
					this.peekTileAdj(row, col, false)
					break
				default: // Do Nothing
			}
		}
		else if (mouse_event === constants.MOUSE_DOWN) {
			switch (mouse_button) {
				case constants.MOUSE_RIGHT:
					this.flagTile(row, col)
					break
				case constants.MOUSE_LEFT:
					if (ctrl) { this.flagTile(row, col) }
					else { this.peekTile(row, col, true) }
					break
				case constants.MOUSE_BOTH:
				case constants.MOUSE_MIDDLE:
					if (!ctrl) { this.peekTileAdj(row, col, true) }
					break
				default: // Do Nothing
			}

			this.mouse_button = mouse_button
		}
		else if (mouse_event === constants.MOUSE_UP) {
			this.peekTileReset()

			// Note: Mouse up's event_buttons is undefined
			switch (this.mouse_button) {
				case constants.MOUSE_LEFT:
					this.handleTileLeftClick(row, col)
					break
				case constants.MOUSE_BOTH:
				case constants.MOUSE_MIDDLE:
					this.HandleTileBothClick(row, col)
					break
				default: // Do Nothing
			}

			// Reset mouse button
			this.mouse_button = 0
		}
	}

	handleGameLose = () => {
		this.tile_state = arr2D.map(this.tile_state, (arr, i, j) => {
			if (this.tile_value[i][j] === constants.BOMB_VALUE) {
				if (arr[i][j] !== constants.TILE_STATE_RED_BOMB && arr[i][j] !== constants.TILE_STATE_FLAGGED) {
					arr[i][j] = constants.TILE_STATE_CLICKED
				}
			}
			else if (arr[i][j] === constants.TILE_STATE_FLAGGED) {
				arr[i][j] = constants.TILE_STATE_NO_BOMB
			}
		})

		this.enabled = false
		this.props.notifyGameStatus(constants.GAME_STATUS_LOSE)
	}

	// Flag all bomb tiles
	handleGameWin = () => {
		this.tile_state = arr2D.map(this.tile_state, (arr, i, j) => {
			if (this.tile_value[i][j] === constants.BOMB_VALUE) {
				arr[i][j] = constants.TILE_STATE_FLAGGED
			}
		})

		this.enabled = false
		this.props.notifyGameStatus(constants.GAME_STATUS_WIN)
	}

	render() {
		return (
			<table id='board'>
				<tbody>
					{
						this.tile_value.map((arr, row) => {
							return (
								<tr key={row}>
									{arr.map((_, col) => {
										return (
											<Tile
												key={col + '_' + row}
												peek={this.peek_state[row][col]}
												tile_value={this.tile_value[row][col]}
												tile_state={this.tile_state[row][col]}
												notifyMouseEvent={this.enabled ? this.handleTileMouseEvent : null}
												notifyTouchEvent={this.enabled ? this.handleTileTouchEvent : null}
												notifyLongTouchEvent={this.enabled ? this.handleTileLongTouchEvent : null}
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
}