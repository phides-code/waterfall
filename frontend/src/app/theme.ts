import { createTheme } from '@mui/material';

const theme = createTheme({
    typography: {
        fontFamily: [
            'Segoe UI',
            'Roboto',
            'Oxygen',
            'Ubuntu',
            'Cantarell',
            'Fira Sans',
            'Droid Sans',
            'Helvetica Neue',
            'sans-serif',
        ].join(','),
    },
    palette: {
        primary: {
            light: '#855a50',
            main: '#563028',
            dark: '#2c0900',
            contrastText: '#fff',
        },
        secondary: {
            light: '#ffe7b7',
            main: '#d8b587',
            dark: '#a5855a',
            contrastText: '#000',
        },
    },
});

export default theme;
