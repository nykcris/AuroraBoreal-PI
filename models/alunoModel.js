const db = require('../utils/database');

class DB_Aluno {
    #id; #aluno_nome; #aluno_cpf; #turma_id; #email; #senha;
    #aluno_nasc; #responsavel_nome; #responsavel_cpf; #responsavel_tel;

    get id() { return this.#id; }
    set id(value) { this.#id = value; }
    get aluno_nome() { return this.#aluno_nome; }
    set aluno_nome(value) { this.#aluno_nome = value; }
    get aluno_cpf() { return this.#aluno_cpf; }
    set aluno_cpf(value) { this.#aluno_cpf = value; }
    get turma_id() { return this.#turma_id; }
    set turma_id(value) { this.#turma_id = value; }
    get email() { return this.#email; }
    set email(value) { this.#email = value; }
    get senha() { return this.#senha; }
    set senha(value) { this.#senha = value; }
    get aluno_nasc() { return this.#aluno_nasc; }
    set aluno_nasc(value) { this.#aluno_nasc = value; }
    get responsavel_nome() { return this.#responsavel_nome; }
    set responsavel_nome(value) { this.#responsavel_nome = value; }
    get responsavel_cpf() { return this.#responsavel_cpf; }
    set responsavel_cpf(value) { this.#responsavel_cpf = value; }
    get responsavel_tel() { return this.#responsavel_tel; }
    set responsavel_tel(value) { this.#responsavel_tel = value; }

    constructor(id, aluno_nome, aluno_cpf, turma_id, email, senha, aluno_nasc, responsavel_nome, responsavel_cpf, responsavel_tel) {
        this.#id = id;
        this.#aluno_nome = aluno_nome;
        this.#aluno_cpf = aluno_cpf;
        this.#turma_id = turma_id;
        this.#email = email;
        this.#senha = senha;
        this.#aluno_nasc = aluno_nasc;
        this.#responsavel_nome = responsavel_nome;
        this.#responsavel_cpf = responsavel_cpf;
        this.#responsavel_tel = responsavel_tel;
    }


    async listar() {
        const DB = new db();
        const sql = `
            SELECT
                a.*,
                t.nome AS turma_nome
            FROM tb_aluno a
            JOIN tb_turma t ON a.turma_id = t.id
        `;

        const rows = await DB.ExecutaComando(sql, []);
        return rows; // Retorna os dados direto, sem encapsular na classe
    }

    async obter(id) {
        const DB = new db();
        const sql = `
            SELECT * FROM tb_aluno WHERE id = ?
        `;

        const rows = await DB.ExecutaComando(sql, [id]);
        return rows; // Retorna os dados direto, sem encapsular na classe
    }



    async cadastrar() {
        const DB = new db();
        const sql = `
            INSERT INTO tb_aluno (
                aluno_nome, aluno_cpf, turma_id, email, senha, aluno_nasc,
                responsavel_nome, responsavel_cpf, responsavel_tel
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const valores = [
            this.#aluno_nome,
            this.#aluno_cpf,
            this.#turma_id,
            this.#email,
            this.#senha,
            this.#aluno_nasc,
            this.#responsavel_nome,
            this.#responsavel_cpf,
            this.#responsavel_tel
        ];

        return await DB.ExecutaComandoNonQuery(sql, valores); // retorna true ou false
    }

    async excluir(id) {
        const DB = new db();
        const sql = `DELETE FROM tb_aluno WHERE id = ?`;
        const valores = [id];
        try {
            const result = await DB.ExecutaComandoNonQuery(sql, valores);
            return result;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async validar(email, senha, usuId) {
        const DB = new db();
        let sql = "SELECT * FROM tb_aluno WHERE email = ? AND senha = ?";
        if(usuId != null){
            sql += " AND id = ?";
        }
        const valores = [email, senha, usuId];
        const rows = await DB.ExecutaComando(sql, valores);
        return rows.length > 0 ? rows[0] : null;
    }

    async atualizar() {
        const DB = new db();
        const sql = `
            UPDATE tb_aluno SET
                aluno_nome = ?, aluno_cpf = ?, turma_id = ?, email = ?, senha = ?,
                aluno_nasc = ?, responsavel_nome = ?, responsavel_cpf = ?, responsavel_tel = ?
            WHERE id = ?
        `;
        const valores = [
            this.#aluno_nome,
            this.#aluno_cpf,
            this.#turma_id,
            this.#email,
            this.#senha,
            this.#aluno_nasc,
            this.#responsavel_nome,
            this.#responsavel_cpf,
            this.#responsavel_tel,
            this.#id
        ];

        console.log("=== MODELO ALUNO - ATUALIZAR ===");
        console.log("SQL:", sql);
        console.log("Valores:", valores);

        try {
            let resultado = await DB.ExecutaComandoNonQuery(sql, valores);
            console.log("Resultado da execução:", resultado);
            return resultado;
        } catch (error) {
            console.error("Erro no modelo ao atualizar aluno:", error);
            return false;
        }
    }

    async atualizarPerfil(id, nome, email, responsavel_nome, responsavel_telefone, senha, cpf = null, data_nascimento = null) {
        const DB = new db();

        // Primeiro vamos verificar qual é a estrutura real da tabela
        console.log("Verificando estrutura da tabela...");
        try {
            const estrutura = await DB.ExecutaComando("DESCRIBE tb_aluno", []);
            console.log("Estrutura da tabela tb_aluno:", estrutura);
        } catch (err) {
            console.log("Erro ao verificar estrutura:", err);
        }

        // Verificar se o ID é válido
        if (!id || id === 'undefined' || id === 'null') {
            console.error("ID inválido para atualização:", id);
            return false;
        }

        // Primeiro, verificar se o registro existe
        const verificaExistencia = await DB.ExecutaComando("SELECT id FROM tb_aluno WHERE id = ?", [id]);
        console.log("Registro encontrado:", verificaExistencia);

        if (!verificaExistencia || verificaExistencia.length === 0) {
            console.error("Nenhum registro encontrado com ID:", id);
            return false;
        }

        const sql = `
            UPDATE tb_aluno SET
                aluno_nome = ?, email = ?, responsavel_nome = ?, responsavel_tel = ?, senha = ?, aluno_cpf = ?, aluno_nasc = ?
            WHERE id = ?
        `;
        const valores = [nome, email, responsavel_nome, responsavel_telefone, senha, cpf, data_nascimento, id];

        console.log("=== MODELO ALUNO - ATUALIZAR PERFIL ===");
        console.log("SQL:", sql);
        console.log("Valores:", valores);

        try {
            let resultado = await DB.ExecutaComandoNonQuery(sql, valores);
            console.log("Resultado da execução:", resultado);
            console.log("Tipo do resultado:", typeof resultado);

            // Verificar diferentes tipos de retorno
            if (typeof resultado === 'object' && resultado !== null) {
                console.log("affectedRows:", resultado.affectedRows);
                console.log("changedRows:", resultado.changedRows);
                // Para MySQL, verificar se pelo menos uma linha foi encontrada (matched)
                return resultado.affectedRows >= 0; // >= 0 porque pode ser 0 se não houve mudanças mas a linha existe
            } else if (typeof resultado === 'boolean') {
                return resultado;
            } else if (typeof resultado === 'number') {
                return resultado >= 0;
            }

            return false;
        } catch (error) {
            console.error("Erro no modelo ao atualizar perfil do aluno:", error);
            return false;
        }
    }

    async listarOnTurma(turma_id) {
        const DB = new db();
        const sql = `
            SELECT * FROM tb_aluno WHERE turma_id = ?
        `;
        const valores = [turma_id];
        const rows = await DB.ExecutaComando(sql, valores);
        return rows;
    }


    toJSON() {
        return {
            id: this.#id,
            aluno_nome: this.#aluno_nome,
            aluno_cpf: this.#aluno_cpf,
            turma_id: this.#turma_id,
            email: this.#email,
            senha: this.#senha,
            aluno_nasc: this.#aluno_nasc,
            responsavel_nome: this.#responsavel_nome,
            responsavel_cpf: this.#responsavel_cpf,
            responsavel_tel: this.#responsavel_tel
        };
    }
}

module.exports = DB_Aluno;
