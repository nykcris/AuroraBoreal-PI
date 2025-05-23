const db = require('../utils/database'); 
const DB_Aluno = require("./alunoModel");

class DB_Resposta {
    
    #res_id
    #id_atividade
    #id_aluno
    #resposta
    #anexo_resposta
    #data_envio
    #nota
    #comentario_professor
    #nome_aluno

    get res_id() {
        return this.#res_id;
    }
    set res_id(value) {
        this.#res_id = value;
    }

    get id_atividade() {
        return this.#id_atividade;
    }
    set id_atividade(value) {
        this.#id_atividade = value;
    }

    get id_aluno() {
        return this.#id_aluno;
    }
    set id_aluno(value) {
        this.#id_aluno = value;
    }

    get resposta() {
        return this.#resposta;
    }
    set resposta(value) {
        this.#resposta = value;
    }

    get data_envio() {
        return this.#data_envio;
    }
    set data_envio(value) {
        this.#data_envio = value;
    }

    get nota() {
        return this.#nota;
    }
    set nota(value) {
        this.#nota = value;
    }

    get comentario_professor() {
        return this.#comentario_professor;
    }
    set comentario_professor(value) {
        this.#comentario_professor = value;
    }

    get anexo_resposta() {
        return this.#anexo_resposta;
    }
    set anexo_resposta(value) {
        this.#anexo_resposta = value;
    }

    get nome_aluno() {
        return this.#nome_aluno;
    }
    set nome_aluno(value) {
        this.#nome_aluno = value;
    }

    constructor(res_id, id_atividade, id_aluno, resposta, anexo_resposta, data_envio, nota, comentario_professor, nome_aluno) {
        this.#res_id = res_id;
        this.#id_atividade = id_atividade;
        this.#id_aluno = id_aluno;
        this.#resposta = resposta;
        this.#anexo_resposta = anexo_resposta;
        this.#data_envio = data_envio;
        this.#nota = nota;
        this.#comentario_professor = comentario_professor;
        this.#nome_aluno = nome_aluno;
    }


    async listar(filtro,type) {
        let value = filtro;
        let sql = "SELECT * FROM tb_resposta";
        if (typeof filtro != 'undefined') {
            if(typeof type != 'undefined'){
                if(type == 1){
                    sql += " WHERE id_atividade = ?";
                    sql += " and id_aluno = ?";
                }else if(type == 2){
                    sql += " WHERE id_atividade = ?";
                }
                
            }else{
                sql += " WHERE res_id = ?";
            }
        }
        let DB = new db();
        let rows = await DB.ExecutaComando(sql,value);
        let lista = [];

        rows.forEach(async resp => {
            let db_Aluno = new DB_Aluno();
            let aluno = await db_Aluno.obter(resp['id_aluno']);
            lista.push(new DB_Resposta(
                resp['res_id'],
                resp['id_atividade'],
                resp['id_aluno'],
                resp['resposta'],
                resp['data_envio'],
                resp['nota'],
                resp['comentario_professor'],
                resp['anexo_resposta'],
                aluno
            ));
        });

        return lista;
    }

    async gravar() {
        let sql = "INSERT INTO tb_resposta (id_atividade, id_aluno, resposta, data_envio, nota, comentario_professor, anexo_resposta) VALUES (?,?,?,?,?,?,?)";
        let valores = [this.#id_atividade, this.#id_aluno, this.#resposta, this.#data_envio, this.#nota, this.#comentario_professor, this.#anexo_resposta];
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(sql, valores);
    }

    async excluir(id) {
        let sql = "DELETE FROM tb_resposta WHERE res_id = ?";
        let valores = [id];
        let DB = new db();
        let a = await DB.ExecutaComandoNonQuery(sql, valores);
        return a;
    }
    
    async atualizar() {
        let sql = "UPDATE tb_resposta SET id_atividade = ?, id_aluno = ?, resposta = ?, data_envio = ?, nota = ?, comentario_professor = ?, anexo_resposta = ? WHERE res_id = ?";
        let valores = [this.#id_atividade, this.#id_aluno, this.#resposta, this.#data_envio, this.#nota, this.#comentario_professor, this.#anexo_resposta, this.#res_id];
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(sql, valores);
    }

    toJSON() {
        return {
            res_id: this.#res_id,
            id_atividade: this.#id_atividade,
            id_aluno: this.#id_aluno,
            resposta: this.#resposta,
            data_envio: this.#data_envio,
            nota: this.#nota,
            comentario_professor: this.#comentario_professor,
            anexo_resposta: this.#anexo_resposta,
            nome_aluno: this.#nome_aluno
        };
    }

}

module.exports = DB_Resposta;
