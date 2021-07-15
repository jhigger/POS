import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import apis from '../api';

export default function AlertDialog(props) {
	const [open, setOpen] = React.useState(false);

	const {handleOpenToast, selected, handleUnselect, toggleRefresh} = props;

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleDelete = () => {
		apis
			.deleteItemById(selected)
			.then(() => {
				handleOpenToast();
				toggleRefresh();
				handleUnselect();
			})
			.catch((error) => {
				console.log(error);
			});
		handleClose();
	};

	return (
		<>
			<Tooltip title="Delete">
				<IconButton aria-label="delete" onClick={handleClickOpen}>
					<DeleteIcon />
				</IconButton>
			</Tooltip>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{'Please confirm'}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Item(s) will be deleted. Are you sure?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDelete} color="secondary" variant="outlined">
						Delete
					</Button>
					<Button
						onClick={handleClose}
						variant="contained"
						disableElevation
						autoFocus
					>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
