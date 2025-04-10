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
        //const rows = await DB.ExecutaComando("SELECT * FROM tb_aluno", []);
        //return rows.map(aluno => new DB_Aluno(...Object.values(aluno)));
    

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
}

module.exports = DB_Aluno;
