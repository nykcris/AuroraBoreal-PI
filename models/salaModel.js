const db = require('../utils/database');

class DB_Sala {
    #id; #nome; #turma_id;

    get id() { return this.#id; }
    set id(value) { this.#id = value; }
    get nome() { return this.#nome; }
    set nome(value) { this.#nome = value; }
    get turma_id() { return this.#turma_id; }
    set turma_id(value) { this.#turma_id = value; }

    constructor(id, nome, turma_id) {
        this.#id = id;
        this.#nome = nome;
        this.#turma_id = turma_id;
    }

    async listar() {
        let DB = new db();
        let rows = await DB.ExecutaComando("SELECT * FROM tb_sala", []);
        return rows
    }

    async listarAssociacao() {
        let DB = new db();
        let rows = await DB.ExecutaComando("SELECT s.id, s.nome, s.turma_id, t.nome AS turma_nome FROM tb_sala s JOIN tb_turma t ON s.turma_id = t.id", []);
        return rows
    }

    async cadastrar() {
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(
            "INSERT INTO tb_sala (nome, turma_id) VALUES (?, ?)",
            [this.#nome, this.#turma_id]
        );
    }

    async obter(id) {
        let DB = new db();
        let rows = await DB.ExecutaComando("SELECT * FROM tb_sala WHERE id = ?", [id]);
        return rows;
    }

    async atualizar() {
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(
            "UPDATE tb_sala SET nome = ? , turma_id = ? WHERE id = ?",
            [this.#nome, this.#turma_id, this.#id]
        );
    }

    async excluir(id) {
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(
            "DELETE FROM tb_sala WHERE id = ?",
            [id]
        );
    }



    toJSON() {
        return {
            id: this.#id,
            nome: this.#nome
        };
    }
}

module.exports = DB_Sala;


