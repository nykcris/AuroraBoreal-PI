const db = require('../utils/database');

class DB_Aluno {
    #id; #aluno_nome; #aluno_cpf; #turma_id; #email; #senha;
    #aluno_nasc; #responsavel_nome; #responsavel_cpf; #responsavel_tel;

    constructor(id, aluno_nome, aluno_cpf, turma_id, email, senha, aluno_nasc, responsavel_nome, responsavel_cpf, responsavel_tel) {
        this.#id = id;
        this.#aluno_nome = aluno_nome;
        this.#aluno_cpf = aluno_cpf;
        this.#turma_id = turma_id;
        this.#email = email;
        this.#senha = senha;
        this.#aluno_nasc = aluno_nasc;
        this.#responsavel_nome = responsavel_nome;
        this.#responsavel_cpf = responsavel_cpf;
        this.#responsavel_tel = responsavel_tel;
    }

    async listar() {
        let DB = new db();
        let rows = await DB.ExecutaComando("SELECT * FROM tb_aluno", []);
        return rows.map(aluno => new DB_Aluno(...Object.values(aluno)));
    }

    async cadastrar() {
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(
            `INSERT INTO tb_aluno (aluno_nome, aluno_cpf, turma_id, email, senha, aluno_nasc, responsavel_nome, responsavel_cpf, responsavel_tel)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [this.#aluno_nome, this.#aluno_cpf, this.#turma_id, this.#email, this.#senha, this.#aluno_nasc, this.#responsavel_nome, this.#responsavel_cpf, this.#responsavel_tel]
        );
    }
}

module.exports = DB_Aluno;
