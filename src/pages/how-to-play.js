import React from 'react'
import {
	Box,
	List,
	ListSubheader,
	Stack,
} from '@mui/material'

import { BaseHeader } from '../components/atoms/Header'
import { BackButton } from '../components/molecules/BackButton'
import { BaseListItem } from '../components/atoms/ListItem'
import { BaseSurface } from '../components/atoms/Surface'
import { BaseListItemText } from '../components/atoms/ListItemText'

export default function Page() {
	return (
		<Stack gap={2}>
			<BackButton href='/' />
			<Box>
				<BaseHeader>
					Game Rules
				</BaseHeader>
				<List>
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
				</List>
			</Box>
			<Box>
				<BaseHeader>
					Controls
				</BaseHeader>
				<ListSubheader>
					Keyboard
				</ListSubheader>
				<BaseSurface>
					<List>
						<BaseListItem>
							<BaseListItemText>F2</BaseListItemText>
							<BaseListItemText>Start a new game</BaseListItemText>
						</BaseListItem>
					</List>
				</BaseSurface>
				<ListSubheader>
					Mouse
				</ListSubheader>
				<BaseSurface>
					<List>
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
					</List>
				</BaseSurface>
				<ListSubheader>
					Mobile
				</ListSubheader>
				<BaseSurface>
					<List>
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
					</List>
				</BaseSurface>
			</Box>
		</Stack>
	)
}