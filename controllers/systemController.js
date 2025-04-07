const DB_Perfil = require("../models/perfilModel");
const DB_Usuarios = require("../models/usuarioModel");
const DB_Atividade = require("../models/atividadeModel");

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
        console.log("Numeros de Alunos:" + rows.length);

        let db_atividade = new DB_Atividade();
        let atividades = await db_atividade.listar();
        let atividades_rows = [];
        for (let i = 0; i < atividades.length; i++) {
            atividades_rows.push({
                "ati_id":atividades[i].ati_id,
                "titulo":atividades[i].titulo,
                "descricao":atividades[i].descricao,
                "data_criacao":atividades[i].data_criacao,
                "data_entrega":atividades[i].data_entrega,
                "id_professor":atividades[i].id_professor,
                "anexo_atividade":atividades[i].anexo_atividade,
            })
        }
        res.render("alunos_index",{ layout: 'layout', rows, atividades_rows});
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
        console.log(rows.length);

        
        let db_atividade = new DB_Atividade();
        let atividades = await db_atividade.listar();
        let atividades_rows = [];
        for (let i = 0; i < atividades.length; i++) {
            atividades_rows.push({
                "ati_id":atividades[i].ati_id,
                "titulo":atividades[i].titulo,
                "descricao":atividades[i].descricao,
                "data_criacao":atividades[i].data_criacao,
                "data_entrega":atividades[i].data_entrega,
                "id_professor":atividades[i].id_professor,
                "anexo_atividade":atividades[i].anexo_atividade,
            })
        }
        console.log(atividades_rows.slice(-1)[0]);
        res.render("professores_index",{ layout: 'layout',rows, atividades_rows});
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

    async atividades(req, res) {
        let db_atividade = new DB_Atividade();
        
        console.log(req.descricao);
        console.log(req.body);

        let atividade = new DB_Atividade(
            0,
            req.body.titulo,
            req.body.descricao,
            new Date(), // data_criacao
            req.body.data_entrega,
            req.cookies.usuarioLogado,
            req.body.anexo_atividade // ou `req.file.filename` se estiver usando upload
        );
        let sucesso = await atividade.gravar(); // chama o método da própria instância
        
        console.log(sucesso);
        if(sucesso){
            console.log("Sucesso ao gravar a atividade");
            res.redirect("/system/professores");
        } else {
            console.log("Erro ao gravar atividade");
            res.send("Erro ao gravar atividade");
        }
    }
}



module.exports = SystemController;