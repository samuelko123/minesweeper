import React from 'react'
import {
	Box,
	List,
	ListItem,
	ListItemText,
	Stack,
	Typography,
} from '@mui/material'

import { BaseHeader } from '../components/atoms/Header'
import { BackButton } from '../components/molecules/BackButton'
import { BaseList } from '../components/atoms/List'
import { ExternalLink } from '../components/atoms/Links'
import { FlagButton } from '../components/molecules/FlagButton'
import { TfiFlag } from 'react-icons/tfi'

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
							<ExternalLink href='https://minesweepergame.com/strategy/how-to-play-minesweeper.php'>
								How To Play Minesweeper
							</ExternalLink>
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
							<ListItemText>
								Uncover
							</ListItemText>
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
								<ExternalLink href='http://www.minesweeper.info/wiki/Chord'>
									Chord
								</ExternalLink>
							</ListItemText>
						</ListItem>
					</BaseList>
					<BaseList title='Mobile'>
						<ListItem>
							<ListItemText>
								<FlagButton selected={false} sx={{ cursor: 'default' }}>
									<TfiFlag color='inherit' />
								</FlagButton>
								<Typography component='span'> + Touch</Typography>
							</ListItemText>
							<ListItemText>
								Uncover
							</ListItemText>
						</ListItem>
						<ListItem>
							<ListItemText>
								<FlagButton selected={true} sx={{ cursor: 'default' }}>
									<TfiFlag color='inherit' />
								</FlagButton>
								<Typography component='span'> + Touch</Typography>
							</ListItemText>
							<ListItemText>
								Toggle flag
							</ListItemText>
						</ListItem>
						<ListItem>
							<ListItemText>Touch on a number</ListItemText>
							<ListItemText>
								<ExternalLink href='http://www.minesweeper.info/wiki/Chord'>
									Chord
								</ExternalLink>
							</ListItemText>
						</ListItem>
					</BaseList>
				</Stack>
			</Box>
		</Stack>
	)
}