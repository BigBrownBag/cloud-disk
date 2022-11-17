import React from 'react'
import {useSelector} from "react-redux"
import {RootState, useAppDispatch} from "../../../../store"
import {
    changeCurrentDir,
    deleteFile,
    downloadFile,
    IFile,
    pushToStack,
    ViewParameters
} from "../../../../store/file.slice"
import {
    Box,
    Card, CardActions, CardContent,
    Container, Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Tooltip,
    Typography
} from "@mui/material"
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import DownloadIcon from '@mui/icons-material/Download'
import sizeFormat from "../../../../utils/sizeFormat"
import moment from "moment"
import FolderIcon from '@mui/icons-material/Folder'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'

interface FileListState {
    currentDir: string | null
}

const FileList: React.FC<FileListState> = ({currentDir}) => {
    const dispatch = useAppDispatch()
    const files = useSelector<RootState, IFile[]>(state => state.files.files)
    const fileView = useSelector<RootState, ViewParameters>(state => state.files.view)

    const onDirOpen = (file: IFile) => {
        if(file.type === 'dir') {
            dispatch(changeCurrentDir(file._id))
            dispatch(pushToStack(currentDir))
        }
    }

    const onDownload = (event: React.MouseEvent<HTMLButtonElement>, file: IFile) => {
        event.stopPropagation()
        dispatch(downloadFile({file}))
    }

    const onDelete = (event: React.MouseEvent<HTMLButtonElement>, file: IFile) => {
        event.stopPropagation()
        dispatch(deleteFile({file}))
    }

    if (files.length === 0) {
        return (
            <Typography variant="h5" align="center" sx={{ pt: 4}}>Файлы не найдены</Typography>
        )
    }

    return (fileView === "plate" ?
            <Container sx={{ py: 8 }} maxWidth="md">
                <Grid container spacing={4}>
                    {files.map(file => (
                        <Grid item key={file._id} xs={12} sm={6} md={4}>
                            <Card
                                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                onClick={() => onDirOpen(file)}
                            >
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Tooltip title={file.name || ""}>
                                        <Typography gutterBottom variant="h4" align="center">
                                            {file.name}
                                        </Typography>
                                    </Tooltip>
                                    <Box sx={{display: 'flex', mt: 2}}>
                                        {file.type === "dir" ? <FolderIcon fontSize="large"/> : <InsertDriveFileIcon fontSize="large"/>}
                                        <Typography variant="h5" sx={{mx: 3}}>
                                            {sizeFormat(file.size)}
                                        </Typography>
                                    </Box>
                                </CardContent>
                                <CardActions sx={{
                                    justifyContent: 'center'
                                }}>
                                    {file.type !== "dir" &&
                                        <IconButton
                                            disableRipple
                                            color="success"
                                            onClick={(e) => onDownload(e, file)}
                                        >
                                            <DownloadIcon/>
                                        </IconButton>
                                    }
                                    <IconButton
                                        disableRipple
                                        color="secondary"
                                        onClick={(e) => onDelete(e, file)}
                                    >
                                        <DeleteForeverIcon/>
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        :
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>Название</TableCell>
                        <TableCell align="right">Дата&nbsp;cоздания</TableCell>
                        <TableCell align="right">Размер&nbsp;файла</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {files.map((file) => (
                        <TableRow
                            key={file._id}
                            sx={{
                                '&:last-child td, &:last-child th': {
                                    border: 0
                                },
                                '&:hover': {
                                    bgcolor: 'text.disabled'
                                }
                            }}
                            onClick={() => onDirOpen(file)}
                        >
                            <TableCell align="left">{file.type === "dir" ? <FolderIcon/> : <InsertDriveFileIcon/>}</TableCell>
                            <TableCell component="th" scope="row">
                                {file.name}
                            </TableCell>
                            <TableCell align="right">{moment(file.date).format('MM.DD.YYYY/h:mm a')}</TableCell>
                            <TableCell align="right">{sizeFormat(file.size)}</TableCell>
                            <TableCell align="right">
                                {file.type !== "dir" &&
                                    <IconButton
                                        disableRipple
                                        color="success"
                                        onClick={(e) => onDownload(e, file)}
                                    >
                                        <DownloadIcon/>
                                    </IconButton>
                                }
                                <IconButton
                                    disableRipple
                                    color="secondary"
                                    onClick={(e) => onDelete(e, file)}
                                >
                                    <DeleteForeverIcon/>
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default FileList;