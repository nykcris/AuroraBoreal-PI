


class HomeController{
    index(req, res){
        res.render('index',{ layout: 'imports_layout' });
    }
}






module.exports = HomeController;