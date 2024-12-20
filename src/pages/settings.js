import React from 'react'
import {
	Box,
	Button,
	DialogContentText,
	Grid,
	ListItem,
	ListItemText,
	Stack,
} from '@mui/material'
import {
	HexColorInput,
	HexColorPicker,
} from 'react-colorful'

import { BackButton } from '../components/molecules/BackButton'
import { BaseHeader } from '../components/atoms/Header'
import { BaseDropdown } from '../components/atoms/Dropdowns'

import {
	reset as resetSettings,
	setCellBackgroundColor,
	setCellSize,
	settingsSelector,
} from '../slices/settings'
import {
	useDispatch,
	useSelector,
} from 'react-redux'
import { Tile } from '../components/minesweeper/Tile'
import {
	CELL_STATE,
	CELL_VALUE,
} from '../slices/minesweeper'
import { BaseDialog } from '../components/molecules/Dialogs'
import { BaseList } from '../components/atoms/List'

export default function Page() {
	const dispatch = useDispatch()
	const {
		cell,
	} = useSelector(settingsSelector)

	const [showDialog, setShowDialog] = React.useState(false)

	return (
		<>
			<Stack gap={2}>
				<BackButton href='/' />
				<Box>
					<BaseHeader>
						Settings
					</BaseHeader>
					<BaseList title='Appearance'>
						<ListItem>
							<ListItemText>Cell Size</ListItemText>
							<Box sx={{ flex: 1 }}>
								<BaseDropdown
									value={cell.size}
									options={Array(21).fill(null).map((_, index) => ({
										value: index + 20,
										label: index + 20,
									}))}
									onChange={(val) => dispatch(setCellSize({ size: val }))}
								/>
							</Box>
						</ListItem>
						<ListItem>
							<ListItemText>Cell Color</ListItemText>
							<Stack
								gap={2}
								sx={{
									flex: 1,
									alignItems: 'flex-start',
								}}
							>
								<Grid container spacing={cell.size / 20}>
									{[
										{ state: CELL_STATE.HIDDEN },
										{ state: CELL_STATE.FLAGGED },
										{
											state: CELL_STATE.REVEALED,
											value: CELL_VALUE.EMPTY,
										},
										{
											state: CELL_STATE.REVEALED,
											value: 1,
										},
										{
											state: CELL_STATE.REVEALED,
											value: 2,
										},
										{
											state: CELL_STATE.REVEALED,
											value: 3,
										},
										{
											state: CELL_STATE.REVEALED,
											value: 4,
										},
										{
											state: CELL_STATE.REVEALED,
											value: 5,
										},
										{
											state: CELL_STATE.REVEALED,
											value: 6,
										},
										{
											state: CELL_STATE.REVEALED,
											value: 7,
										},
										{
											state: CELL_STATE.REVEALED,
											value: 8,
										},
										{
											state: CELL_STATE.REVEALED,
											value: CELL_VALUE.MINED,
										},
										{ state: CELL_STATE.WRONG },
										{ state: CELL_STATE.EXPLODED },
									].map((cell, index) => (
										<Grid item key={index}>
											<Tile
												component='span'
												cell={cell}
												width={cell.size}
												height={cell.size}
											/>
										</Grid>
									))}
								</Grid>
								<HexColorPicker color={cell.color.background} onChange={(val) => dispatch(setCellBackgroundColor({ color: val }))} />
								<HexColorInput color={cell.color.background} onChange={(val) => dispatch(setCellBackgroundColor({ color: val }))} />
							</Stack>
						</ListItem>
						<ListItem>
							<ListItemText>Reset to defaults</ListItemText>
							<Box sx={{ flex: 1 }}>
								<Button
									variant='outlined'
									size='small'
									color='error'
									onClick={() => setShowDialog(true)}
								>
									Reset
								</Button>
							</Box>
						</ListItem>
					</BaseList>
				</Box>
			</Stack>
			<BaseDialog
				open={showDialog}
				onClose={() => setShowDialog(false)}
				title='Reset to defaults'
				showCancelButton={true}
				actionButton={
					<Button
						color='error'
						variant='contained'
						onClick={() => {
							dispatch(resetSettings())
							setShowDialog(false)
						}}
					>
						Reset
					</Button>
				}
			>
				<DialogContentText>
					Are you sure?
				</DialogContentText>
			</BaseDialog>
		</>
	)
}
