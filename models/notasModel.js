const db = require('../utils/database');

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
        let sql = "INSERT INTO tb_notas (aluno_id, turma_disciplina_id, valor_nota) VALUES (?, ?, ?)";
        let valores = [this.#id_aluno, this.#id_turma_disciplina, this.#nota];
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(sql, valores);
    }

    async atualizar() {
        let sql = "UPDATE tb_notas SET valor_nota = ? WHERE aluno_id = ? AND turma_disciplina_id = ?";
        let valores = [this.#nota, this.#id_aluno, this.#id_turma_disciplina];
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(sql, valores);
    }

    async listar(){
        let sql = "SELECT * FROM tb_notas";
        let DB = new db();
        let rows = await DB.ExecutaComando(sql);
        return rows;
    }

    async excluir(id) {
        let sql = "DELETE FROM tb_notas WHERE id = ?";
        let valores = [id];
        let DB = new db();
        let a = await DB.ExecutaComandoNonQuery(sql, valores);
        return a;
    }

    async obter(id_aluno, id_turma_disciplina) {
        let sql = "SELECT * FROM tb_notas JOIN tb_turma_disciplina ON tb_notas.turma_disciplina_id = tb_turma_disciplina.id WHERE id_aluno = ? AND id_turma_disciplina = ?";
        let valores = [id_aluno, id_turma_disciplina];
        let DB = new db();
        let rows = await DB.ExecutaComando(sql, valores);
        return rows;
    }

}





module.exports = DB_Notas;
