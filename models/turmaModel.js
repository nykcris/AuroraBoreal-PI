const db = require('../utils/database');

class DB_Turma {
    #id; #nome; #serie_id;

    get id() { return this.#id; }
    set id(value) { this.#id = value; }
    get nome() { return this.#nome; }
    set nome(value) { this.#nome = value; }
    get serie_id() { return this.#serie_id; }
    set serie_id(value) { this.#serie_id = value; }

    constructor(id, nome, serie_id) {
        this.#id = id;
        this.#nome = nome;
        this.#serie_id = serie_id;
    }

    async listar() {
        let DB = new db();
        let rows = await DB.ExecutaComando("SELECT * FROM tb_turma", []);
        return rows
    }

    async cadastrar() {
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(
            "INSERT INTO tb_turma (nome, serie_id) VALUES (?, ?)",
            [
                this.#nome,
                this.#serie_id
            ]
        );
    }

    async obter(id) {
        let DB = new db();
        let rows = await DB.ExecutaComando("SELECT * FROM tb_turma WHERE id = ?", [id]);
        return rows;
    }
    
    async atualizar() {
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(
            "UPDATE tb_turma SET nome = ?, serie_id = ? WHERE id = ?",
            [this.#nome, this.#serie_id, this.#id]
        );
    }

    async excluir(id) {
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(
            "DELETE FROM tb_turma WHERE id = ?",
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

module.exports = DB_Turma;
