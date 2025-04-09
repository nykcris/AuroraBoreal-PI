const DB_Aluno = require("../models/alunoModel");

class AlunoController {
    async postCadastrarAluno(req, res) {
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

            // Verificação básica de campos
            if (!aluno_nome || !aluno_cpf || !turma_id || !email || !senha || !aluno_nasc || !responsavel_nome || !responsavel_cpf || !responsavel_tel) {
                return res.status(400).json({
                    success: false,
                    message: "Preencha todos os campos obrigatórios."
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

            if (resultado > 0) {
                return res.status(201).json({
                    success: true,
                    message: "Aluno cadastrado com sucesso!"
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: "Erro ao inserir no banco de dados."
                });
            }
        } catch (error) {
            console.error("Erro ao cadastrar aluno:", error);
            return res.status(500).json({
                success: false,
                message: "Erro interno no servidor."
            });
        }
    }
}

module.exports = AlunoController;
