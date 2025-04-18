const DB_Professor = require("../models/professorModel");


class AuthMiddlewareProfessor {

    async validar(req, res, next) {
        //valida se a cookie existe
        if(req.cookies.usuarioLogado) {
            let usuId = req.cookies.usuarioLogado;
            let usuario = new DB_Professor();
            let arrUsuario = await usuario.obter(usuId);
            //valida se o usuario existe no banco
            if(arrUsuario.length > 0) {
                
                next();
                
              
            }
            else
                res.redirect("/");
 
        }
        else
            res.redirect("/");

    } 
}

module.exports = AuthMiddlewareProfessor;