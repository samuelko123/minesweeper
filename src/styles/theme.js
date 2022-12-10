import { createTheme } from '@mui/material'

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
			default: '#fff',
		},
	},
	components: {
		MuiListSubheader: {
			styleOverrides: {
				root: {
					backgroundColor: 'inherit',
				},
			},
		},
	},
})