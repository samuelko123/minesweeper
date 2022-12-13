import { createTheme } from '@mui/material'

const coloredTheme = createTheme({
	palette: {
		primary: {
			main: '#005aaa',
		},
		background: {
			default: '#eee',
		},
		surface: {
			default: '#fff',
		},
		google: {
			main: '#4285F4',
			contrastText: '#ffffff',
		},
	},
})

export const theme = createTheme(coloredTheme, {
	components: {
		MuiAppBar: {
			defaultProps: {
				elevation: 2,
			},
			styleOverrides: {
				root: {
					position: 'static',
					padding: coloredTheme.spacing(1),
					paddingLeft: coloredTheme.spacing(2),
					paddingRight: coloredTheme.spacing(2),
					height: coloredTheme.spacing(7),
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
				},
			},
		},
		MuiList: {
			defaultProps: {
				disablePadding: true,
			},
		},
		MuiListSubheader: {
			defaultProps: {
				disableSticky: true,
			},
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
					paddingTop: coloredTheme.spacing(3),
					paddingBottom: coloredTheme.spacing(3),
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
					gap: coloredTheme.spacing(1),
					padding: coloredTheme.spacing(2),
				},
			},
		},
		MuiPaper: {
			defaultProps: {
				elevation: 0,
			},
			styleOverrides: {
				root: {
					backgroundColor: 'surface',
				},
			},
		},
		MuiToggleButton: {
			defaultProps: {
				disableRipple: true,
			},
		},
	},
})