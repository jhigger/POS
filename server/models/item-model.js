module.exports = (sequelize, DataTypes) => {
	const Item = sequelize.define(
		'item',
		{
			item_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			item_type: {
				type: DataTypes.STRING,
				allowNull: false
			},
			item_description: {
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
			}
		},
		{
			initialAutoIncrement: 1000,
			timestamps: false
		}
	);

	return Item;
};
