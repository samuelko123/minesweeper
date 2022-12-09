import { createSlice } from '@reduxjs/toolkit'

const INIT_STATE = {
	startTimestamp: null,
	elapsedTimeMS: 0,
}

const stopWatchSlice = createSlice({
	name: 'stopWatch',
	initialState: INIT_STATE,
	reducers: {
		start: (state) => {
			state.startTimestamp = Date.now()
		},
		update: (state) => {
			state.elapsedTimeMS = Date.now() - state.startTimestamp
		},
		reset: () => INIT_STATE,
	},
})

export const {
	start,
	update,
	reset,
} = stopWatchSlice.actions

export const stopWatchReducer = stopWatchSlice.reducer

export const stopWatchSelector = state => state.stopWatch