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
        return rows.map(d => new DB_Disciplina(d.id, d.nome));
    }

    async cadastrar() {
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(
            "INSERT INTO tb_disciplina (nome) VALUES (?)",
            [this.#nome]
        );
    }
}

module.exports = DB_Disciplina;
