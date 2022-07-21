const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 8080
const knex = require('./Database/connection.js')
const bodyParser = require('body-parser')

app.set('views', path.join(__dirname + '/views'))
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

app.post('/vendas-pendentes', async (req, res) => {
    var { vendedor } = req.body

    console.log(vendedor)

    if(vendedor != undefined || vendedor != ''){
        var vendedorData = await knex('users').select().where({vendedor: vendedor})
        res.json({data: vendedorData})
    }
})

app.get('/', (req, res) => {
    var error;
    res.render('screen/login', {error: error})
})

app.post('/login', async (req, res) => {
    var { usuario, senha } = req.body
    var error = `Credenciais Inválidas!`

    console.log(usuario + ' e ' + senha)

    if(usuario != undefined || usuario != '' || usuario != null || usuario.isNotEmpty){
        var user = await knex("persons").select().where({usuario: usuario, senha: senha})
        if(user[0] != undefined){
            var user = await knex("users").select()
            var vendedordata = await knex("users").select('vendedor').distinct()
            res.render('screen/home', {usuario: usuario, cliente: user, vender: vendedordata})
        }else{
            res.render('screen/login', {error: error})
        }
    }else{
        res.redirect('/')
    }
})

/* app.get('/home', async (req, res) => {
    console.log('Realizando consulta no banco...')
    var user = await knex("users").select()
    var vendedordata = await knex("users").select('vendedor').distinct()
    console.log(vendedordata)
    console.log(user)
    res.render('screen/home', {cliente: user, vender: vendedordata})
}) */

app.listen(PORT, () =>{
    console.log('Servidor rodando na porta: ' + PORT)
})