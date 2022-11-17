import React, {useMemo} from "react"
import {Link as ReactRouterLink} from "react-router-dom"
import {RootState, useAppDispatch} from "../../store"
import {IUser, logout} from "../../store/user.slice"
import {useSelector} from "react-redux"
import {
    AppBar, Avatar,
    Box, Button,
    Container,
    IconButton,
    Link,
    Menu,
    MenuItem,
    Toolbar, Tooltip,
    Typography
} from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu'
import CloudIcon from '@mui/icons-material/Cloud'
import LogoutIcon from '@mui/icons-material/Logout'

interface NavbarProps {
    isAuth: boolean;
}

const Navbar: React.FC<NavbarProps> = (props: NavbarProps) => {
    const {isAuth} = props
    const dispatch = useAppDispatch()
    const currentUser = useSelector<RootState, IUser>(state => state.user.currentUser)
    const avatar = currentUser?.avatar ? `${"http://localhost:5000/" + currentUser.avatar}` : undefined
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)

    const onClick = () => {
        dispatch(logout())
    }

    const pages = useMemo(() => {
        return !isAuth ?
            [
                {
                    label: "Регистрация",
                    path: "/registration"
                },
                {
                    label: "Авторизация",
                    path: "/login"
                }
            ]
            :
            [
                {
                    label: "Главная",
                    path: "/"
                },
                {
                    label: "Профиль",
                    path: "/profile"
                }
            ]
    }, [isAuth])

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget)
    }

    const handleCloseNavMenu = () => {
        setAnchorElNav(null)
    }

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ zIndex: 20 }}>
                    <CloudIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        CLOUD
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.label} onClick={handleCloseNavMenu} sx={{ py: 0 }}>
                                    <Typography
                                        to={page.path}
                                        textAlign="center"
                                        component={ReactRouterLink}
                                        sx={{ color: 'black', display: 'block', textDecoration: 'none' }}
                                    >
                                        {page.label}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <CloudIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        CLOUD
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Link
                                variant="button"
                                key={page.label}
                                to={page.path}
                                component={ReactRouterLink}
                                sx={{ margin: 2, color: 'white', display: 'block', textDecoration: 'none' }}
                            >
                                {page.label}
                            </Link>
                        ))}
                    </Box>

                    {isAuth &&
                        <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', justifyItems: "end" }}>
                            <Tooltip title={currentUser?.email || 'P'}>
                                <Avatar alt={currentUser?.email || 'P'} src={avatar} />
                            </Tooltip>
                            <Button
                                disableRipple
                                endIcon={<LogoutIcon sx={{mr: 1}}/>}
                                sx={{ color: 'white', ml: 2}}
                                onClick={onClick}
                            >
                                Выйти
                            </Button>
                        </Box>
                    }
                </Toolbar>
            </Container>
        </AppBar>
    )
};

export default Navbar;