import { Sequelize } from "sequelize";
 
const db = new Sequelize('jwt', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});
 
export default db;