const db = require('../utils/database');

class DB_Disciplina {
    #id; #nome;

    constructor(id, nome) {
        this.#id = id;
        this.#nome = nome;
    }

    async listar() {
        let DB = new db();
        let rows = await DB.ExecutaComando("SELECT * FROM tb_disciplina", []);
        return rows
    }

    async listarOnTurmaID(turma_id) {
        let DB = new db();
        let rows = await DB.ExecutaComando("SELECT * FROM tb_disciplina WHERE id IN (SELECT disciplina_id FROM tb_turma_disciplina_professor WHERE turma_id = ?)", [turma_id]);
        return rows;
    }

    async cadastrar() {
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(
            "INSERT INTO tb_disciplina (nome) VALUES (?)",
            [this.#nome]
        );
    }

    async obter(id) {
        let DB = new db();
        let rows = await DB.ExecutaComando("SELECT * FROM tb_disciplina WHERE id = ?", [id]);
        return rows;
    }

    async atualizar() {
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(
            "UPDATE tb_disciplina SET nome = ? WHERE id = ?",
            [this.#nome, this.#id]
        );
    }

    async excluir(id) {
        let DB = new db();
        try {
            const result = await DB.ExecutaComandoNonQuery(
                "DELETE FROM tb_disciplina WHERE id = ?",
                [id]
            );
            return result;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    toJSON() {
        return {
            id: this.#id,
            nome: this.#nome
        };
    }
}

module.exports = DB_Disciplina;
