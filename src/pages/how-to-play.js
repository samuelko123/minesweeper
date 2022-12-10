import React from 'react'
import {
	Box,
	List,
	ListItem,
	ListItemText,
	ListSubheader,
	Paper,
	Stack,
} from '@mui/material'

import { BaseHeader } from '../components/atoms/Header'
import { BackButton } from '../components/molecules/BackButton'

export default function Page() {
	return (
		<Stack gap={2}>
			<BackButton href='/' />
			<Box>
				<BaseHeader>
					Game Rules
				</BaseHeader>
				<List>
					<ListItem divider={false}>
						<ListItemText>
							<a
								target='_blank'
								rel='noreferrer'
								href='https://minesweepergame.com/strategy/how-to-play-minesweeper.php'
							>
								How To Play Minesweeper
							</a>
						</ListItemText>
					</ListItem>
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
						<ListItem>
							<ListItemText>F2</ListItemText>
							<ListItemText>Start a new game</ListItemText>
						</ListItem>
					</List>
				</Paper>
				<ListSubheader>
					Mouse
				</ListSubheader>
				<Paper>
					<List>
						<ListItem>
							<ListItemText>Left-click</ListItemText>
							<ListItemText>Uncover</ListItemText>
						</ListItem>
						<ListItem>
							<ListItemText>Right-click</ListItemText>
							<ListItemText>Toggle flag</ListItemText>
						</ListItem>
						<ListItem>
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
						</ListItem>
					</List>
				</Paper>
				<ListSubheader>
					Mobile
				</ListSubheader>
				<Paper>
					<List>
						<ListItem>
							<ListItemText>Touch</ListItemText>
							<ListItemText>
								Uncover / Toggle flag
							</ListItemText>
						</ListItem>
						<ListItem>
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
						</ListItem>
					</List>
				</Paper>
			</Box>
		</Stack>
	)
}