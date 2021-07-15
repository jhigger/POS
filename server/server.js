const express = require('express');
const cors = require('cors');
const compression = require('compression');
const minify = require('express-minify');
const path = require('path');
const open = require('open');
const db = require('./models');
const itemRouter = require('./routes/item-router');
const userRouter = require('./routes/user-router');
const saleRouter = require('./routes/sale-router');

const app = express();
// Middleware
app.use(compression());
app.use(minify());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../client/build')));
// Routes
app.use('/api', itemRouter);
app.use('/api', userRouter);
app.use('/api', saleRouter);

const port = process.env.PORT || 3001;

db.sequelize
	.sync()
	.then(() => {
		console.log('Connected to database!');
		app
			.listen(port, async () => {
				console.log(`Server running on port ${port}.`);

				if (process.env.NODE_ENV !== 'development') {
					await open(`http://localhost:${port}`);
				}
			})
			.on('error', (err) => {
				if (err.code === 'EADDRINUSE') {
					console.log(
						'Server is already running...\nCannot run multiple instance.'
					);
				} else {
					console.log(err);
				}
			});
	})
	.catch((err) => {
		console.log('Please start MySQL first!');
		if (process.env.NODE_ENV !== 'development') {
			console.log('Press any key to exit...');
			process.stdin.setRawMode(true);
			process.stdin.resume();
			process.stdin.on('data', process.exit.bind(process, 0));
		}
	});
