import {createSlice, PayloadAction} from "@reduxjs/toolkit"

export interface UploadState {
    isVisible: boolean;
    files: UploadFileType[];
}

export type UploadFileType = {name: string, progress: number, id: number}

const initialState: UploadState = {
    isVisible: false,
    files: []
}

const uploadSlice = createSlice({
    name: 'upload',
    initialState,
    reducers: {
        showUploader: state => {
            state.isVisible = true
        },
        hideUploader: state => {
            state.isVisible = false
        },
        addUploadFile: (state, {payload}: PayloadAction<UploadFileType>) => {
            state.files = [...state.files, payload]
        },
        removeUploadFile: (state, {payload}: PayloadAction<UploadFileType>) => {
            state.files = [...state.files.filter(file => file.id !== payload.id)]
        },
        changeUploadFile: (state, {payload}: PayloadAction<UploadFileType>) => {
            state.files = [
                ...state.files.map(file => file.id === payload.id ?
                    {...file, progress: payload.progress}
                    :
                    {...file}
                )
            ]
        }
    }
})

export const {
    changeUploadFile,
    addUploadFile,
    removeUploadFile,
    hideUploader,
    showUploader
} = uploadSlice.actions

export default uploadSlice.reducer