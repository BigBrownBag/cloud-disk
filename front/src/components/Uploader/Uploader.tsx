import React from 'react'
import {RootState, useAppDispatch} from "../../store"
import {useSelector} from "react-redux"
import {hideUploader, UploadFileType} from "../../store/upload.slice"
import {Box, Container, IconButton, LinearProgress, Typography} from "@mui/material"
import CloseIcon from '@mui/icons-material/Close'

const Uploader = () => {
    const dispatch = useAppDispatch()
    const files = useSelector<RootState, UploadFileType[]>(state => state.upload.files)

    const onClose = () => {
        dispatch(hideUploader())
    }

    return (
        <Container
            disableGutters
            sx={{
                width: 300,
                maxHeight: 500,
                position: 'fixed',
                right: 0,
                bottom: 0,
                bgcolor: 'primary.main',
                padding: 1,
                borderRadius: '16px 16px 0 0'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    justifyContent: 'space-between',
                }}
            >
                <Typography sx={{ width: '100%', color: 'background.default' }} variant="body1" align="center">Загрузки</Typography>
                <IconButton
                    disableRipple
                    onClick={onClose}
                    sx={{ padding: 0, color: 'background.default' }}
                >
                    <CloseIcon/>
                </IconButton>
            </Box>
            <Box
                sx={{
                    maxHeight: 460,
                    overflow: 'auto'
                }}
            >
                {files.map(file =>
                    <Box
                        key={file.id}
                        sx={{
                            my: 2,
                            bgcolor: 'background.default',
                            padding: 1,
                            borderRadius: 1
                        }}
                    >
                        <Typography sx={{ width: '100%' }} variant="body1" align="center">{file.name}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: '100%', mr: 1 }}>
                                <LinearProgress variant="determinate" color="success" value={file.progress} />
                            </Box>
                            <Box sx={{ minWidth: 35 }}>
                                <Typography variant="body2" color="text.secondary">{`${Math.round(
                                    file.progress,
                                )}%`}</Typography>
                            </Box>
                        </Box>
                    </Box>
                )}
            </Box>
        </Container>
    )
};

export default Uploader;