import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Paper, Typography} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {Grid} from '@material-ui/core';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import apis from '../api';
import logo from '../logo.png';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
	button: {
		margin: theme.spacing(1)
	},
	paper: {
		backgroundColor: theme.palette.background.dark,
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
	content: {
		height: '100vh',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexGrow: 1,
		padding: theme.spacing(10)
	},
	wrapper: {
		display: 'flex',
		flexGrow: 1,
		position: 'relative'
	},
	buttonProgress: {
		color: '#fff',
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginTop: -12,
		marginLeft: -12
	}
}));

const LoginPage = (props) => {
	const classes = useStyles();
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState(false);
	const [errorMessage, setErrorMessage] = React.useState(false);

	const {setLoggedIn, setUsername, setPosition} = props;

	const formik = useFormik({
		initialValues: {
			username: '',
			password: ''
		},
		validationSchema: Yup.object({
			username: Yup.string().required('Required'),
			password: Yup.string().required('Required')
		}),
		onSubmit: (values) => {
			setError(false);
			setLoading(true);
			apis
				.logUserIn(values)
				.then((res) => {
					setLoggedIn(true);
					setUsername(res.data.username);
					setPosition(res.data.position);
				})
				.catch((err) => {
					if (err.message === 'Network Error') {
						setErrorMessage('Server is offline');
					} else {
						setErrorMessage('Incorrect username/password');
					}
					setError(true);
				})
				.finally(() => setLoading(false));
		}
	});

	return (
		<main className={classes.content}>
			<Paper className={classes.paper}>
				<Box align="center">
					<img src={logo} alt="logo" />
				</Box>
				<form
					className={classes.root}
					autoComplete="off"
					onSubmit={formik.handleSubmit}
				>
					<Grid container align="center">
						<Grid item>
							<TextField
								className={classes.field}
								label="Username"
								variant="outlined"
								{...formik.getFieldProps('username')}
							/>
							<TextField
								className={classes.field}
								label="Password"
								type="password"
								variant="outlined"
								{...formik.getFieldProps('password')}
							/>
							{error && <Typography color="error">{errorMessage}</Typography>}
						</Grid>
						<div className={classes.wrapper}>
							<Button
								variant="contained"
								className={classes.button}
								fullWidth={true}
								type="submit"
								disabled={loading}
							>
								Login
							</Button>
							{loading && (
								<CircularProgress
									size={24}
									className={classes.buttonProgress}
								/>
							)}
						</div>
					</Grid>
				</form>
			</Paper>
		</main>
	);
};

export default LoginPage;
