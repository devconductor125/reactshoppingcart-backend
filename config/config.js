require('dotenv').config();
const config = {
    jwtSecret: process.env.JWT_SECRET || 'secret',
    database: {
        dbname: process.env.DATABASE_NAME || 'reactshoppingcart',
        username: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        dialect: 'mysql',
    },
    serverPort: process.env.SERVER_PORT || 8080
};

module.exports = config;