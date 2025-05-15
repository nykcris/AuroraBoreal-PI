const db = require('../utils/database');

class DB_Serie {
    #id; #nome; #ano;

    get id() { return this.#id; }
    set id(value) { this.#id = value; }
    get nome() { return this.#nome; }
    set nome(value) { this.#nome = value; }
    get ano() { return this.#ano; }
    set ano(value) { this.#ano = value; }

    constructor(id, nome, ano) {
        this.#id = id;
        this.#nome = nome;
        this.#ano = ano;
    }

    async listar() {
        let DB = new db();
        let rows = await DB.ExecutaComando("SELECT * FROM tb_serie", []);
        return rows
    }

    async cadastrar() {
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(
            "INSERT INTO tb_serie (nome, ano) VALUES (?, ?)",
            [this.#nome, this.#ano]
        );
    }

    async obter(id) {
        let DB = new db();
        let rows = await DB.ExecutaComando("SELECT * FROM tb_serie WHERE id = ?", [id]);
        return rows;
    }

    async atualizar() {
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(
            "UPDATE tb_serie SET nome = ?, ano = ? WHERE id = ?",
            [this.#nome, this.#ano, this.#id]
        );
    }

    async excluir(id) {
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(
            "DELETE FROM tb_serie WHERE id = ?",
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

module.exports = DB_Serie;

