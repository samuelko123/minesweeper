import React from 'react'
import {
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
	setCellBackgroundColor,
	setCellSize,
	settingsSelector,
} from '../slices/settings'
import { BaseMenuItem } from './atoms/MenuItem'
import {
	MdArrowBackIos,
	MdArrowForwardIos,
} from 'react-icons/md'

const CURRENT_MENU = {
	MAIN: 'main',
	COLOR: 'color',
	SIZE: 'size',
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

	const [currentMenu, setCurrentMenu] = React.useState(CURRENT_MENU.MAIN)

	return (
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
	)
}