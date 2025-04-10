const DB_Aluno = require("../models/alunoModel");

class AlunoController {
    async alunos(req, res) {
        const alunoModel = new DB_Aluno();
        const listaAlunos = await alunoModel.listar();
    
        res.render("pages/alunos", {
          alunos: listaAlunos
        });
      }
  async postCadastrarAluno(req, res) {
    console.log("DADOS RECEBIDOS:", req.body);

    try {
      const {
        aluno_nome,
        aluno_cpf,
        turma_id,
        email,
        senha,
        aluno_nasc,
        responsavel_nome,
        responsavel_cpf,
        responsavel_tel
      } = req.body;

      // Verificação de campos obrigatórios
      if (
        !aluno_nome || !aluno_cpf || !turma_id || !email || !senha ||
        !aluno_nasc || !responsavel_nome || !responsavel_cpf || !responsavel_tel
      ) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Preencha todos os campos obrigatórios."
        });
      }

      const novoAluno = new DB_Aluno(
        null, // id
        aluno_nome,
        aluno_cpf,
        turma_id,
        email,
        senha,
        aluno_nasc,
        responsavel_nome,
        responsavel_cpf,
        responsavel_tel
      );

      const resultado = await novoAluno.cadastrar();

      if (resultado) { // resultado será true se a inserção foi bem-sucedida
        return res.status(201).json({
          sucesso: true,
          mensagem: "Aluno cadastrado com sucesso!"
        });
      } else {
        return res.status(500).json({
          sucesso: false,
          mensagem: "Erro ao salvar aluno no banco de dados."
        });
      }

    } catch (error) {
      console.error("ERRO INTERNO no cadastro de aluno:", error);
      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro interno no servidor ao tentar cadastrar o aluno."
      });
    }
  }
}

module.exports = AlunoController;
