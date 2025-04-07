const db = require('../utils/database'); 

class DB_Atividade {
    #ati_id;
    #titulo;
    #descricao;
    #data_criacao;
    #data_entrega;
    #id_professor;
    #anexo_atividade;
    
    get ati_id() {
        return this.#ati_id;
    }
    set ati_id(value) {
        this.#ati_id = value;
    }

    get titulo() {
        return this.#titulo;
    }
    set titulo(value) {
        this.#titulo = value;
    }

    get descricao() {
        return this.#descricao;
    }
    set descricao(value) {
        this.#descricao = value;
    }

    get data_criacao() {
        return this.#data_criacao;
    }
    set data_criacao(value) {
        this.#data_criacao = value;
    }
    
    get data_entrega() {
        return this.#data_entrega;
    }
    set data_entrega(value) {
        this.#data_entrega = value;
    }

    get id_professor() {
        return this.#id_professor;
    }
    set id_professor(value) {
        this.#id_professor = value;
    }

    get anexo_atividade() {
        return this.#anexo_atividade;
    }
    set anexo_atividade(value) {
        this.#anexo_atividade = value;
    }



    constructor(ati_id, titulo, descricao, data_criacao, data_entrega, id_professor, anexo_atividade) {
        this.#ati_id = ati_id;
        this.#titulo = titulo;
        this.#descricao = descricao;
        this.#data_criacao = data_criacao;
        this.#data_entrega = data_entrega;
        this.#id_professor = id_professor;
        this.#anexo_atividade = anexo_atividade;
    }

    /**
     * Retorna uma lista de atividades. Se o parâmetro for um array,
     * retorna os atividades com os IDs presentes no array. Se for undefined,
     * retorna todos os atividades.
     * @param {number[]|undefined} filtro - Um array de IDs ou undefined.
     * @return {DB_Atividade[]}
     */
    async listar(filtro) {
        let sql = "SELECT * FROM tb_atividade";
        let DB = new db();
        let rows = await DB.ExecutaComando(sql);
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
    
}

module.exports = DB_Atividade;
