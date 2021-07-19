module.exports = (sequelize, DataTypes) => {
	const Sale = sequelize.define(
		'sale',
		{
			sale_no: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			receipt_no: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			cashier: {
				type: DataTypes.STRING,
				allowNull: false
			},
			item: {
				type: DataTypes.STRING,
				allowNull: false
			},
			quantity: {
				type: DataTypes.INTEGER,
				allowNull: false
			},
			price: {
				type: DataTypes.DOUBLE,
				allowNull: false
			},
			payment: {
				type: DataTypes.DOUBLE,
				allowNull: false
			}
		},
		{
			initialAutoIncrement: 1000,
			timestamps: true,
			createdAt: DataTypes.DATE,
			createdAt: 'date',
			updatedAt: false
		}
	);

	return Sale;
};
