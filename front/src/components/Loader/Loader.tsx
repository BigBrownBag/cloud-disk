import React from 'react'
import {Box, CircularProgress} from "@mui/material";

const Loader = () => {
    return (
        <Box sx={{ position: 'absolute', right: 'calc(50% - 128px)', bottom: 'calc(50% - 128px)'}}>
            <CircularProgress size={256} color="primary" variant="indeterminate" disableShrink/>
        </Box>
    );
};

export default Loader;