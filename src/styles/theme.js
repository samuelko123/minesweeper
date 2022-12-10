import { createTheme } from '@mui/material'

const surfaceColor = '#fff'

const defaultTheme = createTheme()

export const theme = createTheme(defaultTheme, {
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
		MuiMenuItem: {
			defaultProps: {
				divider: true,
			},
			styleOverrides: {
				root: {
					display: 'flex',
					flexDirection: 'row',
					gap: defaultTheme.spacing(1),
					padding: defaultTheme.spacing(2),
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