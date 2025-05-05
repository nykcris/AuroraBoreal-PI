const db = require('../utils/database');

class DB_TurmaDisciplina {
    #id;
    #id_turma;
    #id_disciplina;

    get id() { return this.#id; }
    set id(value) { this.#id = value; }
    get id_turma() { return this.#id_turma; }
    set id_turma(value) { this.#id_turma = value; }
    get id_disciplina() { return this.#id_disciplina; }
    set id_disciplina(value) { this.#id_disciplina = value; }

    constructor(id, id_turma, id_disciplina) {
        this.#id = id;
        this.#id_turma = id_turma;
        this.#id_disciplina = id_disciplina;
    }

    async listar() {
        let DB = new db();
        let rows = await DB.ExecutaComando("SELECT * FROM tb_turma_disciplina", []);
        return rows;
    }

    async obter(id) {
        let DB = new db();
        let rows = await DB.ExecutaComando("SELECT * FROM tb_turma_disciplina WHERE id = ?", [id]);
        return rows;
    }

    async cadastrar() {
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(
            "INSERT INTO tb_turma_disciplina (id_turma, id_disciplina) VALUES (?, ?)",
            [this.#id_turma, this.#id_disciplina]
        );
    }
}

module.exports = DB_TurmaDisciplina;

