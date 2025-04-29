


class HomeController{
    index(req, res){
        res.render('index',{ layout: false });
    }

    acessoNegado(req, res){
        res.render('acesso_negado',{ layout: false });
    }
}






module.exports = HomeController;