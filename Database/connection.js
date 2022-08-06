const knex = require('knex')({
    client: youclient,
    connection: {
        host: yourhost,
        user: youruser,
        password: yourpassword,
        database: namedatabase
    }
})

module.exports = knex
