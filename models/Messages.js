module.exports = (sequelize, DataTypes) => {
    const Messages = sequelize.define("Messages", {
        fromUserId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fromUsername: {
            type: DataTypes.STRING,
            allowNull: false
        },
        topic: {
            type: DataTypes.STRING,
            allowNull: true
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false
        },
        forUsername: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    return Messages
};