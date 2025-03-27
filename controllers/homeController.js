


class HomeController{
    index(req, res){
        res.render('index',{ layout: false });
    }
}






module.exports = HomeController;