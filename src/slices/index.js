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

const persistConfig = {
	key: 'root',
	version: 1,
	storage,
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