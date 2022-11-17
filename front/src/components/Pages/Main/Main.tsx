import React, {useEffect, useState} from 'react'
import FileList from "./FileList/FileList";
import Uploader from "../../Uploader/Uploader";
import {
    changeCurrentDir, changeDirStack,
    changeFileView, createDir,
    getFiles, searchFiles,
    SortParameters,
    uploadFiles
} from "../../../store/file.slice"
import {useSelector} from "react-redux"
import {RootState, useAppDispatch} from "../../../store"
import Loader from "../../Loader/Loader"
import {
    Box,
    Button,
    Container, Fade,
    Grid,
    IconButton,
    InputAdornment, MenuItem, Popper,
    Select, SelectChangeEvent,
    TextField,
    Toolbar,
    Tooltip, Typography
} from "@mui/material"
import UploadIcon from '@mui/icons-material/Upload'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import ClearIcon from "@mui/icons-material/Clear"
import DensitySmallIcon from '@mui/icons-material/DensitySmall';
import GridViewIcon from '@mui/icons-material/GridView'

const Main = () => {
    const dispatch =  useAppDispatch()
    const pending = useSelector<RootState, boolean>(state => state.files.pending)
    const currentDir = useSelector<RootState, string | null>(state => state.files.currentDir)
    const dirStack = useSelector<RootState, (string | null)[]>(state => state.files.dirStack)
    const isVisible = useSelector<RootState, boolean>(state => state.upload.isVisible)
    const [dragEnter, setDragEnter] = useState(false)
    const [sort, setSort] = useState<SortParameters>('type')
    const [searchName, setSearchName] = useState<string>('')
    const [searchTimeout, setSearchTimeout] = useState<number | false | NodeJS.Timeout>(false)
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const [open, setOpen] = React.useState(false)
    const [dirName, setDirName] = useState<string>('')

    useEffect(() => {
        dispatch(getFiles({dirId: currentDir, sort}))
    }, [dispatch, currentDir, sort])

    const onSearch = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSearchName(event.target.value)
        if (searchTimeout !== false) {
            clearTimeout(searchTimeout)
        }
        if(event.target.value !== '') {
            setSearchTimeout(setTimeout((value) => {
                    dispatch(searchFiles({search: value}))
                }, 500, event.target.value)
            )
        } else {
            dispatch(getFiles({dirId: currentDir}))
        }
    }

    const onSearchClear = () => {
        dispatch(getFiles({dirId: currentDir}))
        setSearchName("")
    }

    const onBackClick = () => {
        const backDirId = [...dirStack].pop()
        dispatch(changeDirStack(dirStack))
        if (backDirId !== undefined) dispatch(changeCurrentDir(backDirId))
    }

    const onPopupShow = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
        setOpen((previousOpen) => !previousOpen)
    }

    const onFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files)
            files.forEach(file => dispatch(uploadFiles({file, dirId: currentDir})))
        }
    }

    const onSort = (event: SelectChangeEvent<SortParameters>) => {
        setSort(event.target.value as SortParameters)
    }

    const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
        let files = [...Array.from(event.dataTransfer.files)]
        files.forEach(file =>
            dispatch(uploadFiles({file, dirId: currentDir})
        ))
        setDragEnter(false)
    }

    const onDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
        setDragEnter(true)
    }

    const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
        setDragEnter(false)
    }

    const onPlateClick = () => {
        dispatch(changeFileView('plate'))
    }

    const onListClick = () => {
        dispatch(changeFileView('list'))
    }

    const onPopperCreate = () => {
        setOpen(false)
        dispatch(createDir({dirId: currentDir, name: dirName}))
        setDirName('')
    }

    const onPopperClose = () => {
        setOpen(false)
    }

    if (pending) {
        return (
            <Loader/>
        )
    }

    return (!dragEnter ?
        <Container
            component="main"
            sx={{height: 'calc(100vh - 64px)'}}
            maxWidth="xl"
            onDrop={onDrop}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragEnter}
        >
            <Toolbar disableGutters>
                <Grid container spacing={6}>
                    <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Tooltip title="Назад">
                            <IconButton
                                disableRipple
                                onClick={onBackClick}
                            >
                                <KeyboardBackspaceIcon/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Создать папку">
                            <IconButton
                                disableRipple
                                onClick={onPopupShow}
                            >
                                <CreateNewFolderIcon/>
                            </IconButton>
                        </Tooltip>
                        <Popper open={open} anchorEl={anchorEl} transition placement="bottom-start">
                            {({ TransitionProps }) => (
                                <Fade {...TransitionProps} timeout={350}>
                                    <Box sx={{ border: 1, borderRadius: 2, p: 1, bgcolor: 'background.paper', zIndex: 10 }}>
                                        <TextField
                                            fullWidth
                                            variant="standard"
                                            margin="none"
                                            label="Название"
                                            autoComplete="off"
                                            sx={{
                                                my: 0, mx: 0,
                                                '& .MuiInput-underline:after': {
                                                    borderBottom: '1px solid black'
                                                }
                                            }}
                                            value={dirName}
                                            onChange={(e) => setDirName(e.target.value)}
                                        />
                                        <Container
                                            disableGutters
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                mt: 1
                                            }}
                                        >
                                            <Button
                                                disableRipple
                                                onClick={onPopperCreate}
                                            >
                                                Создать
                                            </Button>
                                            <Button
                                                disableRipple
                                                onClick={onPopperClose}
                                            >
                                                Отмена
                                            </Button>
                                        </Container>
                                    </Box>
                                </Fade>
                            )}
                        </Popper>
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
                                    onChange={onFileUpload}
                                />
                            </Button>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={5} md={6} lg={7}>
                        <TextField
                            variant="standard"
                            margin="none"
                            fullWidth
                            name="search"
                            label="Поиск"
                            id="search"
                            autoComplete="off"
                            sx={{
                                my: 0, mx: 4,
                                '& .MuiInput-underline:after': {
                                    borderBottom: '1px solid black'
                                }
                            }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                    <IconButton
                                        disableRipple
                                        aria-label="clear-search-input"
                                        onClick={onSearchClear}
                                        sx={{ padding: 0 }}
                                    >
                                        <ClearIcon/>
                                    </IconButton>
                                </InputAdornment>
                            }}
                            value={searchName}
                            onChange={(e) => onSearch(e)}
                        />
                    </Grid>
                    <Grid item xs={5} md={4} lg={3} sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                        <Select
                            disableUnderline
                            sx={{
                                "& .MuiSelect-select": {
                                    padding: 0,
                                },
                                height: 23,
                                bgcolor: 'background.default'
                            }}
                            variant="filled"
                            value={sort}
                            onChange={onSort}
                        >
                            <MenuItem value="name">По имени</MenuItem>
                            <MenuItem value="type">По типу</MenuItem>
                            <MenuItem value="date">По дате</MenuItem>
                        </Select>
                        <Tooltip title="Список">
                            <IconButton
                                disableRipple
                                onClick={onListClick}
                            >
                                <DensitySmallIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Плитки">
                            <IconButton
                                disableRipple
                                onClick={onPlateClick}
                            >
                                <GridViewIcon/>
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Toolbar>
            <FileList currentDir={currentDir}/>
            {isVisible && <Uploader/>}
        </Container>
        :
        <Container
            component="main"
            sx={{
                height: 'calc(100vh - 64px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
            onDrop={onDrop}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragEnter}
        >
            <Box
                sx={{
                    width: '50vh',
                    height: '50vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '3px dashed',
                    borderColor: 'primary.main',
                }}

            >
                <Typography variant="h5">Перетащите файлы сюда</Typography>
            </Box>
        </Container>
    );
};

export default Main;