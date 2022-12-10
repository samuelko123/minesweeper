import React from 'react'
import {
	Box,
	List,
	ListItemText,
	ListSubheader,
	Paper,
	Stack,
} from '@mui/material'

import { BaseHeader } from '../components/atoms/Header'
import { BackButton } from '../components/molecules/BackButton'
import { BaseListItem } from '../components/atoms/ListItem'

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
						<ListItemText>
							<a
								target='_blank'
								rel='noreferrer'
								href='https://minesweepergame.com/strategy/how-to-play-minesweeper.php'
							>
								How To Play Minesweeper
							</a>
						</ListItemText>
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
				<Paper>
					<List>
						<BaseListItem>
							<ListItemText>F2</ListItemText>
							<ListItemText>Start a new game</ListItemText>
						</BaseListItem>
					</List>
				</Paper>
				<ListSubheader>
					Mouse
				</ListSubheader>
				<Paper>
					<List>
						<BaseListItem>
							<ListItemText>Left-click</ListItemText>
							<ListItemText>Uncover</ListItemText>
						</BaseListItem>
						<BaseListItem>
							<ListItemText>Right-click</ListItemText>
							<ListItemText>Toggle flag</ListItemText>
						</BaseListItem>
						<BaseListItem>
							<ListItemText>
								<ListItemText>Both-click / Middle-click</ListItemText>
							</ListItemText>
							<ListItemText>
								<a
									target='_blank'
									rel='noreferrer'
									href='http://www.minesweeper.info/wiki/Chord'
								>
									Chord
								</a>
							</ListItemText>
						</BaseListItem>
					</List>
				</Paper>
				<ListSubheader>
					Mobile
				</ListSubheader>
				<Paper>
					<List>
						<BaseListItem>
							<ListItemText>Touch</ListItemText>
							<ListItemText>
								Uncover / Toggle flag
							</ListItemText>
						</BaseListItem>
						<BaseListItem>
							<ListItemText>Touch on a number</ListItemText>
							<ListItemText>
								<a
									target='_blank'
									rel='noreferrer'
									href='http://www.minesweeper.info/wiki/Chord'
								>
									Chord
								</a>
							</ListItemText>
						</BaseListItem>
					</List>
				</Paper>
			</Box>
		</Stack>
	)
}