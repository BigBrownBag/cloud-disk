import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import axios from "axios"
import {addUploadFile, changeUploadFile, showUploader} from "./upload.slice"

export interface IFile {
    _id: string;
    name: string;
    type: string;
    accessLink?: string;
    size?: number;
    path?: string;
    date?: string;
    user?: string;
    parent?: string;
    childs?: string[];
}

export interface FileState {
    files: IFile[];
    currentDir: string | null;
    popupDisplay: PopupDisplay;
    dirStack: (string | null)[];
    view: ViewParameters;
    pending: boolean;
}

export type ViewParameters = 'plate' | 'list'
export type SortParameters = "name" | "type" | "date"
export type PopupDisplay = 'none' | 'flex'

const initialState: FileState = {
    files: [],
    currentDir: null,
    popupDisplay: 'none',
    dirStack: [],
    view: 'list',
    pending: false
}

export const getFiles = createAsyncThunk<any, {dirId: string | null, sort?: SortParameters}>(
    'files/getFiles',
    async ({dirId, sort}, thunkAPI) => {
        try {
            let url = `${process.env.REACT_APP_API_URL}files`
            if (dirId) {
                url = `${process.env.REACT_APP_API_URL}files?parent=${dirId}`
            }
            if (sort) {
                url = `${process.env.REACT_APP_API_URL}files?sort=${sort}`
            }
            if (dirId && sort) {
                url = `${process.env.REACT_APP_API_URL}files?parent=${dirId}&sort=${sort}`
            }
            const response = await axios.get(url, {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            })

            return response.data
        } catch (e:any) {
            alert(e?.response?.data?.message)
        }
    }
)

export const createDir = createAsyncThunk<any, {dirId: string | null, name: string}>(
    'files/createDir',
    async ({dirId, name}, thunkAPI) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}files`,{
                name,
                parent: dirId,
                type: 'dir'
            },
            {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            })

            return response.data
        } catch (e:any) {
            alert(e?.response?.data?.message)
        }
    }
)

export const uploadFiles = createAsyncThunk<any, {file: File, dirId: string | null}>(
    'files/uploadFiles',
    async ({file, dirId}, thunkAPI) => {
        try {
            const formData = new FormData()
            formData.append('file', file as any)
            if (dirId) {
                formData.append('parent', dirId)
            }
            const uploadFile = {name: file.name, progress: 0, id: Date.now()}
            thunkAPI.dispatch(showUploader())
            thunkAPI.dispatch(addUploadFile(uploadFile))
            const response = await axios.post(`${process.env.REACT_APP_API_URL}files/upload`, formData, {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
                onUploadProgress: progressEvent => {
                    const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
                    if (totalLength) {
                        const copyUploadFile = {...uploadFile}
                        copyUploadFile.progress = Math.round((progressEvent.loaded * 100) / totalLength)
                        thunkAPI.dispatch(changeUploadFile(copyUploadFile))
                    }
                }
            });

            return response.data
        } catch (e:any) {
            alert(e?.response?.data?.message)
        }
    }
)

export const downloadFile = createAsyncThunk<any, {file: IFile}>(
    'files/downloadFile',
    async ({file}, thunkAPI) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}files/download?id=${file._id}`,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (response.status === 200) {
                const blob = await response.blob()
                const downloadUrl = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = downloadUrl
                link.download = file.name
                document.body.appendChild(link)
                link.click()
                link.remove()
            }

            return response.blob()
        } catch (e:any) {
            alert(e?.response?.data?.message)
        }
    }
)

export const deleteFile = createAsyncThunk<any, {file: IFile}>(
    'files/deleteFile',
    async ({file}, thunkAPI) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}files?id=${file._id}`,{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            return response.data
        } catch (e:any) {
            alert(e?.response?.data?.message)
        }
    }
)

export const searchFiles = createAsyncThunk<any, {search: string}>(
    'files/searchFiles',
    async ({search}, thunkAPI) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}files/search?search=${search}`,{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            return response.data
        } catch (e:any) {
            alert(e?.response?.data?.message)
        }
    }
)

const fileSlice = createSlice({
    name: 'files',
    initialState,
    reducers: {
        changePopupDisplay: (state, {payload}: PayloadAction<PopupDisplay>) => {
            state.popupDisplay = payload
        },
        changeCurrentDir: (state, {payload}: PayloadAction<string | null>) => {
            state.currentDir = payload
        },
        changeFileView: (state, {payload}: PayloadAction<ViewParameters>) => {
            state.view = payload
        },
        pushToStack: (state, {payload}: PayloadAction<string | null>) => {
            state.dirStack = [...state.dirStack, payload]
        },
        changeDirStack: (state, {payload}: PayloadAction<(string | null)[]>) => {
            state.dirStack = [...state.dirStack].slice(0, state.dirStack.length - 1)
        }
    },
    extraReducers: builder => {
        builder.addCase(getFiles.fulfilled, (state, {payload}: PayloadAction<IFile[]>) => {
            state.files = payload
            state.pending = false
        })
        builder.addCase(getFiles.pending, state => {
            state.pending = true
        })
        builder.addCase(getFiles.rejected, state => {
            state.pending = false
        })
        builder.addCase(createDir.fulfilled, (state, {payload}: PayloadAction<IFile>) => {
            state.files = [...state.files, payload]
            state.pending = false
        })
        builder.addCase(createDir.pending, state => {
            state.pending = true
        })
        builder.addCase(createDir.rejected, state => {
            state.pending = false
        })
        builder.addCase(uploadFiles.fulfilled, (state, {payload}: PayloadAction<IFile>) => {
            state.files = [...state.files, payload]
            state.pending = false
        })
        builder.addCase(uploadFiles.pending, state => {
            state.pending = true
        })
        builder.addCase(uploadFiles.rejected, state => {
            state.pending = false
        })
        builder.addCase(downloadFile.fulfilled, state => {
            state.pending = false
        })
        builder.addCase(downloadFile.pending, state => {
            state.pending = true
        })
        builder.addCase(downloadFile.rejected, state => {
            state.pending = false
        })
        builder.addCase(deleteFile.fulfilled, (state, {payload}: PayloadAction<IFile>) => {
            state.files = [...state.files.filter(file => file._id !== payload._id)]
            state.pending = false
        })
        builder.addCase(deleteFile.pending, state => {
            state.pending = true
        })
        builder.addCase(deleteFile.rejected, state => {
            state.pending = false
        })
        builder.addCase(searchFiles.fulfilled, (state, {payload}: PayloadAction<IFile[]>) => {
            state.files = payload
            state.pending = false
        })
        builder.addCase(searchFiles.pending, state => {
            state.pending = true
        })
        builder.addCase(searchFiles.rejected, state => {
            state.pending = false
        })
    }
})

export const {
    changePopupDisplay,
    changeCurrentDir,
    changeFileView,
    pushToStack,
    changeDirStack
} = fileSlice.actions

export default fileSlice.reducer