const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: '29051996',
        database: 'postgres'
    }
})

module.exports = knex