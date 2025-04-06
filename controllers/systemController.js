const DB_Perfil = require("../models/perfilModel");
const DB_Usuarios = require("../models/usuarioModel");

class SystemController {
    async index(req, res) {
        let db_perfi = new DB_Perfil();
        let usersper = await db_perfi.listar();
        let rows = [];

        usersper.forEach(per => (
            rows.push({
                "per_id":per.id,
                "per_descricao":per.descricao
            })
        ))
        res.render("form_login",{ layout: false ,users:rows});
    }

    async alunos(req,res) {
        console.log("Entrou na página de alunos");
        let db_aluno = new DB_Usuarios();
        let alunos = await db_aluno.listar([1]);
        let rows = [];

        for (let i = 0; i < alunos.length; i++) {
            rows.push({
                "usu_id":alunos[i].id,
                "usu_nome":alunos[i].nome,
                "email_user":alunos[i].email,
                "usu_senha":alunos[i].senha,
              
                "per_id":alunos[i].perfilId
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
        let funcs = await db_func.listar([2]);
        let rows = [];

        for (let i = 0; i < funcs.length; i++) {
            rows.push({
                "usu_id":funcs[i].id,
                "usu_nome":funcs[i].nome,
                "usu_email":funcs[i].email,
                "usu_senha":funcs[i].senha,
                
                "per_id":funcs[i].perfilId
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
                "per_id":per.id,
                "per_descricao":per.descricao
            })
        ))
        res.render("form_register",{ layout: 'imports_layout',rows});
    }
}



module.exports = SystemController;