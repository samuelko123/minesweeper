import React from 'react'
import {
	Box,
	Button,
	DialogContentText,
	List,
	ListItem,
	ListSubheader,
	Stack,
	Typography,
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

	const colWidth = 96
	const [showDialog, setShowDialog] = React.useState(false)

	return (
		<>
			<Box padding={2}>
				<BackButton href='/' />
				<BaseHeader sx={{ marginTop: 2 }}>
					Settings
				</BaseHeader>
				<List disablePadding>
					<ListSubheader>
						Appearance
					</ListSubheader>
					<ListItem sx={{ gap: 2 }}>
						<Typography sx={{ width: colWidth }}>Cell Size</Typography>
						<BaseDropdown
							value={cellSize}
							options={Array(21).fill(null).map((_, index) => ({
								value: index + 20,
								label: index + 20,
							}))}
							onChange={(val) => dispatch(setCellSize({ size: val }))}
							tabIndex={1}
						/>
					</ListItem>
					<ListItem
						sx={{
							gap: 2,
							alignItems: 'flex-start',
						}}
					>
						<Typography sx={{ width: colWidth }}>Cell Color</Typography>
						<Stack gap={1}>
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
						<Button
							variant='outlined'
							size='small'
							color='error'
							onClick={() => setShowDialog(true)}
						>
							Reset to defaults
						</Button>
					</ListItem>
				</List>
			</Box>
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