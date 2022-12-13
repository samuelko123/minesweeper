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
import { Counter } from './Counter'
import { EmojiButton } from './EmojiButton'
import { Board } from './Board'
import { BorderedBox } from '../molecules/BorderedBox'
import {
	reset as resetStopWatch,
	start as startStopWatch,
	stopWatchSelector,
	update as updateStopWatch,
} from '../../slices/stopWatch'
import { settingsSelector } from '../../slices/settings'
import {
	Stack,
	ToggleButton,
	Tooltip,
} from '@mui/material'
import { TfiFlag } from 'react-icons/tfi'

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

	const timer = React.useRef()
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
				<Tooltip
					title='Flag mode'
					placement='top'
				>
					<ToggleButton
						value='flag'
						selected={flagMode}
						onClick={() => setFlagMode(!flagMode)}
						sx={{
							position: 'fixed',
							right: 20,
							bottom: 20,
							zIndex: 999,
							opacity: 0.5,
							color: theme => theme.palette.primary.main,
							backgroundColor: theme => theme.palette.surface.default,
							':hover': {
								opacity: 1,
								color: theme => theme.palette.primary.main,
								backgroundColor: theme => theme.palette.surface.default,
							},
							'&.Mui-selected': {
								color: theme => theme.palette.surface.default,
								backgroundColor: theme => theme.palette.primary.main,
							},
							'&.Mui-selected:hover': {
								opacity: 1,
								color: theme => theme.palette.surface.default,
								backgroundColor: theme => theme.palette.primary.main,
							},
						}}
					>
						<TfiFlag
							color='inherit'
							size={20}
						/>
					</ToggleButton>
				</Tooltip>
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
							<Counter value={Math.floor(elapsedTimeMS / 1000)} />
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