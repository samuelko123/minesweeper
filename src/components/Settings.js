import React from 'react'
import {
	Button,
	DialogContentText,
	Menu,
	Stack,
} from '@mui/material'
import {
	HexColorInput,
	HexColorPicker,
} from 'react-colorful'
import {
	useDispatch,
	useSelector,
} from 'react-redux'
import {
	reset as resetSettings,
	setCellBackgroundColor,
	setCellSize,
	settingsSelector,
} from '../slices/settings'
import { BaseMenuItem } from './atoms/MenuItem'
import {
	MdArrowBackIos,
	MdArrowForwardIos,
	MdClose,
} from 'react-icons/md'
import { BaseDialog } from './molecules/Dialogs'

const CURRENT_MENU = {
	MAIN: 'main',
	CLOSE: 'close',
	COLOR: 'color',
	SIZE: 'size',
	RESET: 'reset',
}

export const Settings = (props) => {
	const {
		open,
		onClose: handleClose,
		anchorEl,
	} = props

	const dispatch = useDispatch()
	const {
		cellSize,
		cell,
	} = useSelector(settingsSelector)

	const [showDialog, setShowDialog] = React.useState(false)
	const [currentMenu, setCurrentMenu] = React.useState(CURRENT_MENU.MAIN)

	return (
		<>
			<Menu
				open={open}
				onClose={handleClose}
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				PaperProps={{
					elevation: 2,
				}}
				disableScrollLock={true}
				MenuListProps={{
					disablePadding: true,
				}}
			>
				{currentMenu === CURRENT_MENU.MAIN &&
					[
						<BaseMenuItem
							key={CURRENT_MENU.CLOSE}
							onClick={() => handleClose()}
							sx={{ justifyContent: 'space-between' }}
						>
							Close
							<MdClose size={24} />
						</BaseMenuItem>
						,
						<BaseMenuItem
							key={CURRENT_MENU.COLOR}
							onClick={() => setCurrentMenu(CURRENT_MENU.COLOR)}
							sx={{ justifyContent: 'space-between' }}
						>
							<span>Color</span>
							<MdArrowForwardIos size={24} />
						</BaseMenuItem>
						,
						<BaseMenuItem
							key={CURRENT_MENU.SIZE}
							onClick={() => setCurrentMenu(CURRENT_MENU.SIZE)}
							sx={{ justifyContent: 'space-between' }}
						>
							<span>Size</span>
							<MdArrowForwardIos size={24} />
						</BaseMenuItem>
						,
						<BaseMenuItem
							key={CURRENT_MENU.RESET}
							onClick={() => setShowDialog(true)}
							sx={{
								justifyContent: 'space-between',
								color: 'red',
							}}
						>
							<span>Reset to defaults</span>
						</BaseMenuItem>,
					]
				}
				{currentMenu === CURRENT_MENU.COLOR &&
					[
						<BaseMenuItem
							key={CURRENT_MENU.MAIN}
							onClick={() => setCurrentMenu(CURRENT_MENU.MAIN)}
						>
							<MdArrowBackIos size={24} />
							Color
						</BaseMenuItem>
						,
						<Stack
							key={CURRENT_MENU.COLOR}
							gap={2}
							padding={2}
						>
							<HexColorPicker color={cell.color.background} onChange={(val) => dispatch(setCellBackgroundColor({ color: val }))} />
							<HexColorInput color={cell.color.background} onChange={(val) => dispatch(setCellBackgroundColor({ color: val }))} />
						</Stack>
						,
					]
				}
				{currentMenu === CURRENT_MENU.SIZE &&
					[
						<BaseMenuItem
							key={CURRENT_MENU.MAIN}
							onClick={() => setCurrentMenu(CURRENT_MENU.MAIN)}
						>
							<MdArrowBackIos size={24} />
							Size
						</BaseMenuItem>
						,
						...Array(21).fill(null).map((_, index) => (
							<BaseMenuItem
								key={index}
								onClick={() => dispatch(setCellSize({ size: index + 20 }))}
								selected={cellSize === index + 20}
							>
								{index + 20}
							</BaseMenuItem>
						))
						,
					]
				}
			</Menu>
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