import { createSlice } from '@reduxjs/toolkit'

const INIT_STATE = {
	cell: {
		size: 30,
		color: {
			background: '#ccc',
		},
	},
}

const settingsSlice = createSlice({
	name: 'settings',
	initialState: INIT_STATE,
	reducers: {
		setCellSize: (state, { payload }) => {
			state.cell.size = payload.size
		},
		setCellBackgroundColor: (state, { payload }) => {
			state.cell.color.background = payload.color
		},
		load: (state, { payload }) => payload,
		reset: () => INIT_STATE,
	},
})

export const {
	setCellSize,
	setCellBackgroundColor,
	load,
	reset,
} = settingsSlice.actions

export const settingsReducer = settingsSlice.reducer

export const settingsSelector = state => state.settings