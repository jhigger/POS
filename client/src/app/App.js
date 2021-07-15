import React from 'react';
import Navigation from '../components/Navigation';
import LoginPage from '../components/LoginPage';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CssBaseline from '@material-ui/core/CssBaseline';
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';

function App() {
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
	const [mode, setMode] = React.useState(!prefersDarkMode);

	const theme = React.useMemo(
		() =>
			createMuiTheme({
				palette: {
					type: mode ? 'dark' : 'light'
				}
			}),
		[mode]
	);

	const [loggedIn, setLoggedIn] = React.useState(false);
	const [username, setUsername] = React.useState('');
	const [position, setPosition] = React.useState('');

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{loggedIn ? (
				<Navigation
					username={username}
					position={position}
					mode={mode}
					setMode={setMode}
				/>
			) : (
				<LoginPage
					setLoggedIn={setLoggedIn}
					setUsername={setUsername}
					setPosition={setPosition}
				/>
			)}
		</ThemeProvider>
	);
}

export default App;
