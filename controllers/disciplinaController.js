const DB_Disciplina = require("../models/disciplinaModel");

class DisciplinaController {
    async cadastrarDisciplina(req, res) {
        let DBD = new DB_Disciplina(0, req.body.disciplina_nome);
        let sucesso = await DBD.cadastrar();
        if (sucesso) {
            console.log("Sucesso ao cadastrar disciplina");
            res.send("Sucesso ao cadastrar disciplina");
        } else {
            console.log("Erro ao cadastrar disciplina");
            res.send("Erro ao cadastrar disciplina");
        }
    }

    async deleteDisciplina(req, res) {
        let DBD = new DB_Disciplina();
        let sucesso = await DBD.excluir(req.body.id);
        if (sucesso) {
            console.log("Sucesso ao deletar disciplina");
            res.json({ sucesso: true, mensagem: "Disciplina deletada com sucesso!" });
        } else {
            console.log("Erro ao deletar disciplina");
            res.json({ sucesso: false, mensagem: "Erro ao deletar disciplina" });
        }
    }

    async editarDisciplina(req, res) {
        let DBD = new DB_Disciplina();
        let disciplina = await DBD.obter(req.query.id);
        res.render("Disciplina/editar_disciplina", { layout: 'layouts/layout', disciplina });
    }

    async atualizarDisciplina(req, res) {
        let DBD = new DB_Disciplina();
        let disciplina = new DB_Disciplina(req.body.id, req.body.disciplina_nome);
        let sucesso = await disciplina.atualizar();
        if (sucesso) {
            console.log("Sucesso ao atualizar disciplina");
            res.redirect("/system/direcao");
        } else {
            console.log("Erro ao atualizar disciplina");
            res.send("Erro ao atualizar disciplina");
        }
    }
}

module.exports = DisciplinaController;



