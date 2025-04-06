const UsuarioModel = require("../models/usuarioModel");


class AuthMiddleware {

    async validar(req, res, next) {
        console.log("Cookies recebidos no middleware:", req.cookies);
        console.log("Passou pelo middleware de autenticação");
        //valida se a cookie existe
        if(req.cookies.usuarioLogado) {
            let usuId = req.cookies.usuarioLogado;
            let usuario = new UsuarioModel();
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

module.exports = AuthMiddleware;