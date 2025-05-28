const db = require('../utils/database');

class DB_Horario {
    #id; #turma_id; #disciplina_id; #horario; #dia;

    get id() { return this.#id; }
    set id(value) { this.#id = value; }
    get turma_id() { return this.#turma_id; }
    set turma_id(value) { this.#turma_id = value; }
    get disciplina_id() { return this.#disciplina_id; }
    set disciplina_id(value) { this.#disciplina_id = value; }
    get horario() { return this.#horario; }
    set horario(value) { this.#horario = value; }
    get dia() { return this.#dia; }
    set dia(value) { this.#dia = value; }

    constructor(id, turma_id, disciplina_id, horario, dia) {
        this.#id = id;
        this.#turma_id = turma_id;
        this.#disciplina_id = disciplina_id;
        this.#horario = horario;
        this.#dia = dia;
    }

    async listar() {
        let DB = new db();
        let rows = await DB.ExecutaComando("SELECT h.id, h.turma_id, h.disciplina_id, h.horario, h.dia, t.nome AS turma_nome, d.nome AS disciplina_nome FROM tb_horario h JOIN tb_turma t ON h.turma_id = t.id JOIN tb_disciplina d ON h.disciplina_id = d.id", []);
        return rows
    }

    async cadastrar() {
        let DB = new db();
        if(this.#turma_id == null || this.#disciplina_id == null || this.#horario == null || this.#dia == null){
            return false;
        }
        return await DB.ExecutaComandoNonQuery(
            "INSERT INTO tb_horario (turma_id, disciplina_id, horario, dia) VALUES (?, ?, ?, ?)",
            [this.#turma_id, this.#disciplina_id, this.#horario, this.#dia]
        );
    }

    async obter(id) {
        let DB = new db();
        let rows = await DB.ExecutaComando("SELECT * FROM tb_horario WHERE id = ?", [id]);
        return rows;
    }

    async atualizar() {
        let DB = new db();
        if(this.#turma_id == null || this.#disciplina_id == null || this.#horario == null || this.#dia == null){
            return false;
        }
        return await DB.ExecutaComandoNonQuery(
            "UPDATE tb_horario SET turma_id = ?, disciplina_id = ?, horario = ?, dia = ? WHERE id = ?",
            [this.#turma_id, this.#disciplina_id, this.#horario, this.#dia, this.#id]
        );
    }

    async excluir(id) {
        let DB = new db();
        try {
            const result = await DB.ExecutaComandoNonQuery(
                "DELETE FROM tb_horario WHERE id = ?",
                [id]
            );
            return result;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async deletarTabela(turma_id){
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(
            "DELETE FROM tb_horario where turma_id = ?",
            [turma_id]
        );
    }

    async obterTabela(turma_id) {
        let DB = new db();
        let rows = await DB.ExecutaComando("SELECT h.id, h.turma_id, h.disciplina_id, h.horario, h.dia, t.nome AS turma_nome, d.nome AS disciplina_nome FROM tb_horario h JOIN tb_turma t ON h.turma_id = t.id JOIN tb_disciplina d ON h.disciplina_id = d.id WHERE h.turma_id = ?", [turma_id]);
        return rows;
    }

    async obterUnico(turma_id, horario, dia) {
        let DB = new db();
        let rows = await DB.ExecutaComando("SELECT * FROM tb_horario WHERE turma_id = ? AND horario = ? AND dia = ?", [turma_id, horario, dia]);
        return rows;
    }

    toJSON() {
        return {
            id: this.#id,
            turma_id: this.#turma_id,
            disciplina_id: this.#disciplina_id,
            horario: this.#horario,
            dia: this.#dia
        };
    }
}

module.exports = DB_Horario;





