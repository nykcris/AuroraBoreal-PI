const db = require('../utils/database');



class DB_TabelaHorario {
    #id; #turma_id;

    get id() { return this.#id; }
    set id(value) { this.#id = value; }
    get turma_id() { return this.#turma_id; }
    set turma_id(value) { this.#turma_id = value; }

    constructor(id, turma_id) {
        this.#id = id;
        this.#turma_id = turma_id;
    }

    async listar() {
        let DB = new db();
        let rows = await DB.ExecutaComando("SELECT * FROM tb_tabela_horario", []);
        return rows
    }

    async cadastrar() {
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(
            "INSERT INTO tb_tabela_horario (turma_id) VALUES (?)",
            [this.#turma_id]
        );
    }

    async obter(id) {
        let DB = new db();
        let rows = await DB.ExecutaComando("SELECT * FROM tb_tabela_horario WHERE id = ?", [id]);
        return rows;
    }

    async atualizar() {
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(
            "UPDATE tb_tabela_horario SET turma_id = ? WHERE id = ?",
            [this.#turma_id, this.#id]
        );
    }

    async excluir(id) {
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(
            "DELETE FROM tb_tabela_horario WHERE id = ?",
            [id]
        );
    }

    toJSON() {
        return {
            id: this.#id,
            turma_id: this.#turma_id
        };
    }
}

module.exports = DB_TabelaHorario;




