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

    getId() { return this.#id; }
    getNome() { return this.#nome; }

    static async listarTodos() {
        const DB = new db();
        const rows = await DB.ExecutaComando("SELECT * FROM tb_professor", []);
        return rows.map(p => new DB_Professor(p.id, p.nome, p.email, p.cpf, p.senha));
    }

    async cadastrar() {
        const DB = new db();
        const sql = `INSERT INTO tb_professor (nome, email, cpf, senha) VALUES (?, ?, ?, ?)`;
        const params = [this.#nome, this.#email, this.#cpf, this.#senha];
        const result = await DB.ExecutaComandoNonQuery(sql, params);
        this.#id = result.insertId;
        return result;
    }
}

module.exports = DB_Professor;
