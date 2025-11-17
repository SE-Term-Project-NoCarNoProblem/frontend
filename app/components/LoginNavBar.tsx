import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import {
	Avatar,
	Box,
	Button,
	Divider,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import InboxIcon from "@mui/icons-material/Inbox";
import MailIcon from "@mui/icons-material/Mail";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

type Anchor = "top";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function LoginNavBar(Props: any) {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const router = useRouter();
	const goHome = () => {
		router.push("/landing-page");
	};
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleLogOut = async () => {
		setAnchorEl(null);
		const { error } = await supabase.auth.signOut();
		if (error) console.log(error);
		router.push("/");
	};
	const handleProfile = () => {
		setAnchorEl(null);
		router.push("/profile");
	};
	const handlers = [
		handleProfile,
		() => { router.push("/landing-page"); },   // Home
		() => { router.push("/location"); },       // Transport
		() => { router.push("/ride-history"); },   // Ride History
		() => { router.push("/ticket-history"); }, // Ticket History
	];

	const [state, setState] = React.useState({
		top: false,
	});
	const toggleDrawer =
		(anchor: Anchor, open: boolean) =>
			(event: React.KeyboardEvent | React.MouseEvent) => {
				if (
					event.type === "keydown" &&
					((event as React.KeyboardEvent).key === "Tab" ||
						(event as React.KeyboardEvent).key === "Shift")
				) {
					return;
				}

				setState({ ...state, [anchor]: open });
			};
	const list = (anchor: Anchor) => (
		<Box
			sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
			role="presentation"
			onClick={toggleDrawer(anchor, false)}
			onKeyDown={toggleDrawer(anchor, false)}
		>
			<List>
				{["Profile", "Home", "Transport", "Ride History", "Ticket History"].map(
					(text, index) => (

						<ListItem key={text} disablePadding>
							<ListItemButton onClick={handlers[index]}>
								<ListItemIcon>
									{index === 0 ? (
										<Avatar
											src={`${Props.profilePic}?ts=${Date.now()}`}
											sx={{ width: 30, height: 30 }}
										/>
									) : index === 1 ? (
										<Image alt="home icon" src="/icons/home.svg" width={30} height={30} />
									) : index === 2 ? (
										<Image alt="transport icon" src="/icons/car.svg" width={30} height={30} />
									) : index === 3 ? (
										<Image alt="ride history icon" src="/icons/ride-history.svg" width={30} height={30} />
									) : index === 4 ? (
										<Image alt="ticket history icon" src="/icons/ticket.svg" width={30} height={30} />
									) : null}

								</ListItemIcon>
								<ListItemText primary={text} />
							</ListItemButton>
						</ListItem>
					))}
			</List>
			<Divider />
			<List>
				{["Log Out"].map((text) => (
					<ListItem key={text} disablePadding>
						<ListItemButton onClick={handleLogOut}>
							<ListItemIcon>
								<Image
									alt="log out icon"
									src="/icons/Blue-LogOut.svg"
									width={30}
									height={30}
								/>
							</ListItemIcon>
							<ListItemText primary={text} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	);
	return (
		<header className="mb-8 lg:mb-0">
			<div className="flex w-12/12 bg-[#d9d9d9] justify-between px-2  py-3">
				<div className="flex items-center gap-2">
					<button onClick={goHome}>
						<Image
							aria-hidden
							src="/directions_car.svg"
							alt="Car icon"
							width={30}
							height={30}
						/>
					</button>

					<button onClick={goHome}>
						<span className="font-semibold text-2xl text-slate-800">
							NoCarNoProblem
						</span>
					</button>
				</div>

				<div className="md:flex hidden justify-between items-center md:w-4/12 lg:w-3/12">
					<div className="flex w-8/12 gap-5 justify-between">
						<Link
							href="/landing-page"
							className="text-xl text-slate-800 px-2 py-2 rounded-xl hover:bg-amber-50"
						>
							Home
						</Link>
						<Link
							href="/location"
							className="text-xl text-slate-800 px-2 py-2 rounded-xl hover:bg-amber-50"
						>
							Transport
						</Link>
						<Link
							href="/ride-history"
							className="text-xl text-slate-800 px-2 py-2 rounded-xl hover:bg-amber-50"
						>
							Ride History
						</Link>
						<Link
							href="/ticket-history"
							className="text-xl text-slate-800 px-2 py-2 rounded-xl hover:bg-amber-50"
						>
							Ticket History
						</Link>
					</div>
					<Tooltip title="Account settings">
						<IconButton
							onClick={handleClick}
							size="small"
							sx={{ ml: 2 }}
							aria-controls={open ? "account-menu" : undefined}
							aria-haspopup="true"
							aria-expanded={open ? "true" : undefined}
						>
							<Avatar
								src={`${Props.profilePic}?ts=${Date.now()}`}
								sx={{ width: 48, height: 48 }}
							></Avatar>
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
									overflow: "visible",
									filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
									mt: 1.5,
									"& .MuiAvatar-root": {
										width: 32,
										height: 32,
										ml: -0.5,
										mr: 1,
									},
									"&::before": {
										content: '""',
										display: "block",
										position: "absolute",
										top: 0,
										right: 14,
										width: 10,
										height: 10,
										bgcolor: "background.paper",
										transform: "translateY(-50%) rotate(45deg)",
										zIndex: 0,
									},
								},
							},
						}}
						transformOrigin={{ horizontal: "right", vertical: "top" }}
						anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
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
				<div className="md:hidden flex justify-between items-center md:w-4/12 lg:w-3/12">
					{(["top"] as const).map((anchor) => (
						<React.Fragment key={anchor}>
							<IconButton
								size="small"
								sx={{ ml: 2 }}
								onClick={toggleDrawer(anchor, true)}
							>
								<Image
									alt="hamburger icon"
									src="/icons/hamburgerMenu.svg"
									width={30}
									height={30}
								/>
							</IconButton>
							<Drawer
								anchor={anchor}
								open={state[anchor]}
								onClose={toggleDrawer(anchor, false)}
							>
								{list(anchor)}
							</Drawer>
						</React.Fragment>
					))}
				</div>
			</div>
		</header>
	);
}
export default LoginNavBar;
