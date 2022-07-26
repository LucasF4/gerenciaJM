// Carregando Módulos
const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 8080
const knex = require('./Database/connection.js')
const bodyParser = require('body-parser')

const session = require('express-session')
const flash = require('express-flash')
const auth = require('./middleware/auth.js')

//Configurações

app.use(session({
    secret: "çasldkfjasçldk",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }
}))
app.use(flash())

app.set('views', path.join(__dirname + '/views'))
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

app.post('/vendas-pendentes', async (req, res) => {
    var { vendedor } = req.body

    console.log(vendedor)

    if(vendedor != undefined || vendedor != ''){
        var vendedorData = await knex('teste').select().where({nome_vendedor: vendedor})
        res.json({data: vendedorData})
    }
})

//Rotas
app.get('/login', (req, res) => {
    var error = req.flash("erroLogin");
    error = (error == undefined || error.length == 0) ? undefined : error
    res.render('screen/login', {error: error})
})

app.post('/login', async (req, res) => {
    var { usuario, senha } = req.body

    console.log(usuario + ' e ' + senha)

    if(usuario != undefined || usuario != '' || usuario != null || usuario.isNotEmpty){
        var user = await knex("users").select().where({usuario: usuario, senha: senha})
        if(user[0] != undefined){
            req.session.user = user[0].usuario
            console.log('Session: ' + req.session.user)
            res.redirect('/')
        }else{
            var error = `Credenciais Inválidas!`
            req.flash("erroLogin", error)
            res.render('screen/login', {error: error})
        }
    }else{
        var error = `Nenhum usuário encontrado`
        req.flash("erroLogin", error)
        res.redirect('/')
    }
})

app.get('/', auth, async (req, res) => {
    var user = await knex("teste").select()
    var vendedordata = await knex("teste").select('nome_vendedor').distinct()
    res.render('screen/home', {usuario: req.session.user, cliente: user, vender: vendedordata})
})

app.get('/logout', (req, res) => {
    req.session.user = undefined;
    var error = `Sessão Encerrada`
    req.flash("erroLogin", error)
    res.redirect('/')
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