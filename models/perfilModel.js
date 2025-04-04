const db = require('../utils/database');

class DB_Perfil {
    #id;
    #nome;

    get id() {
        return this.#id;
    }
    set id(value) {
        this.#id = value;
    }

    get nome() {
        return this.#nome;
    }
    set nome(value) {
        this.#nome = value;
    }


    constructor(id, nome) {
        this.#id = id;
        this.#nome = nome;
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
                    str += " OR id_perfil = ?";
                } else {
                    str += " WHERE id_perfil = ?"
                    i++;
                }
                
            });
        }
        let DB = new db();
        let rows =  await DB.ExecutaComando(str,values);
        let lista = [];

        rows.forEach(perfil => {
            lista.push(new DB_Perfil(
                perfil["id_perfil"],
                perfil["desc_perfil"]
            ));
        });

        return lista;
    }

    cadastrar() {

        let str = "INSERT INTO tb_perfil(desc_perfil) VALUES (?)";
        let values = [];
        let DB = new db();
        DB.ExecutaComandoNonQuery(str,values);

    }
}


module.exports = DB_Perfil;
