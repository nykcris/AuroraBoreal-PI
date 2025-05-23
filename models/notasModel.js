const db = require('../utils/database');
const DB_ProfessorTurmaDisciplina = require("./professorTurmaDisciplinaModel");
const DB_Aluno = require("./alunoModel");

class DB_Notas {
    #id;
    #id_aluno;
    #id_turma_disciplina;
    #nota;

    get id() { return this.#id; }
    set id(value) { this.#id = value; }
    get id_aluno() { return this.#id_aluno; }
    set id_aluno(value) { this.#id_aluno = value; }
    get id_turma_disciplina() { return this.#id_turma_disciplina; }
    set id_turma_disciplina(value) { this.#id_turma_disciplina = value; }
    get nota() { return this.#nota; }
    set nota(value) { this.#nota = value; }

    constructor(id, id_aluno, id_turma_disciplina, nota) {
        this.#id = id;
        this.#id_aluno = id_aluno;
        this.#id_turma_disciplina = id_turma_disciplina;
        this.#nota = nota;
    }

    async gravar() {
        let sql = "INSERT INTO tb_nota (aluno_id, turma_disciplina_id, valor_nota) VALUES (?, ?, ?)";
        let valores = [this.#id_aluno, this.#id_turma_disciplina, this.#nota];
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(sql, valores);
    }

    async atualizar() {
        let sql = "UPDATE tb_nota SET valor_nota = ? WHERE aluno_id = ? AND turma_disciplina_id = ?";
        let valores = [this.#nota, this.#id_aluno, this.#id_turma_disciplina];
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
        let a = await DB.ExecutaComandoNonQuery(sql, valores);
        return a;
    }

    async obterNotasAluno(id_aluno, id_disciplina) {

        let DBPTD = new DB_ProfessorTurmaDisciplina();
        let DBA = new DB_Aluno();
        let turma = await DBA.obter(id_aluno);
        let turma_disciplina = await DBPTD.listarDisciplinas(turma[0].turma_id);
        let id_turma_disciplina = turma_disciplina[0].id;

        if(turma_disciplina[0].disciplina_id == id_disciplina){
            id_turma_disciplina = turma_disciplina[0].id;
        }

        let sql = "SELECT * FROM tb_nota WHERE aluno_id = ? AND turma_disciplina_id = ?";
        let valores = [id_aluno, id_turma_disciplina];
        let DB = new db();
        let rows = await DB.ExecutaComando(sql, valores);
        console.log(rows);
        return rows;
    }

    toJSON() {
        return {
            id: this.#id,
            id_aluno: this.#id_aluno,
            id_turma_disciplina: this.#id_turma_disciplina,
            nota: this.#nota
        };
    }
}





module.exports = DB_Notas;
