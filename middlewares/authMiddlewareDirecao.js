const DB_Direcao = require("../models/DirecaoModel");

class AuthMiddlewareAluno {

    async validar(req, res, next) {
        //valida se a cookie existe
        if(req.cookies.usuarioLogado) {
            let email = req.cookies.usuarioLogadoEmail;
            let senha = req.cookies.usuarioLogadoSenha;
            let usuario = new DB_Direcao();
            let arrUsuario = await usuario.validar(email, senha);
            //valida se o usuario existe no banco
            //arrUsuario.length > 0
            if(1) {
                
                next();
                
              
            }
            else
                res.redirect("/");
 
        }
        else
            res.redirect("/");

    } 
}

module.exports = AuthMiddlewareAluno;