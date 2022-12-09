import React from 'react'
import {
	CELL_STATE,
	CELL_VALUE,
} from '../../slices/minesweeper'
import Zero from '../../images/0.svg'
import One from '../../images/1.svg'
import Two from '../../images/2.svg'
import Three from '../../images/3.svg'
import Four from '../../images/4.svg'
import Five from '../../images/5.svg'
import Six from '../../images/6.svg'
import Seven from '../../images/7.svg'
import Eight from '../../images/8.svg'
import Explode from '../../images/explode.svg'
import Flag from '../../images/flag.svg'
import Hidden from '../../images/hidden.svg'
import Mine from '../../images/mine.svg'
import Wrong from '../../images/wrong.svg'
import { Box } from '@mui/material'
import { useSelector } from 'react-redux'
import { settingsSelector } from '../../slices/settings'

export const Tile = (props) => {
	const {
		cell,
		width,
		height,
	} = props

	const componentProps = {
		viewBox: '0 0 100 100',
		width: width,
		height: height,
	}

	const settings = useSelector(settingsSelector)

	let img
	switch (cell.state) {
		case CELL_STATE.HIDDEN:
			img = <Hidden {...componentProps} />
			break
		case CELL_STATE.FLAGGED:
			img = <Flag {...componentProps} />
			break
		case CELL_STATE.PEEKED:
			img = <Zero {...componentProps} />
			break
		case CELL_STATE.EXPLODED:
			img = <Explode {...componentProps} />
			break
		case CELL_STATE.WRONG:
			img = <Wrong {...componentProps} />
			break
		case CELL_STATE.REVEALED:
			switch (cell.value) {
				case CELL_VALUE.MINED:
					img = <Mine {...componentProps} />
					break
				case CELL_VALUE.EMPTY:
					img = <Zero {...componentProps} />
					break
				case 1:
					img = <One {...componentProps} />
					break
				case 2:
					img = <Two {...componentProps} />
					break
				case 3:
					img = <Three {...componentProps} />
					break
				case 4:
					img = <Four {...componentProps} />
					break
				case 5:
					img = <Five {...componentProps} />
					break
				case 6:
					img = <Six {...componentProps} />
					break
				case 7:
					img = <Seven {...componentProps} />
					break
				case 8:
					img = <Eight {...componentProps} />
					break
			}
	}

	return (
		<Box
			component='td'
			sx={{
				margin: 0,
				padding: 0,
				'& .tile-background': {
					fill: settings.cell.color.background,
				},
			}}
		>
			{img}
		</Box>
	)
}