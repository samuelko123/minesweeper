import { createSlice } from '@reduxjs/toolkit'

const INIT_STATE = {
	cellSize: 30,
	flagMode: false,
	cell: {
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
			state.cellSize = payload.size
		},
		toggleFlagMode: (state) => {
			state.flagMode = !state.flagMode
		},
		setCellBackgroundColor: (state, { payload }) => {
			state.cell.color.background = payload.color
		},
	},
})

export const {
	setCellSize,
	toggleFlagMode,
	setCellBackgroundColor,
} = settingsSlice.actions

export const settingsReducer = settingsSlice.reducer

export const settingsSelector = state => state.settings