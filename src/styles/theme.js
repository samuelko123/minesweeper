import { createTheme } from '@mui/material'

const surfaceColor = '#fff'

const defaultTheme = createTheme()

export const theme = createTheme(defaultTheme, {
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
		google: {
			main: '#4285F4',
			contrastText: '#ffffff',
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
					paddingTop: defaultTheme.spacing(3),
					paddingBottom: defaultTheme.spacing(3),
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