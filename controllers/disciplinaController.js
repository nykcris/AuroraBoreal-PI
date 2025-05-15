const DB_Disciplina = require("../models/disciplinaModel");

class DisciplinaController {
  async cadastrarDisciplina(req, res) {
    try {
      const { disciplina_nome } = req.body;

      // Verificação de campos obrigatórios
      if (!disciplina_nome) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Preencha todos os campos obrigatórios.",
        });
      }

      const novaDisciplina = new DB_Disciplina(
        null, // id
        disciplina_nome
      );

      const resultado = await novaDisciplina.cadastrar();

      if (resultado) {
        // resultado será true se a inserção foi bem-sucedida
        return res.status(201).json({
          sucesso: true,
          mensagem: "Disciplina cadastrada com sucesso!",
        });
      } else {
        return res.status(500).json({
          sucesso: false,
          mensagem: "Erro ao salvar disciplina no banco de dados.",
        });
      }
    } catch (error) {
      if (error.errno == 1062) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Disciplina já cadastrada.",
        });
      }
      console.error("ERRO INTERNO no cadastro de disciplina:", error);
      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro interno no servidor ao tentar cadastrar a disciplina.",
      });
    }
  }

  async deleteDisciplina(req, res) {
    try {
      let DBD = new DB_Disciplina();
      let sucesso = await DBD.excluir(req.body.id);
      if (sucesso) {
        return res.status(201).json({
          sucesso: true,
          mensagem: "Disciplina deletada com sucesso!"
        });
      } else {
        return res.status(500).json({
          sucesso: false,
          mensagem: "Erro ao deletar disciplina.",
        });
      }
    } catch (error) {
      console.error("ERRO INTERNO ao deletar disciplina:", error);
      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro interno no servidor ao tentar deletar a disciplina.",
      });
    }
  }

  async editarDisciplina(req, res) {
    let DBD = new DB_Disciplina();
    let disciplina = await DBD.obter(req.query.id);
    res.render("Disciplina/editar_disciplina", {
      layout: "layouts/layout",
      disciplina,
    });
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
