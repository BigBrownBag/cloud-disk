import {combineReducers, configureStore} from '@reduxjs/toolkit'
import fileReducer from "./file.slice"
import userReducer from "./user.slice"
import {useDispatch} from "react-redux"
import uploadReducer from "./upload.slice"

const rootReducer = combineReducers({
    files: fileReducer,
    user: userReducer,
    upload: uploadReducer
});

const store = configureStore({
    reducer: rootReducer
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export type RootState = ReturnType<typeof store.getState>

export default store

