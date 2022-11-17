import React from 'react'
import {RootState, useAppDispatch} from "../../../store"
import {deleteAvatar, IUser, uploadAvatar} from "../../../store/user.slice"
import {useSelector} from "react-redux"
import {Avatar, Box, Button, Container, IconButton, Tooltip, Typography} from "@mui/material"
import UploadIcon from "@mui/icons-material/Upload"
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
const Profile = () => {
    const dispatch = useAppDispatch()
    const currentUser = useSelector<RootState, IUser>(state => state.user.currentUser)
    const avatar = currentUser?.avatar ? `${"http://localhost:5000/" + currentUser.avatar}` : undefined

    const onDelete = () => {
        dispatch(deleteAvatar())
    }

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target?.files?.[0]
        file && dispatch(uploadAvatar({file}))
    }

    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mt: 4
            }}
        >
            <Avatar alt={currentUser?.email || 'P'} src={avatar} sx={{ height: 200, width: 200 }}/>
            <Box>
                <Tooltip title="Загрузить файл">
                    <Button
                        component="label"
                        sx={{
                            minWidth: 24,
                            padding: 1
                        }}
                    >
                        <UploadIcon sx={{ color: 'text.secondary'}}/>
                        <input
                            multiple
                            hidden
                            type="file"
                            onChange={onChange}
                        />
                    </Button>
                </Tooltip>
                <Tooltip title="Удалить файл">
                    <IconButton
                        disableRipple
                        onClick={onDelete}
                    >
                        <DeleteForeverIcon color="error"/>
                    </IconButton>
                </Tooltip>
            </Box>
            <Box sx={{ display: 'flex'}}>
                <Typography variant="body2" color="text.secondary">email:&nbsp;</Typography>
                <Typography variant="body2" color="text.secondary">{currentUser.email}</Typography>
            </Box>
        </Container>
    );
};

export default Profile;