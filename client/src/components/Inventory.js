import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {lighten, makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import RefreshIcon from '@material-ui/icons/Refresh';
import apis from '../api';
import DeleteItemButton from './DeleteItemButton';
import UpdateItemButton from './UpdateItemButton';
import CreateItemButton from './CreateItemButton';
import Snackbar from '@material-ui/core/Snackbar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function getComparator(order, orderBy) {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

const headCells = [
	{
		id: 'item_id',
		alignRight: false,
		disablePadding: true,
		label: 'ID'
	},
	{
		id: 'item_description',
		alignRight: true,
		disablePadding: false,
		label: 'Description'
	},
	{id: 'item_type', alignRight: true, disablePadding: false, label: 'Type'},
	{id: 'quantity', alignRight: true, disablePadding: false, label: 'Quantity'},
	{id: 'price', alignRight: true, disablePadding: false, label: 'Price'}
];

function EnhancedTableHead(props) {
	const {
		classes,
		onSelectAllClick,
		order,
		orderBy,
		numSelected,
		rowCount,
		onRequestSort
	} = props;
	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox">
					<Checkbox
						indeterminate={numSelected > 0 && numSelected < rowCount}
						checked={rowCount > 0 && numSelected === rowCount}
						onChange={onSelectAllClick}
						inputProps={{'aria-label': 'select all items'}}
					/>
				</TableCell>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.alignRight ? 'right' : 'left'}
						padding={headCell.disablePadding ? 'none' : 'default'}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<span className={classes.visuallyHidden}>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</span>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

EnhancedTableHead.propTypes = {
	classes: PropTypes.object.isRequired,
	numSelected: PropTypes.number.isRequired,
	onRequestSort: PropTypes.func.isRequired,
	onSelectAllClick: PropTypes.func.isRequired,
	order: PropTypes.oneOf(['asc', 'desc']).isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired
};

const useToolbarStyles = makeStyles((theme) => ({
	root: {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(1)
	},
	highlight:
		theme.palette.type === 'light'
			? {
					color: theme.palette.secondary.main,
					backgroundColor: lighten(theme.palette.secondary.light, 0.85)
			  }
			: {
					color: theme.palette.text.primary,
					backgroundColor: theme.palette.secondary.dark
			  },
	title: {
		flex: '1 1 100%'
	},
	search: {
		flex: '1 1 100%'
	},
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
	}
}));

const EnhancedTableToolbar = (props) => {
	const classes = useToolbarStyles();
	const {
		numSelected,
		toggleRefresh,
		selected,
		handleUnselect,
		options,
		query,
		setQuery,
		handleSubmit
	} = props;

	const [openToast, setOpenToast] = React.useState(false);

	const handleCloseToast = () => {
		setOpenToast(false);
	};

	const handleOpenToast = () => {
		setOpenToast(true);
	};

	return (
		<Toolbar
			className={clsx(classes.root, {
				[classes.highlight]: numSelected > 0
			})}
		>
			{numSelected > 0 ? (
				<Typography
					className={classes.title}
					color="inherit"
					variant="subtitle1"
					component="div"
				>
					{numSelected} selected
				</Typography>
			) : (
				<>
					<Typography
						className={classes.title}
						variant="h6"
						id="tableTitle"
						component="div"
					>
						Items
					</Typography>
					<Box className={classes.search} variant="h6" component="div">
						<form
							className={classes.form}
							onSubmit={(event) => handleSubmit(event)}
						>
							<Autocomplete
								options={options}
								getOptionLabel={(option) => option.item_description}
								getOptionSelected={(option, value) =>
									option.value === value.value
								}
								style={{width: 300}}
								className={classes.field}
								onChange={(event, value) => {
									if (value === null) {
										setQuery('');
										toggleRefresh();
									} else setQuery(value);
								}}
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
								size="small"
							/>
							<Button
								className={classes.button}
								variant="contained"
								color="primary"
								type="submit"
								disabled={Object.keys(query).length === 0}
								size="small"
							>
								Search
							</Button>
						</form>
					</Box>
				</>
			)}

			{numSelected > 0 ? (
				<>
					<DeleteItemButton
						selected={selected}
						handleUnselect={handleUnselect}
						toggleRefresh={toggleRefresh}
						handleOpenToast={handleOpenToast}
					/>
				</>
			) : (
				<Tooltip title="Refresh">
					<IconButton aria-label="refresh" onClick={toggleRefresh}>
						<RefreshIcon />
					</IconButton>
				</Tooltip>
			)}
			<Snackbar
				anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
				open={openToast}
				onClose={handleCloseToast}
				autoHideDuration={3000}
				message="Successfully deleted item(s)"
			/>
		</Toolbar>
	);
};

EnhancedTableToolbar.propTypes = {
	numSelected: PropTypes.number.isRequired
};

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%'
	},
	paper: {
		width: '100%',
		marginBottom: theme.spacing(2)
	},
	table: {
		minWidth: 750
	},
	visuallyHidden: {
		border: 0,
		clip: 'rect(0 0 0 0)',
		height: 1,
		margin: -1,
		overflow: 'hidden',
		padding: 0,
		position: 'absolute',
		top: 20,
		width: 1
	}
}));

export default function Inventory() {
	const classes = useStyles();
	const [order, setOrder] = React.useState('asc');
	const [orderBy, setOrderBy] = React.useState('item_id');
	const [selected, setSelected] = React.useState([]);
	const [page, setPage] = React.useState(0);
	const [dense, setDense] = React.useState(false);
	const [unavailable, setUnavailable] = React.useState(false);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const [rows, setRows] = React.useState([]);
	const [options, setOptions] = React.useState([]);
	const [refresh, setRefresh] = React.useState(true);
	const [query, setQuery] = React.useState({});

	React.useEffect(() => {
		if (unavailable) {
			apis
				.getAllOutOfStock()
				.then((items) => {
					setRows(items.data);
				})
				.catch((error) => {
					console.log(error);
				});
		} else {
			apis
				.getAllItems()
				.then((items) => {
					setRows(items.data);
					setOptions(items.data);
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}, [refresh, unavailable]);

	const handleUnselect = () => {
		setSelected([]);
	};

	const toggleRefresh = () => {
		setRefresh(!refresh);
	};

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelected = rows.map((n) => n.item_id);
			setSelected(newSelected);
			return;
		}
		setSelected([]);
	};

	const handleClick = (event, item_id) => {
		const selectedIndex = selected.indexOf(item_id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, item_id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1)
			);
		}

		setSelected(newSelected);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleChangeDense = (event) => {
		setDense(event.target.checked);
	};

	const handleUnavailable = (event) => {
		setUnavailable(event.target.checked);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		setRows([query]);
	};

	const isSelected = (item_id) => selected.indexOf(item_id) !== -1;

	const emptyRows =
		rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

	return (
		<div className={classes.root}>
			<Paper className={classes.paper}>
				<EnhancedTableToolbar
					numSelected={selected.length}
					toggleRefresh={toggleRefresh}
					selected={selected}
					handleUnselect={handleUnselect}
					options={options}
					query={query}
					setQuery={setQuery}
					handleSubmit={handleSubmit}
				/>
				<TableContainer>
					<Table
						className={classes.table}
						aria-labelledby="tableTitle"
						size={dense ? 'small' : 'medium'}
						aria-label="enhanced table"
					>
						<EnhancedTableHead
							classes={classes}
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={handleRequestSort}
							rowCount={rows.length}
						/>
						<TableBody>
							{stableSort(rows, getComparator(order, orderBy))
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((row, index) => {
									const isItemSelected = isSelected(row.item_id);
									const labelId = `enhanced-table-checkbox-${index}`;

									return (
										<TableRow
											hover
											onClick={(event) => handleClick(event, row.item_id)}
											role="checkbox"
											aria-checked={isItemSelected}
											tabIndex={-1}
											key={row.item_id}
											selected={isItemSelected}
										>
											<TableCell padding="checkbox">
												<Checkbox
													checked={isItemSelected}
													inputProps={{'aria-labelledby': labelId}}
												/>
											</TableCell>
											<TableCell
												component="th"
												id={labelId}
												scope="row"
												padding="none"
											>
												{row.item_id}
											</TableCell>
											<TableCell align="right">
												{row.item_description}
											</TableCell>
											<TableCell align="right">{row.item_type}</TableCell>
											<TableCell align="right">{row.quantity}</TableCell>
											<TableCell align="right">{row.price}</TableCell>
										</TableRow>
									);
								})}
							{emptyRows > 0 && (
								<TableRow style={{height: (dense ? 33 : 53) * emptyRows}}>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25, 50, 100]}
					component="div"
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</Paper>
			<FormControlLabel
				control={<Switch checked={dense} onChange={handleChangeDense} />}
				label="Dense padding"
			/>
			<FormControlLabel
				control={<Switch checked={unavailable} onChange={handleUnavailable} />}
				label="Show out of stock only"
			/>
			<UpdateItemButton items={options} toggleRefresh={toggleRefresh} />
			<CreateItemButton toggleRefresh={toggleRefresh} />
		</div>
	);
}
