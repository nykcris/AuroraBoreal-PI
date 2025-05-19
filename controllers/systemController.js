const DB_Perfil = require("../models/perfilModel");
const DB_Aluno = require("../models/alunoModel");
const DB_Professor = require('../models/professorModel');
const DB_Disciplina = require("../models/disciplinaModel");
const DB_Turma = require("../models/turmaModel");
const DB_Serie = require("../models/serieModel");


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
    
        const db_serie = new DB_Serie();
        const db_turma = new DB_Turma();
        const db_aluno = new DB_Aluno();
        const db_disciplina = new DB_Disciplina();
        const db_prof = new DB_Professor();


        
        const professores = await db_prof.listar();
        const disciplinas = await db_disciplina.listar();
        const listaAlunos = await db_aluno.listar();
        const turmas = await db_turma.listar();
        const series = await db_serie.listar();
    
        res.render("Direcao/direcao_index", {
            layout: 'layouts/layout',
            alunos: listaAlunos,
            professores
        });
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

    async direcaoFetchSerie(req, res) {
        let DBS = new DB_Serie();
        let series = await DBS.listar();
        res.send(series);
    }

    async fetchNomeAluno(req, res) {
        let DBA = new DB_Aluno();
        console.log(req.query.id);
        let alunos = await DBA.obter(req.query.id);
        console.log(alunos);
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