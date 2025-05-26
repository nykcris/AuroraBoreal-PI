const db = require('../utils/database');

class DB_Conteudo {
    #id; #nome; #descricao; #data_criacao; #id_turma_disciplina_professor; #anexo_conteudo;

    get id() { return this.#id; }
    set id(value) { this.#id = value; }
    get nome() { return this.#nome; }
    set nome(value) { this.#nome = value; }
    get descricao() { return this.#descricao; }
    set descricao(value) { this.#descricao = value; }
    get data_criacao() { return this.#data_criacao; }
    set data_criacao(value) { this.#data_criacao = value; }
    get id_turma_disciplina_professor() { return this.#id_turma_disciplina_professor; }
    set id_turma_disciplina_professor(value) { this.#id_turma_disciplina_professor = value; }
    get anexo_conteudo() { return this.#anexo_conteudo; }
    set anexo_conteudo(value) { this.#anexo_conteudo = value; }



    constructor(id, nome, descricao, data_criacao, id_turma_disciplina_professor, anexo_conteudo) {
        this.#id = id;
        this.#nome = nome;
        this.#descricao = descricao;
        this.#data_criacao = data_criacao;
        this.#id_turma_disciplina_professor = id_turma_disciplina_professor;
        this.#anexo_conteudo = anexo_conteudo;
    }

    async listar() {
        let DB = new db();
        let rows = await DB.ExecutaComando("SELECT * FROM tb_conteudo", []);
        return rows
    }

    async cadastrar() {
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(
            "INSERT INTO tb_conteudo (nome, descricao, data_criacao, id_turma_disciplina_professor, anexo_conteudo) VALUES (?, ?, ?, ?, ?)",
            [this.#nome, this.#descricao, this.#data_criacao, this.#id_turma_disciplina_professor, this.#anexo_conteudo]
        );
    }

    async obter(id) {
        let DB = new db();
        let rows = await DB.ExecutaComando("SELECT * FROM tb_conteudo WHERE id = ?", [id]);
        return rows;
    }

    async atualizar() {
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(
            "UPDATE tb_conteudo SET nome = ?, descricao = ?, data_criacao = ?, id_turma_disciplina_professor = ?, anexo_conteudo = ? WHERE id = ?",
            [this.#nome, this.#descricao, this.#data_criacao, this.#id_turma_disciplina_professor, this.#anexo_conteudo, this.#id]
        );
    }

    async excluir(id) {
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(
            "DELETE FROM tb_conteudo WHERE id = ?",
            [id]
        );
    }

    //---- Fetchs ----

    async fetchConteudos(req, res) {
        let DB = new db();
        let rows = await DB.ExecutaComando("SELECT * FROM tb_conteudo WHERE id_turma_disciplina_professor = ?", [req.query.materia]);
        return rows;
    }

    toJSON() {
        return {
            id: this.#id,
            nome: this.#nome,
            descricao: this.#descricao,
            data_criacao: this.#data_criacao,
            id_turma_disciplina_professor: this.#id_turma_disciplina_professor,
            anexo_conteudo: this.#anexo_conteudo
        };
    }
}

module.exports = DB_Conteudo;





