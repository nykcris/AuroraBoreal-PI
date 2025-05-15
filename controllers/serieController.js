const DB_Serie = require("../models/serieModel");

class SerieController {
  async cadastrarSerie(req, res) {
    try {
      const { serie_nome, serie_ano } = req.body;

      // Verificação de campos obrigatórios
      if (!serie_nome || !serie_ano) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Preencha todos os campos obrigatórios.",
        });
      }

      const novaSerie = new DB_Serie(
        null, // id
        serie_nome,
        serie_ano
      );

      const resultado = await novaSerie.cadastrar();

      if (resultado) {
        // resultado será true se a inserção foi bem-sucedida
        return res.status(201).json({
          sucesso: true,
          mensagem: "Serie cadastrada com sucesso!",
        });
      } else {
        return res.status(500).json({
          sucesso: false,
          mensagem: "Erro ao salvar serie no banco de dados.",
        });
      }
    } catch (error) {
      if (error.errno == 1062) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Serie já cadastrada.",
        });
      }
      console.error("ERRO INTERNO no cadastro de serie:", error);
      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro interno no servidor ao tentar cadastrar a serie.",
      });
    }
  }

  async deleteSerie(req, res) {
    try {
      let DBS = new DB_Serie();
      let sucesso = await DBS.excluir(req.body.id);
      if (sucesso) {
        return res.status(201).json({
          sucesso: true,
          mensagem: "Serie deletada com sucesso!"
        });
      } else {
        return res.status(500).json({
          sucesso: false,
          mensagem: "Erro ao deletar serie.",
        });
      }
    } catch (error) {
      console.error("ERRO INTERNO ao deletar serie:", error);
      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro interno no servidor ao tentar deletar a serie.",
      });
    }
  }

  async editarSerie(req, res) {
    let DBS = new DB_Serie();
    let serie = await DBS.obter(req.query.id);
    res.render("Serie/editar_serie", { layout: "layouts/layout", serie });
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
