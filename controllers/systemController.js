const DB_Perfil = require("../models/perfilModel");
const DB_Aluno = require("../models/alunoModel");
const DB_Professor = require('../models/professorModel');
const DB_Disciplina = require("../models/disciplinaModel");
const DB_Turma = require("../models/turmaModel");
const DB_Serie = require("../models/serieModel");
const DB_Sala = require("../models/salaModel");


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
        const db_sala = new DB_Sala();


        
        const professores = await db_prof.listar();
        const listaAlunos = await db_aluno.listar();
        const salas = await db_sala.listar();
        const turmas_salas = await db_sala.listarAssociacao();
    
        res.render("Direcao/direcao_index", {
            layout: 'layouts/layout',
            alunos: listaAlunos,
            professores,
            salas,
            turmas_salas
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

    async cadastrarSala(req, res) {
        let DBS = new DB_Sala();
        let sala = new DB_Sala(0, req.body.sala_nome);
        let sucesso = await sala.cadastrar();
        if (sucesso) {
            console.log("Sucesso ao cadastrar sala");
            res.json({ sucesso: true, mensagem: "Sala cadastrada com sucesso!" });
        } else {
            console.log("Erro ao cadastrar sala");
            res.json({ sucesso: false, mensagem: "Erro ao cadastrar sala" });
        }
    }

    async deleteSala(req, res) {
        let DBS = new DB_Sala();
        let sucesso = await DBS.excluir(req.body.id);
        if (sucesso) {
            console.log("Sucesso ao deletar sala");
            res.send("Sucesso ao deletar sala");
        } else {
            console.log("Erro ao deletar sala");
            res.send("Erro ao deletar sala");
        }
    }

    async editarSala(req, res) {
        let DBS = new DB_Sala();
        let sala = await DBS.obter(req.query.id);
        res.render("Sala/editar_sala", { layout: 'layouts/layout', sala });
    }

    async atualizarSala(req, res) {
        let DBS = new DB_Sala();
        let sala = new DB_Sala(req.body.id, req.body.sala_nome);
        let sucesso = await sala.atualizar();
        if (sucesso) {
            console.log("Sucesso ao atualizar sala");
            res.redirect("/system/direcao");
        } else {
            console.log("Erro ao atualizar sala");
            res.send("Erro ao atualizar sala");
        }
    }

    async cadastrarTurmaSala(req, res) {

        let DBS = new DB_Sala();
        let nome = await DBS.obter(req.body.id);
        let sala = new DB_Sala(req.body.id, nome[0].nome, req.body.turma);
        let sucesso = await sala.atualizar();
        console.log(req.body);
        console.log(sucesso);

        if (sucesso) {
            console.log("Sucesso ao cadastrar turma sala");
            res.json({ sucesso: true, mensagem: "Associação realizada com sucesso!" });
        } else {
            console.log("Erro ao cadastrar turma sala");
            res.json({ sucesso: false, mensagem: "Erro ao cadastrar turma sala" });
        }
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

    async fetchNomeSala(req, res) {
        let DBS = new DB_Sala();
        let salas = await DBS.obter(req.query.id);
        res.send(salas);
    }

    async fetchTurmaSala(req, res) {
        let DBS = new DB_Sala();
        let turma_sala = await DBS.listarAssociacao();
        res.send(turma_sala);
    }

    //======== Fim da Area de Fetch para Nome e Outros =========
}



module.exports = SystemController;