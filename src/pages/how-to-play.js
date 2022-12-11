import React from 'react'
import {
	Box,
	List,
	ListItem,
	ListItemText,
	Stack,
} from '@mui/material'

import { BaseHeader } from '../components/atoms/Header'
import { BackButton } from '../components/molecules/BackButton'
import { BaseList } from '../components/atoms/List'

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
				<Stack gap={2}>
					<BaseList title='Keyboard'>
						<ListItem>
							<ListItemText>F2</ListItemText>
							<ListItemText>Start a new game</ListItemText>
						</ListItem>
					</BaseList>
					<BaseList title='Mouse'>
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
					</BaseList>
					<BaseList title='Mobile'>
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
					</BaseList>
				</Stack>
			</Box>
		</Stack>
	)
}