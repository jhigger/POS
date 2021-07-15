import React from 'react';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import {Paper, Typography} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import {Grid} from '@material-ui/core';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Snackbar from '@material-ui/core/Snackbar';
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
	}
}));

export default function CreateButton(props) {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);
	const [openToast, setOpenToast] = React.useState(false);
	const [selectedPosition, setSelectedPosition] = React.useState('');
	const positionChoices = ['admin', 'employee'];
	const [nameTaken, setNameTaken] = React.useState(false);

	const {toggleRefresh} = props;

	const handlePositionChange = (event) => {
		setSelectedPosition(event.target.value);
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

	const handleBlur = (event) => {
		apis.getUserByUsername(event.target.value).then((user) => {
			if (user.data.length > 0) {
				setNameTaken(true);
			} else {
				setNameTaken(false);
			}
		});
	};

	const formik = useFormik({
		initialValues: {
			username: '',
			password: '',
			confirmPass: '',
			position: ''
		},
		validationSchema: Yup.object({
			username: Yup.string().required('Required'),
			password: Yup.string().required('Required'),
			confirmPass: Yup.string().oneOf([Yup.ref('password'), null]),
			position: Yup.string().required('Required')
		}),
		onSubmit: (values, {resetForm}) => {
			apis
				.insertUser(values)
				.then(() => {
					resetForm();
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
				startIcon={<AddIcon />}
				onClick={handleOpen}
			>
				Create
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
							Add New User
						</Typography>
						<form
							className={classes.root}
							autoComplete="off"
							onSubmit={formik.handleSubmit}
						>
							<Grid container>
								<Grid item>
									<TextField
										className={classes.field}
										label="Username"
										variant="outlined"
										{...formik.getFieldProps('username')}
										onBlur={handleBlur}
										error={nameTaken}
										helperText={nameTaken ? 'Username is already taken' : ''}
									/>
									<TextField
										type="password"
										className={classes.field}
										label="Password"
										variant="outlined"
										{...formik.getFieldProps('password')}
									/>
									<TextField
										type="password"
										className={classes.field}
										label="Confirm Password"
										variant="outlined"
										{...formik.getFieldProps('confirmPass')}
										error={Boolean(
											formik.touched.confirmPass && formik.errors.confirmPass
										)}
										helperText={
											formik.touched.confirmPass && formik.errors.confirmPass
												? 'Password does not match'
												: ''
										}
									/>
								</Grid>
								<FormControl
									variant="outlined"
									className={classes.formControl}
									fullWidth={true}
								>
									<InputLabel>Position</InputLabel>
									<Select
										value={selectedPosition}
										onChange={handlePositionChange}
										label="ID"
										{...formik.getFieldProps('position')}
									>
										{positionChoices.map((position, index) => (
											<MenuItem key={index} value={position}>
												{position}
											</MenuItem>
										))}
									</Select>
								</FormControl>
								<Button
									variant="outlined"
									className={classes.button}
									endIcon={<SendIcon />}
									fullWidth={true}
									type="submit"
								>
									Submit
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
				message="Successfully added new user"
			/>
		</span>
	);
}
