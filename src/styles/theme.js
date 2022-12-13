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
		MuiAppBar: {
			defaultProps: {
				elevation: 2,
			},
			styleOverrides: {
				root: {
					position: 'static',
					padding: defaultTheme.spacing(1),
					paddingLeft: defaultTheme.spacing(2),
					paddingRight: defaultTheme.spacing(2),
					height: defaultTheme.spacing(7),
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
		MuiToggleButton: {
			defaultProps: {
				disableRipple: true,
				color: 'primary',
			},
		},
	},
})