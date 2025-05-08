// models/professorDisciplinaModel.js
const db = require('../utils/database');

class DB_ProfessorTurmaDisciplina {

    #id;
    #id_professor;
    #id_turma;
    #id_disciplina;

    get id() { return this.#id; }
    set id(value) { this.#id = value; }
    get id_professor() { return this.#id_professor; }
    set id_professor(value) { this.#id_professor = value; }
    get id_turma() { return this.#id_turma; }
    set id_turma(value) { this.#id_turma = value; }
    get id_disciplina() { return this.#id_disciplina; }
    set id_disciplina(value) { this.#id_disciplina = value; }

    constructor(id, id_professor, id_turma, id_disciplina) {
        this.#id = id;
        this.#id_professor = id_professor;
        this.#id_turma = id_turma;
        this.#id_disciplina = id_disciplina;
    }


    static async listarContratos() {
        const DB = new db();
        const rows = await DB.ExecutaComando(`
            SELECT pd.id AS contrato_id, p.nome AS professor, d.nome AS disciplina
            FROM tb_professor_disciplina pd
            JOIN tb_professor p ON pd.id_professor = p.id
            JOIN tb_disciplina d ON pd.id_disciplina = d.id
        `, []);
        return rows;
    }

    async cadastrar() {
        const DB = new db();
        return await DB.ExecutaComandoNonQuery(`
            INSERT INTO tb_professor_turma_disciplina (id_professor, id_turma, id_disciplina) VALUES (?, ?, ?)
        `, [this.#id_professor, this.#id_turma, this.#id_disciplina]);
    }

    toJSON() {
        return {
            id: this.#id,
            id_professor: this.#id_professor,
            id_turma: this.#id_turma,
            id_disciplina: this.#id_disciplina
        };
    }
}

module.exports = DB_ProfessorTurmaDisciplina;
