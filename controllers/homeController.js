


class HomeController{
    index(req, res){
        res.render('LandingPage/index',{ layout: false });
    }

    acessoNegado(req, res){
        res.render('Sistema/acesso_negado',{ layout: false });
    }
}






module.exports = HomeController;