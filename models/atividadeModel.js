const db = require('../utils/database'); 

class DB_Atividade {
    #ati_id;
    #titulo;
    #descricao;
    #data_criacao;
    #data_entrega;
    #id_professor;
    #anexo_atividade;
    
    get ati_id() { return this.#ati_id; }
    set ati_id(value) { this.#ati_id = value; }
    get titulo() { return this.#titulo; }
    set titulo(value) { this.#titulo = value; }
    get descricao() { return this.#descricao; }
    set descricao(value) { this.#descricao = value; }
    get data_criacao() { return this.#data_criacao; }
    set data_criacao(value) { this.#data_criacao = value; }
    get data_entrega() { return this.#data_entrega; }
    set data_entrega(value) { this.#data_entrega = value; }
    get id_professor() { return this.#id_professor; }
    set id_professor(value) { this.#id_professor = value; }
    get anexo_atividade() { return this.#anexo_atividade; }
    set anexo_atividade(value) { this.#anexo_atividade = value; }

    constructor(ati_id, titulo, descricao, data_criacao, data_entrega, id_professor, anexo_atividade) {
        this.#ati_id = ati_id;
        this.#titulo = titulo;
        this.#descricao = descricao;
        this.#data_criacao = data_criacao;
        this.#data_entrega = data_entrega;
        this.#id_professor = id_professor;
        this.#anexo_atividade = anexo_atividade;
    }

    async listar(filtro) {
        let value = [filtro];
        let sql = "SELECT * FROM tb_atividade";
        if (typeof filtro != 'undefined') {
            sql += " WHERE ati_id = ?";
        }
        let DB = new db();
        let rows = await DB.ExecutaComando(sql,value);
        let lista = [];

        rows.forEach(ati => {
            lista.push(new DB_Atividade(
                ati["ati_id"],
                ati["titulo"],
                ati["descricao"],
                ati["data_criacao"],
                ati["data_entrega"],
                ati["id_professor"],
                ati["anexo_atividade"],
            ));
        });

        return lista;
    }

    async gravar() {
        let sql = "INSERT INTO tb_atividade (titulo, descricao, data_criacao, data_entrega, id_professor, anexo_atividade) VALUES (?, ?, ?, ?, ?, ?)";
        let valores = [ this.#titulo, this.#descricao, this.#data_criacao, this.#data_entrega, this.#id_professor, this.#anexo_atividade ];
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(sql, valores);
    }

    async excluir(id) {
        let sql = "DELETE FROM tb_atividade WHERE ati_id = ?";
        let valores = [id];
        let DB = new db();
        let a = await DB.ExecutaComandoNonQuery(sql, valores);
        return a;
    }
    
    async atualizar() {
        let sql = "UPDATE tb_atividade SET titulo = ?, descricao = ?, data_criacao = ?, data_entrega = ?, id_professor = ?, anexo_atividade = ? WHERE ati_id = ?";
        let valores = [ this.#titulo, this.#descricao, this.#data_criacao, this.#data_entrega, this.#id_professor, this.#anexo_atividade, this.#ati_id ];
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(sql, valores);
    }

    toJSON() {
        return {
            ati_id: this.#ati_id,
            titulo: this.#titulo,
            descricao: this.#descricao,
            data_criacao: this.#data_criacao,
            data_entrega: this.#data_entrega,
            id_professor: this.#id_professor,
            anexo_atividade: this.#anexo_atividade,
        };
    }
}

module.exports = DB_Atividade;
