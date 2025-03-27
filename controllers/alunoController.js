const DB_Aluno = require("../models/alunoModel");
const db = require("../utils/database");

class AlunoController {
    async index(req, res) {
        const alunos = await db.Aluno.findAll({
            include: [
                {
                    model: db.Turma,
                    as: "turma",
                    attributes: ["nome"]
                }
            ]
        });
        res.render("./areaAluno/alunos_index", { layout: "layout", alunos });
    }

    async atividades(req, res) {
        res.render("./areaAluno/alunos_atividades", { layout: "layout" });
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
