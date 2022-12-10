import { createSlice } from '@reduxjs/toolkit'

const INIT_STATE = {
	cellSize: 30,
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
		setCellBackgroundColor: (state, { payload }) => {
			state.cell.color.background = payload.color
		},
		reset: () => INIT_STATE,
	},
})

export const {
	setCellSize,
	setCellBackgroundColor,
	reset,
} = settingsSlice.actions

export const settingsReducer = settingsSlice.reducer

export const settingsSelector = state => state.settings