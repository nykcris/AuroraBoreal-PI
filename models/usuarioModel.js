const DB = require('../utils/database');
const db = new DB();

class DB_Usuario {
    #id;
    #nome;
    #email;
    #senha;
    #perfilId;

    get id() { return this.#id; }
    set id(value) { this.#id = value; }

    get nome() { return this.#nome; }
    set nome(value) { this.#nome = value; }

    get email() { return this.#email; }
    set email(value) { this.#email = value; }

    get senha() { return this.#senha; }
    set senha(value) { this.#senha = value; }

    get perfilId() { return this.#perfilId; }
    set perfilId(value) { this.#perfilId = value; }

    constructor(id, nome, email, senha, perfilId) {
        this.#id = id;
        this.#nome = nome;
        this.#email = email;
        this.#senha = senha;
        this.#perfilId = perfilId;
    }

    async gravar() {
        let sql = `INSERT INTO tb_user (usu_nome, usu_email, usu_senha, per_id) VALUES (?, ?, ?, ?)`;
        let valores = [this.#nome, this.#email, this.#senha, this.#perfilId];
        return await db.ExecutaComandoNonQuery(sql, valores);
    }

    async validar(email, senha) {
        let sql = `SELECT * FROM tb_user WHERE usu_email = ? AND usu_senha = ?`;
        let valores = [email, senha];
        let rows = await db.ExecutaComando(sql, valores);

        if (rows.length > 0) {
            let row = rows[0];
            return new DB_Usuario(row["usu_id"], row["usu_nome"], row["usu_email"], row["usu_senha"], row["per_id"]);
        }

        return null;
    }

    async obter(id) {
        let sql = "SELECT * FROM tb_user WHERE usu_id = ?";
        let valores = [id];
        let rows = await db.ExecutaComando(sql, valores);
        let lista = [];

        for (let row of rows) {
            lista.push(new DB_Usuario(row["usu_id"], row["usu_nome"], row["usu_email"], row["usu_senha"], row["per_id"]));
        }

        return lista;
    }

    async listar() {
        let sql = "SELECT * FROM tb_user";
        let rows = await db.ExecutaComando(sql);
        let lista = [];

        for (let row of rows) {
            lista.push(new DB_Usuario(row["usu_id"], row["usu_nome"], row["usu_email"], row["usu_senha"], row["per_id"]));
        }

        return lista;
    }

    async excluir(id) {
        let sql = "DELETE FROM tb_user WHERE usu_id = ?";
        let valores = [id];
        return await db.ExecutaComandoNonQuery(sql, valores);
    }

    async atualizar(id) {
        let sql = "UPDATE tb_user SET usu_nome = ?, usu_email = ?, usu_senha = ?, per_id = ? WHERE usu_id = ?";
        let valores = [this.#nome, this.#email, this.#senha, this.#perfilId, id];
        return await db.ExecutaComandoNonQuery(sql, valores);
    }

    toJSON() {
        return {
            id: this.#id,
            nome: this.#nome,
            email: this.#email,
            senha: this.#senha,
            perfilId: this.#perfilId
        };
    }
}

module.exports = DB_Usuario;
