import { createTheme } from '@mui/material'

const surfaceColor = '#fff'

export const theme = createTheme({
	typography: {
		link: {
			color: (theme) => theme.palette.primary.main,
			textDecoration: 'underline',
		},
	},
	palette: {
		primary: {
			main: '#005aaa',
		},
		background: {
			default: '#eee',
		},
		surface: {
			default: surfaceColor,
		},
	},
	components: {
		MuiList: {
			defaultProps: {
				disablePadding: true,
			},
		},
		MuiListSubheader: {
			styleOverrides: {
				root: {
					backgroundColor: 'inherit',
				},
			},
		},
		MuiListItem: {
			defaultProps: {
				divider: true,
			},
			styleOverrides: {
				root: {
					gap: 1,
					alignItems: 'flex-start',
				},
			},
		},
		MuiListItemText: {
			styleOverrides: {
				root: {
					flex: 1,
				},
			},
		},
		MuiPaper: {
			defaultProps: {
				elevation: 0,
			},
			styleOverrides: {
				root: {
					backgroundColor: surfaceColor,
				},
			},
		},
	},
})