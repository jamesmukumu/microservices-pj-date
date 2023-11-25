const dotenv = require('dotenv')
dotenv.config()


const HOST = process.env.host
const PORT = process.env.port
const ADMIN = process.env.admin
const PASSWORD = process.env.password
const DB = process.env.dbname

module.exports = {
host:HOST,
port:PORT,
admin:ADMIN,
password:PASSWORD,
database:DB



}