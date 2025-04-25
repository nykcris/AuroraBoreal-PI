const DB_Professor = require("../models/professorModel");


class AuthMiddlewareProfessor {

    async validar(req, res, next) {
        //valida se a cookie existe
        if(req.cookies.usuarioLogado) {
            let email = req.cookies.usuarioLogadoEmail;
            let senha = req.cookies.usuarioLogadoSenha;
            let usuario = new DB_Professor();
            let arrUsuario = await usuario.validar(email, senha);

            console.log(arrUsuario);
            console.log(email);
            console.log(senha);
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

module.exports = AuthMiddlewareProfessor;