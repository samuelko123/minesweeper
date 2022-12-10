import React from 'react'
import {
	Box,
	Button,
	DialogContentText,
	List,
	ListItem,
	ListItemText,
	ListSubheader,
	Paper,
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
import { CELL_STATE } from '../slices/minesweeper'
import { BaseDialog } from '../components/molecules/Dialogs'

export default function Page() {
	const dispatch = useDispatch()
	const {
		cellSize,
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
					<ListSubheader>
						Appearance
					</ListSubheader>
					<Paper>
						<List>
							<ListItem>
								<ListItemText>Cell Size</ListItemText>
								<Box sx={{ flex: 1 }}>
									<BaseDropdown
										value={cellSize}
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
									<Tile
										component='span'
										cell={{ state: CELL_STATE.HIDDEN }}
										width={cellSize}
										height={cellSize}
									/>
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
						</List>
					</Paper>
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