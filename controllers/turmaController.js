const DB_Turma = require("../models/turmaModel");
const DB_Serie = require("../models/serieModel");

class TurmaController {
  async cadastrarTurma(req, res) {
    try {
      const { turma_nome, serie_id } = req.body;

      // Verificação de campos obrigatórios
      if (!turma_nome || !serie_id) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Preencha todos os campos obrigatórios.",
        });
      }

      const novaTurma = new DB_Turma(
        null, // id
        turma_nome,
        serie_id
      );
      const resultado = await novaTurma.cadastrar();

      if (resultado) {
        // resultado será true se a inserção foi bem-sucedida
        return res.status(201).json({
          sucesso: true,
          mensagem: "Turma cadastrada com sucesso!",
        });
      } else {
        return res.status(500).json({
          sucesso: false,
          mensagem: "Erro ao salvar turma no banco de dados.",
        });
      }
    } catch (error) {
      if (error.errno == 1062) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Turma já cadastrada.",
        });
      }
      console.error("ERRO INTERNO no cadastro de turma:", error);
      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro interno no servidor ao tentar cadastrar a turma.",
      });
    }
  }

  async deleteTurma(req, res) {
    try {
      let DBT = new DB_Turma();
      let sucesso = await DBT.excluir(req.body.id);
      if (sucesso) {
        return res.status(201).json({
          sucesso: true,
          mensagem: "Turma deletada com sucesso!"
        });
      } else {
        return res.status(500).json({
          sucesso: false,
          mensagem: "Erro ao deletar turma.",
        });
      }
    } catch (error) {
      if(error.errno == 1451){
        return res.status(400).json({
          sucesso: false,
          mensagem: "Turma com alunos/professores cadastrados.",
        });
      }
      console.error("ERRO INTERNO ao deletar turma:", error);
      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro interno no servidor ao tentar deletar a turma.",
      });
    }
  }

  async editarTurma(req, res) {
    let DBT = new DB_Turma();
    let turma = await DBT.obter(req.query.id);
    let DBS = new DB_Serie();
    let series = await DBS.listar();
    res.render("Turma/editar_turma", {
      layout: "layouts/layout",
      turma,
      series,
    });
  }

  async atualizarTurma(req, res) {
    let DBT = new DB_Turma();
    let turma = new DB_Turma(
      req.body.id,
      req.body.turma_nome,
      req.body.serie_id
    );
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
