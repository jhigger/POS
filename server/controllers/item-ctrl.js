const db = require('../models');
const Item = db.item;
const Op = db.Sequelize.Op;

// Create and Save a new Item
exports.create = (req, res) => {
	// Validate request
	if (!req.body) {
		res.status(400).send({
			message: 'Content can not be empty!'
		});
		return;
	}

	// Create an Item
	const item = {
		item_type: req.body.item_type,
		item_description: req.body.item_description,
		quantity: req.body.quantity,
		price: req.body.price
	};

	// Save Item in the database
	Item.create(item)
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Some error occurred while creating the Item.'
			});
		});
};

// Retrieve all Items from the database.
exports.findAll = (req, res) => {
	const title = req.query.title;
	var condition = title ? {title: {[Op.like]: `%${title}%`}} : null;

	Item.findAll({where: condition})
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Some error occurred while retrieving items.'
			});
		});
};

// Find a single Item with an id
exports.findOne = (req, res) => {
	const id = req.params.id;

	Item.findByPk(id)
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Error retrieving Item with id=' + id
			});
		});
};

// Update a Item by the id in the request
exports.update = (req, res) => {
	const id = req.params.id;

	Item.update(req.body, {
		where: {item_id: id}
	})
		.then((num) => {
			if (num == 1) {
				res.send({
					message: 'Item was updated successfully.'
				});
			} else {
				res.send({
					message: `Cannot update Item with id=${id}. Maybe Item was not found or req.body has no changes to make!`
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Error updating Item with id=' + id
			});
		});
};

// Delete a Item with the specified id in the request
exports.delete = (req, res) => {
	const id = req.params.id;

	Item.destroy({
		where: {item_id: id.split(',')}
	})
		.then((num) => {
			if (num >= 1) {
				res.send({
					message: 'Item was deleted successfully!'
				});
			} else {
				res.send({
					message: `Cannot delete Item with id=${id}. Maybe Item was not found!`
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Could not delete Item with id=' + id
			});
		});
};

// Delete all Items from the database.
exports.deleteAll = (req, res) => {
	Item.destroy({
		where: {},
		truncate: false
	})
		.then((nums) => {
			res.send({message: `${nums} Items were deleted successfully!`});
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Some error occurred while removing all items.'
			});
		});
};

// Find all out of stock Items
exports.findAllOutOfStock = (req, res) => {
	Item.findAll({where: {quantity: 0}})
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Some error occurred while retrieving items.'
			});
		});
};

// Find all in stock Items
exports.findAllInStock = (req, res) => {
	Item.findAll({where: {quantity: {[Op.gt]: 0}}})
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Some error occurred while retrieving items.'
			});
		});
};

// Find Items based on type
exports.findAllByType = (req, res) => {
	const type = req.params.type;

	Item.findAll({where: {item_type: type}})
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Some error occurred while retrieving items.'
			});
		});
};
