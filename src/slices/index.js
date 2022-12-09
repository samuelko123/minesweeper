import {
	combineReducers,
	configureStore,
} from '@reduxjs/toolkit'

import { minesweeperReducer } from '../slices/minesweeper'
import { stopWatchReducer } from './stopWatch'

const rootReducer = combineReducers({
	minesweeper: minesweeperReducer,
	stopWatch: stopWatchReducer,
})

export const store = configureStore({
	reducer: rootReducer,
})