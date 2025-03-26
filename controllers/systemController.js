const DB_Perfil = require("../models/perfilModel");
const DB_Usuarios = require("../models/usuarioModel");

class SystemController {
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

    async alunos(req,res) {
        let db_aluno = new DB_Usuarios();
        let alunos = await db_aluno.listar([3]);
        let rows = [];

        for (let i = 0; i < alunos.length; i++) {
            rows.push({
                "id_user":alunos[i].id,
                "name_user":alunos[i].nome,
                "email_user":alunos[i].email,
                "password_user":alunos[i].senha,
                "status_user":alunos[i].ativo,
                "id_perfil":alunos[i].id
            })
        }
        console.log(rows);
        res.render("alunos_index",{ layout: 'layout', rows});
    }

    direcao(req,res) {
        res.render("direcao_index",{ layout: 'layout' });
    }

    async professores(req,res) {
        let db_func = new DB_Usuarios();
        let funcs = await db_func.listar([4]);
        let rows = [];

        for (let i = 0; i < funcs.length; i++) {
            rows.push({
                "id_user":funcs[i].id,
                "name_user":funcs[i].nome,
                "email_user":funcs[i].email,
                "password_user":funcs[i].senha,
                "status_user":funcs[i].ativo,
                "id_perfil":funcs[i].perfilId
            })
        }
        console.log(rows);
        res.render("professores_index",{ layout: 'layout',rows});
    }

    async register(req,res) {
        let db_perfi = new DB_Perfil();
        let usersper = await db_perfi.listar();
        let rows = [];

        usersper.forEach(per => (
            rows.push({
                "id_user":per.id,
                "desc_user":per.nome
            })
        ))
        res.render("form_register",{ layout: 'imports_layout',rows});
    }
}



module.exports = SystemController;