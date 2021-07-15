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
	item_id: '',
	item_description: '',
	item_type: '',
	quantity: 0,
	price: 0
};

export default function UpdateButton(props) {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);
	const [openToast, setOpenToast] = React.useState(false);
	const [selectedItem, setSelectedItem] = React.useState(initialValues);

	const {items, toggleRefresh} = props;

	const handleItemChange = (event) => {
		const id = event.target.value;
		const index = items.map((item) => item.item_id).indexOf(id);
		setSelectedItem(items[index]);
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
			item_id: selectedItem?.item_id || '',
			item_description: selectedItem?.item_description || '',
			item_type: selectedItem?.item_type || '',
			quantity: selectedItem?.quantity || 0,
			price: selectedItem?.price || 0
		},
		validationSchema: Yup.object({
			item_description: Yup.string().required('Required'),
			item_type: Yup.string().required('Required'),
			quantity: Yup.number().required('Required').min(0).integer(),
			price: Yup.number().required('Required').min(0)
		}),
		onSubmit: (values) => {
			apis
				.updateItemById(selectedItem.item_id, values)
				.then(() => {
					setSelectedItem(initialValues);
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
							Edit an Item
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
										value={selectedItem.item_id}
										onChange={handleItemChange}
										label="ID"
									>
										{items.map((item, index) => (
											<MenuItem key={index} value={item.item_id}>
												{item.item_id}
											</MenuItem>
										))}
									</Select>
								</FormControl>
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
												? '0 or positive numbers only.'
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
												? '0 or positive numbers only.'
												: ''
										}
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
				message="Successfully updated item"
			/>
		</span>
	);
}
