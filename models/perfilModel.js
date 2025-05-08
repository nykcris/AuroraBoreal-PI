const db = require('../utils/database'); 

class DB_Perfil {
    #id;
    #descricao;

    get id() {
        return this.#id;
    }
    set id(value) {
        this.#id = value;
    }

    get descricao() {
        return this.#descricao;
    }
    set descricao(value) {
        this.#descricao = value;
    }

    constructor(id, descricao) {
        this.#id = id;
        this.#descricao = descricao;
    }

    /**
     * Retorna uma lista de perfis. Se o parâmetro for um array,
     * retorna os perfis com os IDs presentes no array. Se for undefined,
     * retorna todos os perfis.
     * @param {number[]|undefined} filtro - Um array de IDs ou undefined.
     * @return {DB_Perfil[]}
     */
    async listar(filtro) {
        let str = "SELECT * FROM tb_perfil";
        let values = filtro;
        if (typeof values != 'undefined') {
            let i = 0;
            values.forEach(fil => {
                if (i != 0) {
                    str += " OR per_id = ?";
                } else {
                    str += " WHERE per_id = ?";
                    i++;
                }
            });
        }
        let DB = new db();
        let rows = await DB.ExecutaComando(str, values);
        let lista = [];

        rows.forEach(perfil => {
            lista.push(new DB_Perfil(
                perfil["per_id"],
                perfil["per_descricao"]
            ));
        });

        return lista;
    }

    cadastrar() {
        let str = "INSERT INTO tb_perfil(per_descricao) VALUES (?)";
        let values = [this.#descricao];
        let DB = new db();
        DB.ExecutaComandoNonQuery(str, values);
    }

    toJSON() {
        return {
            id: this.#id,
            descricao: this.#descricao
        };
    }
}

module.exports = DB_Perfil;
