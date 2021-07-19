const db = require('../models');
const Sale = db.sale;
const Op = db.Sequelize.Op;

// Create and Save a new Sale
exports.create = (req, res) => {
	// Validate request
	if (!req.body) {
		res.status(400).send({
			message: 'Content can not be empty!'
		});
		return;
	}

	// Create an Sale
	const sale = {
		receipt_no: req.body.receipt_no,
		cashier: req.body.cashier,
		item: req.body.item,
		quantity: req.body.quantity,
		price: req.body.price,
		payment: req.body.payment
	};

	// Save Sale in the database
	Sale.create(sale)
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Some error occurred while creating the Sale.'
			});
		});
};

// Retrieve all Sales from the database.
exports.findAll = (req, res) => {
	const title = req.query.title;
	var condition = title ? {title: {[Op.like]: `%${title}%`}} : null;

	Sale.findAll({where: condition})
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Some error occurred while retrieving sales.'
			});
		});
};

// Find a single Sale with an id
exports.findById = (req, res) => {
	const id = req.params.id;

	Sale.findByPk(id)
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Error retrieving Sale with id=' + id
			});
		});
};

// Update a Sale by the id in the request
exports.update = (req, res) => {
	const id = req.params.id;

	Sale.update(req.body, {
		where: {sale_id: id}
	})
		.then((num) => {
			if (num == 1) {
				res.send({
					message: 'Sale was updated successfully.'
				});
			} else {
				res.send({
					message: `Cannot update Sale with id=${id}. Maybe Sale was not found or req.body has no changes to make!`
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Error updating Sale with id=' + id
			});
		});
};

// Delete a Sale with the specified id in the request
exports.delete = (req, res) => {
	const id = req.params.id;

	Sale.destroy({
		where: {sale_no: id.split(',')}
	})
		.then((num) => {
			if (num >= 1) {
				res.send({
					message: 'Sale was deleted successfully!'
				});
			} else {
				res.send({
					message: `Cannot delete Sale with id=${id}. Maybe Sale was not found!`
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message: 'Could not delete Sale with id=' + id
			});
		});
};

// Delete all Sales from the database.
exports.deleteAll = (req, res) => {
	Sale.destroy({
		where: {},
		truncate: false
	})
		.then((nums) => {
			res.send({message: `${nums} Sales were deleted successfully!`});
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Some error occurred while removing all sales.'
			});
		});
};

// Find last receipt number
exports.findLastReceiptNumber = (req, res) => {
	Sale.max('receipt_no')
		.then((max) => {
			res.send(JSON.stringify({max: max}));
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Some error occurred while retrieving sales.'
			});
		});
};
