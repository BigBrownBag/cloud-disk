import React from 'react'
import {
    Grid,
    Paper,
} from "@mui/material";
import Login from "./Login";
import Registration from "./Registration";

interface AuthorizationState {
    registration?: boolean;
}

const Authorization: React.FC<AuthorizationState> = (props: AuthorizationState) => {
    const {registration} = props

    return (
        <Grid container component="main" sx={{ height: 'calc(100vh - 64px)' }}>
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage: 'url(https://source.unsplash.com/random)',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) =>
                        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={8} square>
                {!!registration ?
                    <Registration/>
                    :
                    <Login/>
                }
            </Grid>
        </Grid>
    )
};

export default Authorization;