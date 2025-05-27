


class HomeController{
    index(req, res){
        res.render('LandingPage/index',{ layout: 'layouts/layout_landing' });
    }

    acessoNegado(req, res){
        res.render('Sistema/acesso_negado',{ layout: false });
    }
}






module.exports = HomeController;