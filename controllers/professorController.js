const db = require("../utils/database");

var DB = new db();

class AlunoController {
    async index(req, res) {
        res.render("./areaAluno/alunos_index", { layout: "layout" });
    }

    async atividades(req, res) {
        res.render("./areaAluno/alunos_enviarAtividade", { layout: "layout" });

        let sql = ""

    }

    async pagamentos(req, res) {
        res.render("./areaAluno/alunos_pagamentos", { layout: "layout" });
    }

    async notas(req, res) {
        res.render("./areaAluno/alunos_notas", { layout: "layout" });
    }

    async informacoes(req, res) {
        res.render("./areaAluno/alunos_informacoes", { layout: "layout" });
    }
}

module.exports = AlunoController;
