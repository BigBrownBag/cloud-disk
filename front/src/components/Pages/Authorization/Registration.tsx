import React, {useState} from 'react'
import {registration} from "../../../store/user.slice";
import {useAppDispatch} from "../../../store";
import {Avatar, Box, Button, Grid, TextField, Typography} from "@mui/material";
import {Link} from "react-router-dom";

const Registration = () => {
    const dispatch = useAppDispatch()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const onClick = () => {
        dispatch(registration({email, password}))
    }

    return (
        <Box
            sx={{
                my: 16,
                mx: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}/>
            <Typography component="h3" variant="h4">
                Регистрация
            </Typography>
            <Box component="div" sx={{ mt: 1 }}>
                <TextField
                    variant="standard"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Логин"
                    name="login"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    variant="standard"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Пароль"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={onClick}
                >
                    Зарегистрироваться
                </Button>
                <Grid container>
                    <Grid item>
                        <Link to="/login" style={{textDecoration: "none", color: "black"}}>
                            {"Уже есть аккаунт? Войти"}
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Registration;