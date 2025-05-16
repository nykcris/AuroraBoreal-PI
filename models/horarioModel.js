const db = require('../utils/database');



class DB_Horario {
    #id; #tabela_id; #disciplina_id; #professor_id; #dia_semana; #horario_index;

    get id() { return this.#id; }
    set id(value) { this.#id = value; }
    get tabela_id() { return this.#tabela_id; }
    set tabela_id(value) { this.#tabela_id = value; }
    get disciplina_id() { return this.#disciplina_id; }
    set disciplina_id(value) { this.#disciplina_id = value; }
    get professor_id() { return this.#professor_id; }
    set professor_id(value) { this.#professor_id = value; }
    get dia_semana() { return this.#dia_semana; }
    set dia_semana(value) { this.#dia_semana = value; }
    get horario_index() { return this.#horario_index; }
    set horario_index(value) { this.#horario_index = value; }

    constructor(id, tabela_id, disciplina_id, professor_id, dia_semana, horario_index) {
        this.#id = id;
        this.#tabela_id = tabela_id;
        this.#disciplina_id = disciplina_id;
        this.#professor_id = professor_id;
        this.#dia_semana = dia_semana;
        this.#horario_index = horario_index;
    }

    async listar() {
        let DB = new db();
        let rows = await DB.ExecutaComando("SELECT * FROM tb_horario", []);
        return rows
    }

    async cadastrar() {
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(
            "INSERT INTO tb_horario (tabela_id, disciplina_id, professor_id, dia_semana, horario_index) VALUES (?, ?, ?, ?, ?)",
            [this.#tabela_id, this.#disciplina_id, this.#professor_id, this.#dia_semana, this.#horario_index]
        );
    }

    async obter(id) {
        let DB = new db();
        let rows = await DB.ExecutaComando("SELECT * FROM tb_horario WHERE id = ?", [id]);
        return rows;
    }

    async atualizar() {
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(
            "UPDATE tb_horario SET tabela_id = ?, disciplina_id = ?, professor_id = ?, dia_semana = ?, horario_index = ? WHERE id = ?",
            [this.#tabela_id, this.#disciplina_id, this.#professor_id, this.#dia_semana, this.#horario_index, this.#id]
        );
    }

    async excluir(id) {
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(
            "DELETE FROM tb_horario WHERE id = ?",
            [id]
        );
    }

    toJSON() {
        return {
            id: this.#id,
            tabela_id: this.#tabela_id,
            disciplina_id: this.#disciplina_id,
            professor_id: this.#professor_id,
            dia_semana: this.#dia_semana,
            horario_index: this.#horario_index
        };
    }
}

module.exports = DB_Horario;







