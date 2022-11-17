import { createTheme } from '@mui/material/styles';

const Theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#0288d1',
        },
        secondary: {
            main: '#f50057',
        },
        background: {
            default: "#FAFAFA",
            paper: "#FFFFFF"
        },
        text: {
            primary: "rgba(0, 0, 0, 0.87)",
            secondary: "rgba(0, 0, 0, 0.54)",
            disabled: "rgba(0, 0, 0, 0.38)"
        }
    }
})

export default Theme