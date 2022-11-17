import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import axios from "axios"

export interface IUser {
    id: string;
    email: string;
    diskSpace?: number;
    usedSpace?: number;
    avatar?: string | null;
}

export interface UserState {
    currentUser: IUser;
    isAuth: boolean;
    pending: boolean;
    error: boolean;
}

const initialState: UserState = {
    currentUser: {} as IUser,
    isAuth: false,
    pending: false,
    error: false
}

export const registration = createAsyncThunk<any, {email: string, password: string}>(
    'user/registration',
    async ({ email, password }, thunkAPI) => {
        const response = await axios.post(process.env.REACT_APP_API_URL + 'auth/registration',
            {
                email,
                password
        })
        return response.data
    }
)

export const login = createAsyncThunk<
    any,
    {email: string, password: string},
    {
        rejectValue: string
    }
    >(
    'user/login',
    async ({ email, password }, thunkAPI) => {
        try {
            const response = await axios.post(process.env.REACT_APP_API_URL + 'auth/login',
                {
                    email,
                    password
                })
            return response.data
        } catch (err) {
            throw err
    }}
)

export const auth = createAsyncThunk<any, void>(
    'user/auth',
    async (_, thunkAPI) => {
        const response = await axios.get(process.env.REACT_APP_API_URL + 'auth/auth',
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
        return response.data
    }
)

export const uploadAvatar = createAsyncThunk<any, { file: File }>(
    'user/uploadAvatar',
    async ({ file }, thunkAPI) => {
        const formData = new FormData()
        formData.append('file', file)
        const response = await axios.post(`${process.env.REACT_APP_API_URL}files/avatar`, formData,
            {headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}}
        )
        return response.data
    }
)

export const deleteAvatar = createAsyncThunk<any, void>(
    'user/deleteAvatar',
    async (_, thunkAPI) => {
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}files/avatar`,
            {headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}}
        )
        return response.data
    }
)

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: state => {
            state.isAuth = false
            state.currentUser = {} as IUser
            localStorage.removeItem('token')
        }
    },
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, {payload}: PayloadAction<{user: IUser, token: string}>) => {
            state.currentUser = payload.user
            state.isAuth = true
            localStorage.setItem('token', payload.token)
        })
        builder.addCase(login.rejected, (state, _) => {
            state.error = true
        })
        builder.addCase(registration.fulfilled, (_, __) => {
            alert('User was created')
        })
        builder.addCase(auth.rejected, (state, __) => {
            state.pending = false
            localStorage.removeItem('token')
        })
        builder.addCase(auth.pending, state => {
            state.pending = true
        })
        builder.addCase(auth.fulfilled, (state, {payload}: PayloadAction<{user: IUser, token: string}>) => {
            state.pending = false
            state.currentUser = payload.user
            state.isAuth = true
            localStorage.setItem('token', payload.token)
        })
        builder.addCase(uploadAvatar.fulfilled, (state, {payload}: PayloadAction<IUser>) => {
            state.currentUser.avatar = payload.avatar
        })
        builder.addCase(deleteAvatar.fulfilled, (state, {payload}: PayloadAction<IUser>) => {
            state.currentUser.avatar = payload.avatar
        })
    }
})

export const { logout } = userSlice.actions

export default userSlice.reducer