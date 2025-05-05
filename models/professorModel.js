const db = require('../utils/database');

class DB_Professor {
    #id; 
    #nome; 
    #email; 
    #cpf; 
    #senha; 
    #salario; 
    #telefone;

    get id() { return this.#id; }
    set id(value) { this.#id = value; }
    get nome() { return this.#nome; }
    set nome(value) { this.#nome = value; }
    get email() { return this.#email; }
    set email(value) { this.#email = value; }
    get cpf() { return this.#cpf; }
    set cpf(value) { this.#cpf = value; }
    get senha() { return this.#senha; }
    set senha(value) { this.#senha = value; }
    get salario() { return this.#salario; }
    set salario(value) { this.#salario = value; }
    get telefone() { return this.#telefone; }
    set telefone(value) { this.#telefone = value; }

    constructor(id, nome, email, cpf, senha, salario, telefone) {
        this.#id = id;
        this.#nome = nome;
        this.#email = email;
        this.#cpf = cpf;
        this.#senha = senha;
        this.#salario = salario;
        this.#telefone = telefone;
    }


    static async listarTodos() {
        const DB = new db();
        const rows = await DB.ExecutaComando("SELECT * FROM tb_professor", []);
        return rows.map(p => new DB_Professor(p.id, p.nome, p.email, p.cpf, p.senha));
    }

    async obter(id) {
        const DB = new db();
        const rows = await DB.ExecutaComando("SELECT * FROM tb_professor WHERE id = ?", [id]);
        return rows;
    }

    async validar(email, senha) {
        const DB = new db();
        const rows = await DB.ExecutaComando("SELECT * FROM tb_professor WHERE email = ? AND senha = ?", [email, senha]);
        return rows.length > 0 ? rows[0] : null;
    }

    async cadastrar() {
        const DB = new db();
        const sql = `INSERT INTO tb_professor (nome, email, cpf, senha, salario, telefone) VALUES (?, ?, ?, ?, ?, ?)`;
        const params = [this.#nome, this.#email, this.#cpf, this.#senha, this.#salario, this.#telefone];
        const result = await DB.ExecutaComandoNonQuery(sql, params);
        this.#id = result.insertId;
        return result;
    }
}

module.exports = DB_Professor;
