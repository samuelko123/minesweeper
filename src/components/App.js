import { Box } from '@mui/material'
import React from 'react'
import {
	useDispatch,
	useSelector,
} from 'react-redux'
import {
	GAME_MODE,
	GAME_STATUS,
	initGame,
	minesweeperSelector,
	setMode,
} from '../slices/minesweeper'
import { BaseDropdown } from './atoms/Dropdowns'
import { BaseStack } from './atoms/Stack'
import {
	FaSmile,
	FaSurprise,
} from 'react-icons/fa'
import { BsFillEmojiSunglassesFill } from 'react-icons/bs'
import { ImSad2 } from 'react-icons/im'
import { Counter } from './molecules/Counter'
import { FaceButton } from './molecules/FaceButton'
import { Board } from './Board'

const KEYBOARD = Object.freeze({
	F2: 113,
})

export const App = (props) => {
	const { footer } = props

	const dispatch = useDispatch()
	const {
		settings,
		status,
		data,
	} = useSelector(minesweeperSelector)

	const timer = React.useRef()
	const [time, setTime] = React.useState(0)

	React.useEffect(() => {
		if (status === GAME_STATUS.PLAYING) {
			timer.current = setInterval(() => setTime(time + 1), 1000)
		} else {
			clearInterval(timer.current)
			setTime(0)
		}

		return () => clearInterval(timer.current)
	}, [status, time])

	const startNewGame = () => {
		clearInterval(timer.current)
		setTime(0)
		dispatch(initGame(settings))
	}

	const handleKeyDown = (e) => {
		if (e.keyCode === KEYBOARD.F2) {
			startNewGame()
		}
	}

	const handleSmileyClick = () => {
		startNewGame()
	}

	const handleDropdownChange = (mode) => {
		dispatch(setMode({ mode }))
	}

	return (
		<BaseStack
			className='noselect'
			gap={2}
			onKeyDown={handleKeyDown}
			sx={{
				alignItems: 'flex-start',
			}}
		>
			<BaseDropdown
				label='mode'
				value={settings.mode}
				options={[
					{
						value: GAME_MODE.EASY,
						label: 'Easy',
					},
					{
						value: GAME_MODE.MEDIUM,
						label: 'Medium',
					},
					{
						value: GAME_MODE.HARD,
						label: 'Hard',
					},
				]}
				onChange={handleDropdownChange}
				tabIndex={0}
				inputProps={{
					fullWidth: false,
				}}
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
					<Counter value={settings.mineCount - data.flagCount} />
					<FaceButton
						onClick={handleSmileyClick}
						status={status}
					>
						{
							data.peeking ? <FaSurprise /> : (
								<>
									{status === GAME_STATUS.READY && <FaSmile />}
									{status === GAME_STATUS.PLAYING && <FaSmile />}
									{status === GAME_STATUS.WIN && <BsFillEmojiSunglassesFill />}
									{status === GAME_STATUS.LOSE && <ImSad2 />}
								</>
							)
						}
					</FaceButton>
					<Counter value={time} />
				</Box>
				<Board />
			</Box>
			{footer}
		</BaseStack>
	)
}