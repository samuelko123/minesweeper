import {
	combineReducers,
	configureStore,
} from '@reduxjs/toolkit'

import {
	FLUSH,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
	REHYDRATE,
	createMigrate,
	persistReducer,
	persistStore,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { minesweeperReducer } from '../slices/minesweeper'
import { settingsReducer } from './settings'
import { stopWatchReducer } from './stopWatch'

const rootReducer = combineReducers({
	minesweeper: minesweeperReducer,
	stopWatch: stopWatchReducer,
	settings: settingsReducer,
})

const migrations = {
	2: (state) => {
		state.settings.cell.size = state.settings.cellSize
		delete state.settings.cellSize
		return state
	},
}

const persistConfig = {
	key: 'root',
	version: 2,
	storage,
	migrate: createMigrate(migrations, { debug: true }),
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({
		serializableCheck: {
			ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
		},
	}),
})

export const persistor = persistStore(store)