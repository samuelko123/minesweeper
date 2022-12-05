import {
	combineReducers,
	configureStore,
} from '@reduxjs/toolkit'

import { minesweeperReducer } from '../slices/minesweeper'

const rootReducer = combineReducers({
	minesweeper: minesweeperReducer,
})

export const store = configureStore({
	reducer: rootReducer,
})