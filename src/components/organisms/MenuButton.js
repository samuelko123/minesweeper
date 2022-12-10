import React from 'react'
import { useRouter } from 'next/router'
import {
	Button,
	Menu,
	MenuItem,
} from '@mui/material'
import { BaseLink } from '../atoms/Links'
import { MdMenu } from 'react-icons/md'

export const MenuButton = (props) => {
	const {
		size,
		items,
	} = props

	const router = useRouter()

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
				<MdMenu
					color='inherit'
					size={size}
				/>
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
				{
					items.map(item => (
						<BaseLink
							key={item.title}
							href={item.href}
						>
							<MenuItem
								onClick={handleClose}
								selected={router.pathname === item.href}
							>
								{item.icon}
								{item.title}
							</MenuItem>
						</BaseLink>
					))
				}
			</Menu>
		</>
	)
}