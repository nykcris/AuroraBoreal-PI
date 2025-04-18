const DB_Aluno = require("../models/alunoModel");

class AuthMiddlewareAluno {

    async validar(req, res, next) {
        //valida se a cookie existe
        if(req.cookies.usuarioLogado) {
            let usuId = req.cookies.usuarioLogado;
            let usuario = new DB_Aluno();
            let arrUsuario = await usuario.listar(usuId);
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

module.exports = AuthMiddlewareAluno;