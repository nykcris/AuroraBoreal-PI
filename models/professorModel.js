const db = require('../utils/database');

class DB_Professor {
    #id; #nome; #email; #cpf; #senha;

    constructor(id, nome, email, cpf, senha) {
        this.#id = id;
        this.#nome = nome;
        this.#email = email;
        this.#cpf = cpf;
        this.#senha = senha;
    }

    async listar() {
        let DB = new db();
        let rows = await DB.ExecutaComando("SELECT * FROM tb_professor", []);
        return rows.map(p => new DB_Professor(p.id, p.nome, p.email, p.cpf, p.senha));
    }

    async cadastrar() {
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(
            `INSERT INTO tb_professor (nome, email, cpf, senha) VALUES (?, ?, ?, ?)`,
            [this.#nome, this.#email, this.#cpf, this.#senha]
        );
    }
}

module.exports = DB_Professor;
