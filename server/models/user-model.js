module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define(
		'user',
		{
			user_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false
			},
			position: {
				type: DataTypes.STRING,
				allowNull: false
			}
		},
		{
			initialAutoIncrement: 1000,
			timestamps: false
		}
	);

	return User;
};
