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
	}
}));

export default function CreateButton(props) {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);
	const [openToast, setOpenToast] = React.useState(false);

	const {toggleRefresh} = props;

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
		initialValues: {
			item_description: '',
			item_type: '',
			quantity: '',
			price: ''
		},
		validationSchema: Yup.object({
			item_description: Yup.string().required('Required'),
			item_type: Yup.string().required('Required'),
			quantity: Yup.number().required('Required').min(0).integer(),
			price: Yup.number().required('Required').min(0)
		}),
		onSubmit: (values, {resetForm}) => {
			apis
				.insertItem(values)
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
							Add New Item
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
										label="Description"
										variant="outlined"
										{...formik.getFieldProps('item_description')}
									/>
									<TextField
										className={classes.field}
										label="Type"
										variant="outlined"
										{...formik.getFieldProps('item_type')}
									/>
									<TextField
										className={classes.field}
										label="Quantity"
										variant="outlined"
										{...formik.getFieldProps('quantity')}
										error={Boolean(
											formik.touched.quantity && formik.errors.quantity
										)}
										helperText={
											formik.touched.quantity && formik.errors.quantity
												? 'Enter a positive number.'
												: ''
										}
									/>
									<TextField
										className={classes.field}
										label="Price"
										variant="outlined"
										{...formik.getFieldProps('price')}
										error={Boolean(formik.touched.price && formik.errors.price)}
										helperText={
											formik.touched.price && formik.errors.price
												? 'Enter a positive number.'
												: ''
										}
									/>
								</Grid>
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
				message="Successfully added new item"
			/>
		</span>
	);
}
