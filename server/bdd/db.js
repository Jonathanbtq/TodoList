const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize(
    'todolist',
    'root',
    '',
    {
        host: 'localhost',
        dialect: 'mysql',
    }
)

sequelize.authenticate()
    .then(_=> console.log('La connexion'))
    .catch(error => console.error(`Impossible de se connecter à la base de données ${error}`))

// sync accomplie synchronise tout les models sequelize avec la bdd
sequelize.sync()
.then(_ => console.log('La base de données "todolist" a bien été synchronisée'))

module.exports = sequelize
