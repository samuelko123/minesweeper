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
} from '../../slices/minesweeper'
import { BaseDropdown } from '../atoms/Dropdowns'
import { BaseStack } from '../atoms/Stack'
import { Counter } from './Counter'
import { EmojiButton } from './EmojiButton'
import { Board } from './Board'
import { BorderedBox } from '../molecules/BorderedBox'
import { BaseSwitch } from '../atoms/Switch'
import {
	reset as resetStopWatch,
	start as startStopWatch,
	stopWatchSelector,
	update as updateStopWatch,
} from '../../slices/stopWatch'

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
	const {
		elapsedTimeMS,
	} = useSelector(stopWatchSelector)

	const timer = React.useRef()
	const [size, setSize] = React.useState(30)
	const [flagMode, setFlagMode] = React.useState(false)

	React.useEffect(() => {
		if (status === GAME_STATUS.PLAYING) {
			dispatch(startStopWatch())
			timer.current = setInterval(() => dispatch(updateStopWatch()), 100)
		} else if (status === GAME_STATUS.READY) {
			dispatch(resetStopWatch())
		} else {
			clearInterval(timer.current)
		}

		return () => clearInterval(timer.current)
	}, [status, dispatch])

	const startNewGame = () => {
		clearInterval(timer.current)
		dispatch(resetStopWatch())
		dispatch(initGame(settings))
	}

	const handleKeyDown = (e) => {
		if (e.keyCode === KEYBOARD.F2) {
			startNewGame()
		}
	}

	const handleFaceClick = () => {
		startNewGame()
	}

	const handleModeChange = (mode) => {
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
			<BaseStack
				flexDirection='row'
				gap={2}
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
					onChange={handleModeChange}
					tabIndex={0}
				/>
				<BaseDropdown
					label='size'
					value={size}
					options={Array(21).fill(null).map((_, index) => ({
						value: index + 20,
						label: index + 20,
					}))}
					onChange={setSize}
					tabIndex={1}
				/>
				<BaseSwitch
					label='flag'
					checked={flagMode}
					onChange={() => setFlagMode(!flagMode)}
				/>
			</BaseStack>
			<BorderedBox
				borderWidth={6}
				raised={true}
			>
				<BaseStack
					onContextMenu={(e) => { e.preventDefault() }}
					gap={2}
					sx={{
						padding: 1.5,
						backgroundColor: '#ccc',
					}}
				>
					<BorderedBox
						borderWidth={6}
						sunken={true}
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							padding: size >= 22 ? 1 : 0,
						}}
					>
						<BorderedBox
							borderWidth={2}
							sunken={true}
						>
							<Counter value={settings.mineCount - data.flagCount} />
						</BorderedBox>
						<EmojiButton
							onClick={handleFaceClick}
							status={status}
							label='Start New Game'
						>
							{
								data.peeking ? <span>😮</span> : (
									<>
										{status === GAME_STATUS.READY && <span>🙂</span>}
										{status === GAME_STATUS.PLAYING && <span>🙂</span>}
										{status === GAME_STATUS.WIN && <span>😎</span>}
										{status === GAME_STATUS.LOSE && <span>🙁</span>}
									</>
								)
							}
						</EmojiButton>
						<BorderedBox
							borderWidth={2}
							sunken={true}
						>
							<Counter value={Math.floor(elapsedTimeMS / 1000)} />
						</BorderedBox>
					</BorderedBox>
					<BorderedBox
						borderWidth={6}
						sunken={true}
					>
						<Board
							tileSize={size}
							flagMode={flagMode}
						/>
					</BorderedBox>
				</BaseStack>
			</BorderedBox>
			{footer}
		</BaseStack>
	)
}