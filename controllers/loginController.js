const PerfilModel = require("../models/perfilModel");
const UsuarioModel = require("../models/usuarioModel");

class LoginController{

    loginView(req, res){
        let perfil = new PerfilModel();
        perfil.id = 20;
        perfil.descricao = "Administrador";
        console.log(perfil.id);
        console.log(perfil.descricao);
        res.render('login.ejs', {layout: false});
    }

    async index(req, res) {
        let db_perfi = new DB_Perfil();
        let usersper = await db_perfi.listar();
        let rows = [];

        usersper.forEach(per => (
            rows.push({
                "id_perfil":per.id,
                "desc_perfil":per.nome
            })
        ))
        res.render("form_login",{ layout: false ,users:rows});
    }

    async login(req,res){
        //post
        const usuario = req.body.usuario;
        const senha = req.body.senha;
        let msg = "Usuário ou senha inválidos";
        let cor = "red";
        let usuarioModel = new UsuarioModel();
        usuarioModel = await usuarioModel.validar(usuario, senha);
        if (usuarioModel){
            res.cookie("usuarioLogado", usuarioModel.id);
            res.redirect("/");
        }

        res.render('login.ejs', {'mensagem':msg, 'color':cor, layout: false});
    }
}

module.exports = LoginController;