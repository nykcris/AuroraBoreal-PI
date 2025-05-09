const db = require('../utils/database');

class DB_Aluno {
    #id; #aluno_nome; #aluno_cpf; #turma_id; #email; #senha;
    #aluno_nasc; #responsavel_nome; #responsavel_cpf; #responsavel_tel;

    get id() { return this.#id; }
    set id(value) { this.#id = value; }
    get aluno_nome() { return this.#aluno_nome; }
    set aluno_nome(value) { this.#aluno_nome = value; }
    get aluno_cpf() { return this.#aluno_cpf; }
    set aluno_cpf(value) { this.#aluno_cpf = value; }
    get turma_id() { return this.#turma_id; }
    set turma_id(value) { this.#turma_id = value; }
    get email() { return this.#email; }
    set email(value) { this.#email = value; }
    get senha() { return this.#senha; }
    set senha(value) { this.#senha = value; }
    get aluno_nasc() { return this.#aluno_nasc; }
    set aluno_nasc(value) { this.#aluno_nasc = value; }
    get responsavel_nome() { return this.#responsavel_nome; }
    set responsavel_nome(value) { this.#responsavel_nome = value; }
    get responsavel_cpf() { return this.#responsavel_cpf; }
    set responsavel_cpf(value) { this.#responsavel_cpf = value; }
    get responsavel_tel() { return this.#responsavel_tel; }
    set responsavel_tel(value) { this.#responsavel_tel = value; }

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
        const DB = new db();
        const sql = `
            SELECT 
                a.*, 
                t.nome AS turma_nome 
            FROM tb_aluno a
            JOIN tb_turma t ON a.turma_id = t.id
        `;

        const rows = await DB.ExecutaComando(sql, []);
        return rows; // Retorna os dados direto, sem encapsular na classe
    }

    async obter(id) {
        const DB = new db();
        const sql = `
            SELECT * FROM tb_aluno WHERE id = ?
        `;

        const rows = await DB.ExecutaComando(sql, [id]);
        return rows; // Retorna os dados direto, sem encapsular na classe
    }

    

    async cadastrar() {
        const DB = new db();
        const sql = `
            INSERT INTO tb_aluno (
                aluno_nome, aluno_cpf, turma_id, email, senha, aluno_nasc, 
                responsavel_nome, responsavel_cpf, responsavel_tel
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const valores = [
            this.#aluno_nome,
            this.#aluno_cpf,
            this.#turma_id,
            this.#email,
            this.#senha,
            this.#aluno_nasc,
            this.#responsavel_nome,
            this.#responsavel_cpf,
            this.#responsavel_tel
        ];

        return await DB.ExecutaComandoNonQuery(sql, valores); // retorna true ou false
    }

    async excluir(id) {
        const DB = new db();
        const sql = `DELETE FROM tb_aluno WHERE id = ?`;
        const valores = [id];

        return await DB.ExecutaComandoNonQuery(sql, valores); // retorna true ou false
    }

    async validar(email, senha) {
        const DB = new db();
        const sql = `SELECT * FROM tb_aluno WHERE email = ? AND senha = ?`;
        const valores = [email, senha];

        const rows = await DB.ExecutaComando(sql, valores);
        return rows.length > 0 ? rows[0] : null;
    }

    toJSON() {
        return {
            id: this.#id,
            aluno_nome: this.#aluno_nome,
            aluno_cpf: this.#aluno_cpf,
            turma_id: this.#turma_id,
            email: this.#email,
            senha: this.#senha,
            aluno_nasc: this.#aluno_nasc,
            responsavel_nome: this.#responsavel_nome,
            responsavel_cpf: this.#responsavel_cpf,
            responsavel_tel: this.#responsavel_tel
        };
    }
}

module.exports = DB_Aluno;
