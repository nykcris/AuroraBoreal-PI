const DB_Turma = require("../models/turmaModel");
const DB_Serie = require("../models/serieModel");

class TurmaController {
    async cadastrarTurma(req, res) {
        let DBT = new DB_Turma(0, req.body.turma_nome);
        let sucesso = await DBT.cadastrar();
        if (sucesso) {
            console.log("Sucesso ao cadastrar turma");
            res.send("Sucesso ao cadastrar turma");
        } else {
            console.log("Erro ao cadastrar turma");
            res.send("Erro ao cadastrar turma");
        }
    }

    async deleteTurma(req, res) {
        let DBT = new DB_Turma();
        let sucesso = await DBT.excluir(req.body.id);
        if (sucesso) {
            console.log("Sucesso ao deletar turma");
            res.send("Sucesso ao deletar turma");
        } else {
            console.log("Erro ao deletar turma");
            res.send("Erro ao deletar turma");
        }
    }

    async editarTurma(req, res) {
        let DBT = new DB_Turma();
        let turma = await DBT.obter(req.query.id);
        let DBS = new DB_Serie();
        let series = await DBS.listar();
        res.render("Turma/editar_turma", { layout: 'layouts/layout', turma, series });
    }

    async atualizarTurma(req, res) {
        let DBT = new DB_Turma();
        let turma = new DB_Turma(req.body.id, req.body.turma_nome);
        let sucesso = await turma.atualizar();
        if (sucesso) {
            console.log("Sucesso ao atualizar turma");
            res.redirect("/system/direcao");
        } else {
            console.log("Erro ao atualizar turma");
            res.send("Erro ao atualizar turma");
        }
    }
}

module.exports = TurmaController;



