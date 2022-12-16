import { createSlice } from '@reduxjs/toolkit'

const INIT_STATE = {
	startTimestamp: null,
	elapsedTimeMS: 0,
	prevElapsed: 0,
}

const stopWatchSlice = createSlice({
	name: 'stopWatch',
	initialState: INIT_STATE,
	reducers: {
		setStartTime: (state) => {
			state.startTimestamp = Date.now()
			state.prevElapsed = state.elapsedTimeMS
		},
		update: (state) => {
			state.elapsedTimeMS = Date.now() - state.startTimestamp + state.prevElapsed
		},
		reset: () => INIT_STATE,
	},
})

export const {
	setStartTime,
	update,
	reset,
} = stopWatchSlice.actions

export const stopWatchReducer = stopWatchSlice.reducer

export const stopWatchSelector = state => state.stopWatch