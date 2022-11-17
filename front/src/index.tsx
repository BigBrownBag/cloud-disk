import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import store from './store/index'
import { Provider } from 'react-redux'
import {ThemeProvider} from "@mui/material"
import theme from "./theme/Theme"

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </Provider>
);
