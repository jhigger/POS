import React from 'react';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import {Paper, Typography} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import {Grid} from '@material-ui/core';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import Snackbar from '@material-ui/core/Snackbar';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import apis from '../api';

const useStyles = makeStyles((theme) => ({
	button: {
		margin: theme.spacing(1)
	},
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	paper: {
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3)
	},
	root: {
		'& > *': {
			margin: theme.spacing(1),
			width: '25ch'
		}
	},
	field: {
		margin: theme.spacing(1)
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120
	},
	selectEmpty: {
		marginTop: theme.spacing(2)
	}
}));

const initialValues = {
	user_id: '',
	username: '',
	position: ''
};

export default function UpdateButton(props) {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);
	const [openToast, setOpenToast] = React.useState(false);
	const [selectedUser, setSelectedUser] = React.useState(initialValues);

	const {users, toggleRefresh} = props;

	const handleUserChange = (event) => {
		const id = event.target.value;
		const index = users.map((user) => user.user_id).indexOf(id);
		setSelectedUser(users[index]);
	};

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleCloseToast = () => {
		setOpenToast(false);
	};

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			user_id: selectedUser?.user_id || '',
			username: selectedUser?.username || '',
			position: selectedUser?.position || ''
		},
		validationSchema: Yup.object({
			username: Yup.string().required('Required'),
			position: Yup.string().required('Required')
		}),
		onSubmit: (values) => {
			apis
				.updateUserById(selectedUser.user_id, values)
				.then(() => {
					setSelectedUser(initialValues);
					setOpenToast(true);
					toggleRefresh();
				})
				.catch((error) => {
					console.log(error);
				});
			handleClose();
		}
	});

	return (
		<span>
			<Button
				variant="contained"
				color="primary"
				className={classes.button}
				startIcon={<EditIcon />}
				onClick={handleOpen}
			>
				Update
			</Button>
			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				className={classes.modal}
				open={open}
				onClose={handleClose}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500
				}}
			>
				<Fade in={open}>
					<Paper className={classes.paper}>
						<Typography variant="h5" id="transition-modal-title" align="center">
							Edit a User
						</Typography>
						<form
							className={classes.root}
							autoComplete="off"
							onSubmit={formik.handleSubmit}
						>
							<Grid container>
								<FormControl
									variant="outlined"
									className={classes.formControl}
									fullWidth={true}
								>
									<InputLabel>ID</InputLabel>
									<Select
										value={selectedUser.user_id}
										onChange={handleUserChange}
										label="ID"
									>
										{users.map((user, index) => (
											<MenuItem key={index} value={user.user_id}>
												{user.user_id}
											</MenuItem>
										))}
									</Select>
								</FormControl>
								<Grid item>
									<TextField
										className={classes.field}
										label="Username"
										variant="outlined"
										{...formik.getFieldProps('username')}
									/>
									<TextField
										className={classes.field}
										label="Position"
										variant="outlined"
										{...formik.getFieldProps('position')}
									/>
								</Grid>
								<Button
									variant="outlined"
									className={classes.button}
									endIcon={<SaveIcon />}
									fullWidth={true}
									type="submit"
								>
									Save
								</Button>
							</Grid>
						</form>
					</Paper>
				</Fade>
			</Modal>
			<Snackbar
				anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
				open={openToast}
				onClose={handleCloseToast}
				autoHideDuration={3000}
				message="Successfully updated user"
			/>
		</span>
	);
}
