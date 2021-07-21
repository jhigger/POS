import React from 'react';
import {withStyles, makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import apis from '../api';
import {Box, Typography} from '@material-ui/core';
import logo from '../logo.png';
import ReactToPrint from 'react-to-print';

const StyledTableCell = withStyles((theme) => ({
	head: {
		backgroundColor: theme.palette.text.secondary,
		color: theme.palette.background.default
	},
	body: {
		fontSize: 14
	}
}))(TableCell);

const useStyles = makeStyles((theme) => ({
	button: {
		margin: theme.spacing(0, 0, 0, 1)
	},
	form: {
		display: 'flex',
		flexDirection: 'row',
		margin: theme.spacing(1, 0)
	},
	field: {
		flexGrow: 1
	},
	option: {
		fontSize: 15,
		'& > span': {
			marginRight: 10,
			fontSize: 18
		}
	},
	root: {
		display: 'flex'
	},
	leftSide: {
		minWidth: '50%'
	},
	rightSide: {
		display: 'flex',
		flexDirection: 'column',
		margin: theme.spacing(1),
		minWidth: '50%'
	},
	header: {
		display: 'flex',
		flexDirection: 'row'
	},
	headerItem: {
		flexGrow: 1
	},
	receipt: {
		display: 'flex',
		flexDirection: 'column',
		padding: theme.spacing(3),
		minHeight: '75vh'
	}
}));

export default function CustomizedTables(props) {
	const classes = useStyles();
	const [rows, setRows] = React.useState([]);
	const [cart, setCart] = React.useState([]);
	const [newItem, setNewItem] = React.useState({});
	const [total, setTotal] = React.useState(0);
	const [payment, setPayment] = React.useState(0);
	const [receipt, setReceipt] = React.useState(0);
	const [checkout, setCheckout] = React.useState(false);

	const {date, username} = props;

	const componentRef = React.useRef();

	React.useEffect(() => {
		handleRefresh();
	}, []);

	const handleRefresh = () => {
		apis
			.getAllInStock()
			.then((items) => {
				setRows(items.data);
			})
			.catch((error) => {
				console.log(error);
			});

		apis
			.getLastReceiptNumber()
			.then((data) => {
				if (data.data.max === null) {
					setReceipt(1000);
				} else {
					setReceipt(data.data.max + 1);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleAdd = (index) => {
		const rowIndex = rows.indexOf(newItem);

		if (rows[rowIndex].quantity > cart[index].quantity) {
			cart[index].quantity++;
		}
		handleSubtotal();
	};

	const handleRemove = (index) => {
		if (cart[index].quantity > 1) cart[index].quantity--;
		else {
			delete cart[index];
		}
		handleSubtotal();
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		const ids = cart.map((item) => item.item_id);

		if (ids.includes(newItem.item_id)) {
			const index = ids.indexOf(newItem.item_id);
			handleAdd(index);
		} else {
			const item = JSON.parse(JSON.stringify(newItem));
			item.quantity = 1;
			cart.push(item);
		}
		handleSubtotal();
	};

	const handleSubtotal = () => {
		const prices = cart.map((item) => item.price * item.quantity);
		const subtotal = prices.reduce((acc, val) => acc + val, 0);
		setTotal(subtotal);
	};

	const handlePay = (event) => {
		event.preventDefault();

		if (payment >= total) {
			cart.forEach((item) => {
				const payload = {
					receipt_no: receipt,
					cashier: username,
					item: item.item_description,
					quantity: item.quantity,
					price: item.price,
					payment: payment
				};

				apis.insertSale(payload).catch((error) => {
					console.log(error);
				});

				const ids = rows.map((row) => row.item_id);
				const index = ids.indexOf(item.item_id);
				const quantity = rows[index].quantity;

				const update = {
					quantity: quantity - 1
				};

				apis.updateItemById(item.item_id, update).catch((error) => {
					console.log(error);
				});
			});
		}
	};

	const handleAfterPrint = () => {
		setCart([]);
		setTotal(0);
		setPayment(0);
		setCheckout(!checkout);
		handleRefresh();
	};

	return (
		<main className={classes.root}>
			<Box className={classes.leftSide}>
				<form
					className={classes.form}
					onSubmit={(event) => handleSubmit(event)}
				>
					<Autocomplete
						key={checkout}
						options={rows}
						getOptionLabel={(option) => option.item_description}
						getOptionSelected={(option, value) => option.value === value.value}
						style={{width: 300}}
						className={classes.field}
						onChange={(event, value) => setNewItem(value !== null ? value : '')}
						classes={{
							option: classes.option
						}}
						renderOption={(option) => (
							<React.Fragment>
								<span>({option.item_id})</span>
								{option.item_description}
							</React.Fragment>
						)}
						renderInput={(params) => (
							<TextField {...params} label="Products" variant="outlined" />
						)}
					/>
					<Button
						className={classes.button}
						variant="contained"
						color="primary"
						type="submit"
						disabled={Object.keys(newItem).length === 0}
					>
						Add Item
					</Button>
				</form>
				<TableContainer component={Paper}>
					<Table aria-label="customized table">
						<TableHead>
							<TableRow>
								<StyledTableCell>Item</StyledTableCell>
								<StyledTableCell align="right">Price</StyledTableCell>
								<StyledTableCell align="right">Quantity</StyledTableCell>
								<StyledTableCell align="right"></StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{cart.map((row, index) => (
								<TableRow key={index}>
									<StyledTableCell component="th" scope="row">
										{row.item_description}
									</StyledTableCell>
									<StyledTableCell align="right">{row.price}</StyledTableCell>
									<StyledTableCell align="right">
										{row.quantity}
									</StyledTableCell>
									<StyledTableCell align="right">
										<IconButton
											className={classes.button}
											size="small"
											color="secondary"
											aria-label="remove"
											onClick={() => handleRemove(index)}
										>
											<RemoveIcon />
										</IconButton>
										<IconButton
											className={classes.button}
											size="small"
											aria-label="add"
											onClick={() => handleAdd(index)}
										>
											<AddIcon />
										</IconButton>
									</StyledTableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
			<Box className={classes.rightSide}>
				<Paper className={classes.receipt} ref={componentRef}>
					<Box align="center">
						<img src={logo} alt="logo" />
					</Box>
					<Typography variant="overline" align="center">
						Receipt {receipt}
					</Typography>
					<Typography variant="overline" align="center">
						date: {date.toLocaleDateString()}
					</Typography>
					<Typography variant="overline" align="center">
						cashier: {username}
					</Typography>
					<Typography variant="overline" align="center">
						<hr />
					</Typography>
					<Box className={classes.header}>
						<Typography
							variant="overline"
							align="left"
							className={classes.headerItem}
						>
							Item
						</Typography>
						<Typography variant="overline" align="right">
							Price | QTY | Total
						</Typography>
					</Box>
					<Typography variant="overline" align="center">
						<hr />
					</Typography>
					{cart.map((item, index) => (
						<Box key={index} className={classes.header}>
							<Typography
								variant="overline"
								align="left"
								className={classes.headerItem}
							>
								{item.item_description}
							</Typography>
							<Typography variant="overline" align="right">
								{item.price} x {item.quantity} = {item.price * item.quantity}
							</Typography>
						</Box>
					))}
					<Typography variant="overline" align="right">
						<hr />
						subtotal: P {total}
					</Typography>
					<Typography variant="overline" align="right">
						payment: P {payment}
					</Typography>
					<Typography variant="overline" align="right">
						change: P {payment - total}
					</Typography>
				</Paper>
				<form className={classes.form} onSubmit={(event) => handlePay(event)}>
					<TextField
						className={classes.field}
						label="Payment"
						variant="outlined"
						value={payment}
						onChange={(event) => setPayment(event.target.value)}
					/>
					<ReactToPrint
						trigger={() => (
							<Button
								className={classes.button}
								variant="contained"
								color="primary"
								type="submit"
								disabled={payment < total || total === 0}
							>
								Checkout
							</Button>
						)}
						content={() => componentRef.current}
						onAfterPrint={handleAfterPrint}
					/>
				</form>
			</Box>
		</main>
	);
}
