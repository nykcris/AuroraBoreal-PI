const db = require('../utils/database');
const DB_ProfessorTurmaDisciplina = require("./professorTurmaDisciplinaModel");

class DB_Notas {
    #id;
    #id_aluno;
    #id_turma_disciplina;
    #nota;
    #bimestre;

    get id() { return this.#id; }
    set id(value) { this.#id = value; }
    get id_aluno() { return this.#id_aluno; }
    set id_aluno(value) { this.#id_aluno = value; }
    get id_turma_disciplina() { return this.#id_turma_disciplina; }
    set id_turma_disciplina(value) { this.#id_turma_disciplina = value; }
    get nota() { return this.#nota; }
    set nota(value) { this.#nota = value; }
    get bimestre() { return this.#bimestre; }
    set bimestre(value) { this.#bimestre = value; }

    constructor(id, id_aluno, id_turma_disciplina, nota, bimestre) {
        this.#id = id;
        this.#id_aluno = id_aluno;
        this.#id_turma_disciplina = id_turma_disciplina;
        this.#nota = nota;
        this.#bimestre = bimestre;
    }

    async gravar() {
        let sql = "INSERT INTO tb_nota (aluno_id, turma_disciplina_id, valor_nota, bimestre) VALUES (?, ?, ?, ?)";
        let valores = [this.#id_aluno, this.#id_turma_disciplina, this.#nota, this.#bimestre];
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(sql, valores);
    }

    async atualizar() {
        let sql = "UPDATE tb_nota SET valor_nota = ?, bimestre = ? WHERE aluno_id = ? AND turma_disciplina_id = ?";
        let valores = [this.#nota, this.#bimestre, this.#id_aluno, this.#id_turma_disciplina];
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(sql, valores);
    }

    async listar(){
        let sql = "SELECT * FROM tb_nota";
        let DB = new db();
        let rows = await DB.ExecutaComando(sql);
        return rows;
    }

    async excluir(id) {
        let sql = "DELETE FROM tb_nota WHERE id = ?";
        let valores = [id];
        let DB = new db();
        try {
            const result = await DB.ExecutaComandoNonQuery(sql, valores);
            return result;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async obterNotasAluno(id_aluno, disciplina_id, turma_id) {

        let DBPTD = new DB_ProfessorTurmaDisciplina();
        let professor_turma_disciplina = await DBPTD.fetchDisciplinaTurmaId(turma_id, disciplina_id);
        let id_turma_disciplina = professor_turma_disciplina[0].id;
        let sql = "SELECT tn.*, a.aluno_nome, a.id AS aluno_id FROM tb_nota tn JOIN tb_aluno a ON tn.aluno_id = a.id WHERE aluno_id = ? AND turma_disciplina_id = ? ORDER BY bimestre";
        let valores = [id_aluno, id_turma_disciplina];
        let DB = new db();
        let rows = await DB.ExecutaComando(sql, valores);
        return rows;
    }

    async fetchNotas(aluno_id, turma_disciplina_id, bimestre) {
        let sql = "SELECT * FROM tb_nota WHERE aluno_id = ? AND turma_disciplina_id = ? AND bimestre = ?";
        let valores = [aluno_id, turma_disciplina_id, bimestre];
        let DB = new db();
        let rows = await DB.ExecutaComando(sql, valores);
        return rows;
    }

    async calcularMediaGeral(aluno_id) {
        let sql = "SELECT AVG(valor_nota) as media_geral FROM tb_nota WHERE aluno_id = ?";
        let valores = [aluno_id];
        let DB = new db();
        let rows = await DB.ExecutaComando(sql, valores);
        return rows.length > 0 ? rows[0].media_geral || 0 : 0;
    }

    toJSON() {
        return {
            id: this.#id,
            id_aluno: this.#id_aluno,
            id_turma_disciplina: this.#id_turma_disciplina,
            nota: this.#nota,
            bimestre: this.#bimestre
        };
    }
}





module.exports = DB_Notas;
