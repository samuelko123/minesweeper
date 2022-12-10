import React from 'react'
import {
	Button,
	Menu,
} from '@mui/material'
import { BaseMenuItem } from '../atoms/MenuItem'
import { BaseLink } from '../atoms/Links'
import {
	MdHome,
	MdMenu,
	MdOutlineHelp,
	MdSettings,
} from 'react-icons/md'

export const MainMenu = (props) => {
	const { buttonSize } = props

	const [open, setOpen] = React.useState(false)
	const [anchorEl, setAnchorEl] = React.useState(null)

	const handleClose = () => setOpen(false)

	return (
		<>
			<Button
				color='inherit'
				sx={{
					padding: 0,
					minWidth: 0,
				}}
				onClick={(e) => {
					setAnchorEl(e.currentTarget)
					setOpen(true)
				}}
			>
				<MdMenu size={buttonSize} />
			</Button>
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
				<BaseLink href='/'>
					<BaseMenuItem
						onClick={handleClose}
						startIcon={<MdHome />}
					>
						Home
					</BaseMenuItem>
				</BaseLink>
				<BaseLink href='/settings'>
					<BaseMenuItem
						onClick={handleClose}
						startIcon={<MdSettings />}
					>
						Settings
					</BaseMenuItem>
				</BaseLink>
				<BaseLink href='/how-to-play'>
					<BaseMenuItem
						onClick={handleClose}
						startIcon={<MdOutlineHelp />}
					>
						How To Play
					</BaseMenuItem>
				</BaseLink>
			</Menu>
		</>
	)
}