function auth(req, res, next){
    if(req.session.user != undefined){
        console.log(req.session)
        next()
    }else{
        console.log("Cai aqui")
        res.redirect('/login')
    }
}

module.exports = auth