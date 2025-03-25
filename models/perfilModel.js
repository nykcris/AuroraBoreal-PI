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

    async listar(filtro) {

        let str = "SELECT * FROM tb_perfil WHERE = ?";
        let values = filtro;
        if (typeof values == 'undefined') {
            str = "SELECT * FROM tb_perfil";
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
