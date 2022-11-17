import React, {useEffect} from 'react'
import Navbar from "./components/Navbar/Navbar"
import {BrowserRouter, Route, Routes} from "react-router-dom"
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "./store"
import {auth, UserState} from "./store/user.slice"
import Main from "./components/Pages/Main/Main"
import Profile from "./components/Pages/Profile/Profile"
import Loader from "./components/Loader/Loader"
import Authorization from "./components/Pages/Authorization/Authorization"
import './app.css'

function App() {
    const {isAuth, pending} = useSelector<RootState, UserState>(state => state.user)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(auth())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (pending) {
        return <Loader/>
    }

    return (
        <BrowserRouter>
            <Navbar isAuth={isAuth}/>
            {!isAuth ?
                <Routes>
                    <Route path="/registration" element={<Authorization registration/>}/>
                    <Route path="/login" element={<Authorization/>}/>
                    <Route path="/*" element={<Authorization/>}/>
                </Routes>
                :
                <Routes>
                    <Route path="/" element={<Main/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/*" element={<Main/>}/>
                </Routes>
            }
        </BrowserRouter>
    );
}

export default App;
