const DB_Direcao = require("../models/direcaoModel");

class AuthMiddlewareAluno {

    async validar(req, res, next) {
        //valida se a cookie existe
        if(req.cookies.usuarioLogado) {
            let email = req.cookies.usuarioLogadoEmail;
            let senha = req.cookies.usuarioLogadoSenha;
            let usuario = new DB_Direcao();
            let arrUsuario = await usuario.validar(email, senha);
            //valida se o usuario existe no banco
            if(typeof arrUsuario != 'undefined') {
                
                next();
                
              
            }
            else
                res.redirect("/acessoNegado");
 
        }
        else
            res.redirect("/acessoNegado");

    } 
}

module.exports = AuthMiddlewareAluno;