module.exports = (Sequelize, DataTypes) => {
    return Sequelize.define('Task', {
        task: {
            type: DataTypes.STRING,
            allowNull: false
        },
        done: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        order: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        }
    })
}