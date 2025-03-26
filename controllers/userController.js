const DB_Perfil = require("../models/perfilModel");
const DB_Usuarios = require("../models/usuarioModel");
const { use } = require("../routes/homeRoute");
const DB = require("../utils/database");
const db = new DB();


class userController{

    async cadastrar(req, res){
        let db_perfi = new DB_Perfil();
        let usersper = await db_perfi.listar();
        let rows = [];

        usersper.forEach(per => (
            rows.push({
                "id_perfil":per.id,
                "desc_perfil":per.nome
            })
        ))
        res.render("./gerenciarUsuarios/cadastrarUsuario",{ layout: 'layout',rows});
    }

    async index(req, res){
        res.render("user_index",{ layout: 'layout' });
    }

    async listar(req, res){
        let db_usuario = new DB_Usuarios();
        let users = await db_usuario.listar();
        let rows = [];

        users.forEach(user => (
            rows.push({
                "id_user":user.id,
                "name_user":user.nome,
                "email_user":user.email,
                "status_user":user.ativo,
                "id_perfil":user.perfilId
            })
        ))
        res.render("listarUsuarios",{ layout: 'layout',rows});
    }

    async gravar(req, res){
        let db_usuario = new DB_Usuarios();
        let user = new DB_Usuarios(0,req.body.name_user,req.body.email_user,req.body.password_user,1,req.body.id_perfil);
        let sucesso = await db_usuario.gravar(user);

        if(sucesso){
            res.redirect("/system/users");
        } else {
            res.send("Erro ao gravar usuario");
        }
    }

    async editar(req, res){
        let db_usuario = new DB_Usuarios();
        let user = await db_usuario.listar(req.params.id);

        if(user){
            res.render("editar_user",{ layout: false,user});
        } else {
            res.send("Usuario nao encontrado");
        }
    }

    async atualizar(req, res){
        let db_usuario = new DB_Usuarios();
        let user = new DB_Usuarios(req.body.id_user,req.body.name_user,req.body.email_user,req.body.password_user,req.body.status_user,req.body.id_perfil);
        let sucesso = await db_usuario.atualizar(user);

        if(sucesso){
            res.redirect("/system/users");
        } else {
            res.send("Erro ao atualizar usuario");
        }
    }

    async excluir(req, res){
        let db_usuario = new DB_Usuarios();
        let sucesso = await db_usuario.excluir(req.params.id);

        if(sucesso){
            res.redirect("/system/users");
        } else {
            res.send("Erro ao excluir usuario");
        }
    }

}

module.exports = userController;