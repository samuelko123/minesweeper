import React from 'react'
import { Board } from './Board'
import { Counter } from './molecules/Counter'
import { NumericTextField } from './molecules/NumericTextField'
import { BaseDropdown } from './atoms/Dropdowns'
import { BaseStack } from './atoms/Stack'
import { FaceButton } from './molecules/FaceButton'
import { Box } from '@mui/material'
import {
	FaSmile,
	FaSurprise,
} from 'react-icons/fa'
import { BsFillEmojiSunglassesFill } from 'react-icons/bs'
import { ImSad2 } from 'react-icons/im'

const constants = require('../lib/constants')

export const App = () => {
	let restart_count = 0 // Note: change this will force restart
	let settings = {
		board_width: 30,
		board_height: 16,
		bomb_count: 99,
		mode: constants.MODE_HARD,
	}

	let timer
	const [button_status, setButtonStatus] = React.useState(constants.BUTTON_INIT)
	const [time, setTime] = React.useState(0)
	const [flag_count, setFlagCount] = React.useState(0)

	const handleKeyDown = (e) => {
		if (e.keyCode === constants.KEYBOARD_F2) { restartGame() }
	}

	const handleSmileyClick = () => {
		restartGame()
	}

	const restartGame = () => {
		// Force a restart
		clearInterval(timer)
		restart_count++

		setButtonStatus(constants.BUTTON_INIT)
		setTime(0)
		setFlagCount(0)
	}

	const handleTilePeek = (peek) => {
		const status = peek ? constants.BUTTON_PEEK : constants.BUTTON_INIT
		setButtonStatus(status)
	}

	const handleGameStatus = (status) => {
		switch (status) {
			case constants.GAME_STATUS_START:
				timer = () => setInterval(() => setTime(time + 1), 1000)
				break
			case constants.GAME_STATUS_WIN:
				clearInterval(timer)
				break
			case constants.GAME_STATUS_LOSE:
				clearInterval(timer)
				break
			default:
		}

		setButtonStatus(status)
	}

	const handleFlagChange = (flagged) => {
		flagged ? setFlagCount(flag_count + 1) : setFlagCount(flag_count - 1)
	}

	const handleDropdownChange = (mode) => {
		let width, height, bombs

		switch (mode) {
			case constants.MODE_EASY:
				width = 9; height = 9; bombs = 10
				break
			case constants.MODE_MEDIUM:
				width = 16; height = 16; bombs = 40
				break
			case constants.MODE_HARD:
				width = 30; height = 16; bombs = 99
				break
			default: // Do Nothing
		}

		settings = {
			board_width: width,
			board_height: height,
			bomb_count: bombs,
			mode: mode,
		}

		restartGame()
	}

	const handleNumberInputChange = (obj) => {
		const key = Object.keys(obj)[0]
		settings[key] = obj[key]
		settings.bomb_count = Math.min(settings.bomb_count, settings.board_width * settings.board_height - 1)
		settings.mode = constants.MODE_CUSTOM
		restartGame()
	}

	return (
		<div
			id='app'
			className='noselect'
			onKeyDown={handleKeyDown}
			tabIndex={0}
		>
			<BaseStack gap={2}>
				<BaseDropdown
					label='mode'
					value={settings.mode}
					options={[
						{
							value: 0,
							label: 'Easy',
						},
						{
							value: 1,
							label: 'Medium',
						},
						{
							value: 2,
							label: 'Hard',
						},
						{
							value: 3,
							label: 'Custom',
						},
					]}
					onChange={handleDropdownChange}
				/>

				<NumericTextField
					label='Width'
					value={settings.board_width}
					min={constants.BOARD_WIDTH_MIN}
					max={constants.BOARD_WIDTH_MAX}
					onBlur={(val) => { handleNumberInputChange({ board_width: val }) }}
				/>

				<NumericTextField
					label='Height'
					value={settings.board_height}
					min={constants.BOARD_HEIGHT_MIN}
					max={constants.BOARD_HEIGHT_MAX}
					onBlur={(val) => { handleNumberInputChange({ board_height: val }) }}
				/>

				<NumericTextField
					label='Bombs'
					value={settings.bomb_count}
					min={1}
					max={settings.board_width * settings.board_height - 1} // Allow one non-bomb tile
					onBlur={(val) => { handleNumberInputChange({ bomb_count: val }) }}
				/>

				<Box
					onContextMenu={(e) => { e.preventDefault() }}
					sx={{
						width: 'fit-content',
					}}
				>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<Counter value={settings.bomb_count - flag_count} />
						<FaceButton
							onClick={handleSmileyClick}
							status={button_status}
						>
							{button_status === constants.BUTTON_INIT && <FaSmile />}
							{button_status === constants.BUTTON_PEEK && <FaSurprise />}
							{button_status === constants.BUTTON_GAME_WIN && <BsFillEmojiSunglassesFill />}
							{button_status === constants.BUTTON_GAME_LOSE && <ImSad2 />}
						</FaceButton>
						<Counter value={time} />
					</Box>

					<Board
						key={restart_count}
						board_width={settings.board_width}
						board_height={settings.board_height}
						bomb_count={settings.bomb_count}
						notifyFlagChange={handleFlagChange}
						notifyGameStatus={handleGameStatus}
						notifyTilePeek={handleTilePeek}
					/>
				</Box>
			</BaseStack>
		</div>
	)
}
