const DB_Aluno = require("../models/alunoModel");

class AuthMiddlewareAluno {

    async validar(req, res, next) {
        //valida se a cookie existe
        if(req.cookies.usuarioLogado) {
            let email = req.cookies.usuarioLogadoEmail;
            let senha = req.cookies.usuarioLogadoSenha;
            let usuario = new DB_Aluno();
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