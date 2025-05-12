const DB_Perfil = require("../models/perfilModel");
const DB_Usuarios = require("../models/usuarioModel");
const DB_Atividade = require("../models/atividadeModel");
const DB_Resposta = require("../models/respostaModel");
const DB_Aluno = require("../models/alunoModel");
const DB_Professor = require('../models/professorModel');
const DB_Disciplina = require("../models/disciplinaModel");
const DB_Turma = require("../models/turmaModel");


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
        res.render("Sistema/form_login",{ layout: false ,users:rows});
    }
   
    

    async direcao(req, res) {
    
        const alunoModel = new DB_Aluno();
        const listaAlunos = await alunoModel.listar();
        const professores = await DB_Professor.listar();

        console.log(listaAlunos);
    
        res.render("Direcao/direcao_index", {
            layout: 'layouts/layout',
            alunos: listaAlunos,
            professores
        });
    }

    async direcaoFetchTurma(req, res) {
        let DBT = new DB_Turma();
        let turmas = await DBT.listar();
        res.send(turmas);
    }

    async direcaoFetchDisciplina(req, res) {
        let DBD = new DB_Disciplina();
        let disciplinas = await DBD.listar();
        res.send(disciplinas);
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
        res.render("Sistema/form_register",{ layout: 'imports_layout',rows});
    }

    

    //======== Area de Fetch para Nome e Outros =========

    async fetchNomeAluno(req, res) {
        let DBA = new DB_Aluno();
        let alunos = await DBA.obter(req.query.id);
        res.send(alunos);
    }
    
    async fetchNomeProfessor(req, res) {
        let DBP = new DB_Professor();
        let professores = await DBP.obter(req.query.id);
        res.send(professores);
    }
    
    async fetchNomeDisciplina(req, res) {
        let DBD = new DB_Disciplina();
        let disciplinas = await DBD.obter(req.query.id);
        res.send(disciplinas);
    }
    
    async fetchNomeTurma(req, res) {
        let DBT = new DB_Turma();
        let turmas = await DBT.obter(req.query.id);
        res.send(turmas);
    }

    //======== Fim da Area de Fetch para Nome e Outros =========
}



module.exports = SystemController;