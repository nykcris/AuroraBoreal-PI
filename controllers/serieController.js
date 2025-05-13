const DB_Serie = require("../models/serieModel");

class SerieController {
    async cadastrarSerie(req, res) {
        let DBS = new DB_Serie(0, req.body.serie_nome);
        let sucesso = await DBS.cadastrar();
        if (sucesso) {
            console.log("Sucesso ao cadastrar serie");
            res.send("Sucesso ao cadastrar serie");
        } else {
            console.log("Erro ao cadastrar serie");
            res.send("Erro ao cadastrar serie");
        }
    }

    async deleteSerie(req, res) {
        let DBS = new DB_Serie();
        let sucesso = await DBS.excluir(req.body.id);
        if (sucesso) {
            console.log("Sucesso ao deletar serie");
            res.send("Sucesso ao deletar serie");
        } else {
            console.log("Erro ao deletar serie");
            res.send("Erro ao deletar serie");
        }
    }

    async editarSerie(req, res) {
        let DBS = new DB_Serie();
        let serie = await DBS.obter(req.query.id);
        res.render("Serie/editar_serie", { layout: 'layouts/layout', serie });
    }

    async atualizarSerie(req, res) {
        let DBS = new DB_Serie();
        let serie = new DB_Serie(req.body.id, req.body.serie_nome);
        let sucesso = await serie.atualizar();
        if (sucesso) {
            console.log("Sucesso ao atualizar serie");
            res.redirect("/system/direcao");
        } else {
            console.log("Erro ao atualizar serie");
            res.send("Erro ao atualizar serie");
        }
    }
}

module.exports = SerieController;



