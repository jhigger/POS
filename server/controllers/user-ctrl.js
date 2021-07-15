const db = require('../models');
const bcrypt = require('bcrypt');

const User = db.user;
const Op = db.Sequelize.Op;

// Create and Save a new User
exports.create = (req, res) => {
	// Validate request
	if (!req.body) {
		res.status(400).send({
			message: 'Content can not be empty!'
		});
		return;
	}

	// Create an User
	const user = {
		username: req.body.username,
		password: bcrypt.hashSync(req.body.password, 10),
		position: req.body.position
	};

	// Save User in the database
	User.create(user)
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Some error occurred while creating the User.'
			});
		});
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
	const title = req.query.title;
	var condition = title ? {title: {[Op.like]: `%${title}%`}} : null;

	User.findAll({where: condition})
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Some error occurred while retrieving users.'
			});
		});
};

// Find a single User with an id
exports.findById = (req, res) => {
	const id = req.params.id;

	User.findByPk(id)
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Error retrieving User with id=' + id
			});
		});
};

// Update a User by the id in the request
exports.update = (req, res) => {
	const id = req.params.id;

	User.update(req.body, {
		where: {user_id: id}
	})
		.then((num) => {
			if (num == 1) {
				res.send({
					message: 'User was updated successfully.'
				});
			} else {
				res.send({
					message: `Cannot update User with id=${id}. Maybe User was not found or req.body has no changes to make!`
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Error updating User with id=' + id
			});
		});
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
	const id = req.params.id;

	User.destroy({
		where: {user_id: id.split(',')}
	})
		.then((num) => {
			if (num >= 1) {
				res.send({
					message: 'User was deleted successfully!'
				});
			} else {
				res.send({
					message: `Cannot delete User with id=${id}. Maybe User was not found!`
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Could not delete User with id=' + id
			});
		});
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
	User.destroy({
		where: {},
		truncate: false
	})
		.then((nums) => {
			res.send({message: `${nums} Users were deleted successfully!`});
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Some error occurred while removing all users.'
			});
		});
};

// Find all admin Users
exports.findAllAdmin = (req, res) => {
	User.findAll({where: {position: 'admin'}})
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Some error occurred while retrieving users.'
			});
		});
};

// Find all employee Users
exports.findAllEmployee = (req, res) => {
	User.findAll({where: {position: 'employee'}})
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Some error occurred while retrieving users.'
			});
		});
};

// Authenticate Users
exports.login = (req, res) => {
	//Check if user is already in DB
	User.findAll({where: {username: req.body.username}})
		.then((user) => {
			if (!user || !user.length)
				return res.status(400).send('User does not exist');
			//Validate password
			const validPass = bcrypt.compareSync(
				req.body.password,
				user[0].dataValues.password
			);
			if (!validPass) return res.status(400).send('Invalid Password');

			res.send({
				username: user[0].dataValues.username,
				position: user[0].dataValues.position
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

// Find User by username
exports.findByUsername = (req, res) => {
	const username = req.params.username;

	User.findAll({where: {username: username}})
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Could not fine User with username=' + username
			});
		});
};
