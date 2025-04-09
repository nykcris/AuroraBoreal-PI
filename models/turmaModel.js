const db = require('../utils/database');

class DB_Turma {
    #id; #nome;

    constructor(id, nome) {
        this.#id = id;
        this.#nome = nome;
    }

    async listar() {
        let DB = new db();
        let rows = await DB.ExecutaComando("SELECT * FROM tb_turma", []);
        return rows.map(t => new DB_Turma(t.id, t.nome));
    }

    async cadastrar() {
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(
            "INSERT INTO tb_turma (nome) VALUES (?)",
            [this.#nome]
        );
    }
}

module.exports = DB_Turma;
