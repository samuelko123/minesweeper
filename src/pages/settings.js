import React from 'react'
import {
	Box,
	Button,
	DialogContentText,
	ListSubheader,
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
import { BaseList } from '../components/atoms/List'
import { BaseSurface } from '../components/atoms/Surface'
import { BaseListItem } from '../components/atoms/ListItem'
import { BaseListItemText } from '../components/atoms/ListItemText'

export default function Page() {
	const dispatch = useDispatch()
	const {
		cellSize,
		cell,
	} = useSelector(settingsSelector)

	const [showDialog, setShowDialog] = React.useState(false)

	return (
		<>
			<Stack
				padding={2}
				gap={2}
			>
				<BackButton href='/' />
				<Box>
					<BaseHeader>
						Settings
					</BaseHeader>
					<ListSubheader>
						Appearance
					</ListSubheader>
					<BaseSurface>
						<BaseList>
							<BaseListItem>
								<BaseListItemText>Cell Size</BaseListItemText>
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
							</BaseListItem>
							<BaseListItem>
								<BaseListItemText>Cell Color</BaseListItemText>
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
							</BaseListItem>
							<BaseListItem>
								<BaseListItemText>Reset to defaults</BaseListItemText>
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
							</BaseListItem>
						</BaseList>
					</BaseSurface>
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