const {Sequelize} = require("sequelize");
const sequelize = new Sequelize(process.env.PG_CONNECTION_URI);

const pg = {};
pg.Sequelize = Sequelize;
pg.sequelize = sequelize;

module.exports = pg;
