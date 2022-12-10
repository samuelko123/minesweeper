import React from 'react'
import {
	Box,
	ListSubheader,
	Stack,
} from '@mui/material'

import { BaseHeader } from '../components/atoms/Header'
import { BackButton } from '../components/molecules/BackButton'
import { BaseListItem } from '../components/atoms/ListItem'
import { BaseSurface } from '../components/atoms/Surface'
import { BaseList } from '../components/atoms/List'
import { BaseListItemText } from '../components/atoms/ListItemText'

export default function Page() {
	return (
		<Stack gap={2}>
			<BackButton href='/' />
			<Box>
				<BaseHeader>
					Game Rules
				</BaseHeader>
				<BaseList>
					<BaseListItem divider={false}>
						<BaseListItemText>
							<a
								target='_blank'
								rel='noreferrer'
								href='https://minesweepergame.com/strategy/how-to-play-minesweeper.php'
							>
								How To Play Minesweeper
							</a>
						</BaseListItemText>
					</BaseListItem>
				</BaseList>
			</Box>
			<Box>
				<BaseHeader>
					Controls
				</BaseHeader>
				<ListSubheader>
					Keyboard
				</ListSubheader>
				<BaseSurface>
					<BaseList>
						<BaseListItem>
							<BaseListItemText>F2</BaseListItemText>
							<BaseListItemText>Start a new game</BaseListItemText>
						</BaseListItem>
					</BaseList>
				</BaseSurface>
				<ListSubheader>
					Mouse
				</ListSubheader>
				<BaseSurface>
					<BaseList>
						<BaseListItem>
							<BaseListItemText>Left-click</BaseListItemText>
							<BaseListItemText>Uncover</BaseListItemText>
						</BaseListItem>
						<BaseListItem>
							<BaseListItemText>Right-click</BaseListItemText>
							<BaseListItemText>Toggle flag</BaseListItemText>
						</BaseListItem>
						<BaseListItem>
							<BaseListItemText>
								<BaseListItemText>Both-click / Middle-click</BaseListItemText>
							</BaseListItemText>
							<BaseListItemText>
								<a
									target='_blank'
									rel='noreferrer'
									href='http://www.minesweeper.info/wiki/Chord'
								>
									Chord
								</a>
							</BaseListItemText>
						</BaseListItem>
					</BaseList>
				</BaseSurface>
				<ListSubheader>
					Mobile
				</ListSubheader>
				<BaseSurface>
					<BaseList>
						<BaseListItem>
							<BaseListItemText>Touch</BaseListItemText>
							<BaseListItemText>
								Uncover / Toggle flag
							</BaseListItemText>
						</BaseListItem>
						<BaseListItem>
							<BaseListItemText>Touch on a number</BaseListItemText>
							<BaseListItemText>
								<a
									target='_blank'
									rel='noreferrer'
									href='http://www.minesweeper.info/wiki/Chord'
								>
									Chord
								</a>
							</BaseListItemText>
						</BaseListItem>
					</BaseList>
				</BaseSurface>
			</Box>
		</Stack>
	)
}