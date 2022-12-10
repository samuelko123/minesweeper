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
}

export const Settings = (props) => {
	const {
		open,
		onClose,
		anchorEl,
	} = props

	const dispatch = useDispatch()
	const {
		cell,
	} = useSelector(settingsSelector)

	const [currentMenu, setCurrentMenu] = React.useState(CURRENT_MENU.MAIN)

	return (
		<Menu
			open={open}
			onClose={onClose}
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
				<BaseMenuItem onClick={() => setCurrentMenu(CURRENT_MENU.COLOR)}>
					Color
					<MdArrowForwardIos size={24} />
				</BaseMenuItem>
			}
			{currentMenu === CURRENT_MENU.COLOR &&
				<>
					<BaseMenuItem onClick={() => setCurrentMenu(CURRENT_MENU.MAIN)}>
						<MdArrowBackIos size={24} />
						Color
					</BaseMenuItem>
					<Stack
						gap={2}
						padding={2}
					>
						<HexColorPicker color={cell.color.background} onChange={(val) => dispatch(setCellBackgroundColor({ color: val }))} />
						<HexColorInput color={cell.color.background} onChange={(val) => dispatch(setCellBackgroundColor({ color: val }))} />
					</Stack>
				</>
			}
		</Menu>
	)
}