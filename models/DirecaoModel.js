
const db = require('../utils/database');

class DB_Direcao {
    #id; #nome; #email; #cpf; #senha;

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

    constructor(id, nome, email, cpf, senha) {
        this.#id = id;
        this.#nome = nome;
        this.#email = email;
        this.#cpf = cpf;
        this.#senha = senha;
    }


    static async listarTodos() {
        const DB = new db();
        const rows = await DB.ExecutaComando("SELECT * FROM tb_direcao", []);
        return rows.map(p => new DB_Direcao(p.id, p.nome, p.email, p.cpf, p.senha));
    }

    async obter(id) {
        const DB = new db();
        const rows = await DB.ExecutaComando("SELECT * FROM tb_direcao WHERE id = ?", [id]);
        return rows;
    }

    async cadastrar() {
        const DB = new db();
        const sql = `INSERT INTO tb_direcao (nome, email, cpf, senha) VALUES (?, ?, ?, ?)`;
        const params = [this.#nome, this.#email, this.#cpf, this.#senha];
        const result = await DB.ExecutaComandoNonQuery(sql, params);
        this.#id = result.insertId;
        return result;
    }

    async validar(email, senha) {
        const DB = new db();
        let sql = "SELECT * FROM tb_direcao WHERE email = ? AND senha = ?";
        if(usuId != null){
            sql += " AND id = ?";
        }
        const rows = await DB.ExecutaComando(sql, [email, senha, usuId]);
        return rows.length > 0 ? rows[0] : null;
    }

    toJSON() {
        return {
            id: this.#id,
            nome: this.#nome,
            email: this.#email,
            cpf: this.#cpf,
            senha: this.#senha
        };
    }
}

module.exports = DB_Direcao;
