import React from 'react'
import {
	useDispatch,
	useSelector,
} from 'react-redux'
import { primaryInput } from 'detect-it'
import {
	GAME_MODE,
	GAME_STATUS,
	initGame,
	minesweeperSelector,
	setMode,
} from '../../slices/minesweeper'
import { BaseDropdown } from '../atoms/Dropdowns'
import { Counter } from './Counter'
import { EmojiButton } from './EmojiButton'
import { Board } from './Board'
import { BorderedBox } from '../molecules/BorderedBox'
import {
	reset as resetStopWatch,
	setStartTime,
	stopWatchSelector,
	update as updateStopWatch,
} from '../../slices/stopWatch'
import { settingsSelector } from '../../slices/settings'
import { Stack } from '@mui/material'
import { FlagButton } from '../molecules/FlagButton'
import { TfiFlag } from 'react-icons/tfi'
import { useAnimationFrame } from '../../hooks/useAnimationFrame'

const KEYBOARD = Object.freeze({
	F2: 113,
})

export const App = () => {
	const dispatch = useDispatch()
	const {
		settings,
		status,
		data,
	} = useSelector(minesweeperSelector)
	const {
		elapsedTimeMS,
	} = useSelector(stopWatchSelector)
	const {
		cell,
	} = useSelector(settingsSelector)

	const [flagMode, setFlagMode] = React.useState(false)
	const {
		start: startStopWatch,
		stop: stopStopWatch,
	} = useAnimationFrame(1000, () => dispatch(updateStopWatch()))

	React.useEffect(() => {
		if (status === GAME_STATUS.PLAYING) {
			dispatch(setStartTime())
			startStopWatch()
		} else if (status === GAME_STATUS.READY) {
			dispatch(resetStopWatch())
		} else {
			stopStopWatch()
		}

		return () => stopStopWatch()
	}, [status, dispatch, startStopWatch, stopStopWatch])

	const startNewGame = () => {
		stopStopWatch()
		dispatch(resetStopWatch())
		dispatch(initGame(settings))
		setFlagMode(false)
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
		<Stack
			className='noselect'
			gap={2}
			onKeyDown={handleKeyDown}
			sx={{
				alignItems: 'flex-start',
			}}
		>
			<Stack
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
				{primaryInput === 'touch' &&
					<FlagButton
						selected={flagMode}
						onClick={() => {
							status === GAME_STATUS.WIN || status === GAME_STATUS.LOSE ?
								startNewGame()
								:
								setFlagMode(!flagMode)
						}}
						sx={{
							position: 'fixed',
							right: 0,
							bottom: 0,
							zIndex: 999,
							opacity: 0.75,
							fontSize: 20,
						}}
					>
						{status === GAME_STATUS.WIN || status === GAME_STATUS.LOSE ?
							<span>🙂</span>
							:
							<TfiFlag
								color='inherit'
								size={30}
							/>
						}
					</FlagButton>
				}
			</Stack>
			<BorderedBox
				borderWidth={6}
				raised={true}
			>
				<Stack
					onContextMenu={(e) => { e.preventDefault() }}
					gap={2}
					sx={{
						padding: 1.5,
						backgroundColor: cell.color.background,
					}}
				>
					<BorderedBox
						borderWidth={6}
						sunken={true}
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							padding: cell.size >= 22 ? 1 : 0,
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
							<Counter value={Math.round(elapsedTimeMS / 1000)} />
						</BorderedBox>
					</BorderedBox>
					<BorderedBox
						borderWidth={6}
						sunken={true}
					>
						<Board
							tileSize={cell.size}
							flagMode={flagMode}
						/>
					</BorderedBox>
				</Stack>
			</BorderedBox>
		</Stack>
	)
}