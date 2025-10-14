import * as React from 'react';
import Image from "next/image";
import Link from 'next/link';
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { Avatar, Divider, ListItemIcon, Menu, MenuItem } from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";


function LoginNavBar(Props: any) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const router = useRouter();
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    }
    const handleLogOut = async () => {
        setAnchorEl(null);
        const { error } = await supabase.auth.signOut();
        if (error) console.log(error);
        router.push('/');
    };
    const handleProfile = () => {
        setAnchorEl(null);
        router.push('/profile');
    };
    return (<header className="mb-8 lg:mb-0">
        <div className="flex w-12/12 bg-[#d9d9d9] justify-between px-2  py-3">
            <div className="flex items-center gap-2">
                <Image
                    aria-hidden
                    src="/directions_car.svg"
                    alt="Car icon"
                    width={30}
                    height={30}
                />
                <span className="font-semibold text-2xl text-slate-800">NoCarNoProblem</span>
            </div>

            <div className="flex justify-between items-center md:w-4/12 lg:w-3/12">
                <div className="flex w-8/12 gap-5 justify-between">
                    <Link href="/location" className="text-xl text-slate-800 px-2 py-2 rounded-xl hover:bg-amber-50">Transport</Link>
                    <Link href="/landing-page" className="text-xl text-slate-800 px-2 py-2 rounded-xl hover:bg-amber-50">Home</Link>
                    
                </div>
                <Tooltip  title="Account settings">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar src={`${Props.profilePic}?ts=${Date.now()}`} sx={{ width: 48, height: 48 }} ></Avatar>
                    </IconButton>
                </Tooltip>
                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    slotProps={{
                        paper: {
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                '&::before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={handleProfile}>
                        <Avatar src={`${Props.profilePic}?ts=${Date.now()}`} /> Profile
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogOut}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
            </div>
        </div>

    </header>);
}
export default LoginNavBar;