import React from 'react';
import clsx from 'clsx';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import StoreMallDirectoryIcon from '@material-ui/icons/StoreMallDirectory';
import ReceiptIcon from '@material-ui/icons/Receipt';
import PeopleIcon from '@material-ui/icons/People';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Inventory from './Inventory';
import Users from './Users';
import SalesReport from './SalesReport';
import MakeSale from './MakeSale';
import Box from '@material-ui/core/Box';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';

const drawerWidth = 200;
const admin = ['Make Sale', 'Inventory', 'Sales', 'Users'];
const employee = ['Make Sale'];

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex'
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		})
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	},
	menuButton: {
		marginRight: 36
	},
	hide: {
		display: 'none'
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: 'nowrap'
	},
	drawerOpen: {
		width: drawerWidth,
		overflowX: 'hidden',
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	},
	drawerClose: {
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		}),
		overflowX: 'hidden',
		width: theme.spacing(7) + 1,
		[theme.breakpoints.up('sm')]: {
			width: theme.spacing(9) + 1
		}
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	},
	header: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-around',
		flexGrow: 1
	},
	mode: {
		display: 'flex',
		alignItems: 'flex-end',
		justifyContent: 'center',
		flexGrow: 1
	}
}));

export default function Navigation(props) {
	const classes = useStyles();
	const theme = useTheme();
	const [open, setOpen] = React.useState(false);
	// Show first after login
	const [selectedIndex, setSelectedIndex] = React.useState(0);

	const {username, position, mode, setMode} = props;

	const navigation = position === 'admin' ? admin : employee;

	let [date, setDate] = React.useState(new Date());

	React.useEffect(() => {
		let timer = setInterval(() => setDate(new Date()), 1000);
		return function cleanup() {
			clearInterval(timer);
		};
	});

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	const handleListItemClick = (event, index) => {
		setSelectedIndex(index);
	};

	return (
		<div className={classes.root}>
			<AppBar
				position="fixed"
				className={clsx(classes.appBar, {
					[classes.appBarShift]: open
				})}
			>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						edge="start"
						className={clsx(classes.menuButton, {
							[classes.hide]: open
						})}
					>
						<MenuIcon />
					</IconButton>
					<Box className={classes.header}>
						<Typography variant="h6" noWrap>
							{navigation[selectedIndex]}
						</Typography>
						<Typography variant="overline" noWrap>
							{date.toLocaleTimeString()}
						</Typography>
						<Typography variant="overline" noWrap>
							{date.toLocaleDateString()}
						</Typography>
						<Typography noWrap>
							Logged in as,{' '}
							{username.charAt(0).toUpperCase() + username.slice(1)}
						</Typography>
					</Box>
				</Toolbar>
			</AppBar>
			<Drawer
				variant="permanent"
				className={clsx(classes.drawer, {
					[classes.drawerOpen]: open,
					[classes.drawerClose]: !open
				})}
				classes={{
					paper: clsx({
						[classes.drawerOpen]: open,
						[classes.drawerClose]: !open
					})
				}}
			>
				<div className={classes.toolbar}>
					<Typography variant="h5" noWrap>
						TechShack
					</Typography>
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === 'rtl' ? (
							<ChevronRightIcon />
						) : (
							<ChevronLeftIcon />
						)}
					</IconButton>
				</div>
				<Divider />
				<List>
					{navigation.map((text, index) => (
						<ListItem
							button
							key={text}
							selected={selectedIndex === index}
							onClick={(event) => handleListItemClick(event, index)}
						>
							<ListItemIcon>
								{index === 0 ? (
									<ShoppingCartIcon />
								) : index === 1 ? (
									position === 'admin' && <StoreMallDirectoryIcon />
								) : index === 2 ? (
									position === 'admin' && <ReceiptIcon />
								) : index === 3 ? (
									<PeopleIcon />
								) : (
									''
								)}
							</ListItemIcon>
							<ListItemText primary={text} />
						</ListItem>
					))}
				</List>
				<Divider />
				<List>
					<ListItem
						button
						key={'Logout'}
						onClick={() => window.location.reload()}
					>
						<ListItemIcon>
							<ExitToAppIcon />
						</ListItemIcon>
						<ListItemText primary={'Logout'} />
					</ListItem>
				</List>
				<Divider />
				<List className={classes.mode}>
					<IconButton
						value="mode"
						selected={mode}
						onClick={() => {
							setMode(!mode);
						}}
					>
						{mode ? <Brightness4Icon /> : <Brightness7Icon />}
					</IconButton>
				</List>
			</Drawer>
			<main className={classes.content}>
				<div className={classes.toolbar} />
				{selectedIndex === 0 && <MakeSale date={date} username={username} />}
				{selectedIndex === 1 && position === 'admin' ? <Inventory /> : ''}
				{selectedIndex === 2 && <SalesReport />}
				{selectedIndex === 3 && position === 'admin' ? <Users /> : ''}
			</main>
		</div>
	);
}
