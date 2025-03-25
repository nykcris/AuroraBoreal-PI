const db = require('../utils/database');

class DB_Usuarios {
    #id;
    #nome;
    #email;
    #senha;
    #ativo;
    #perfilId;

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

    get email() {
        return this.#email;
    }
    set email(value) {
        this.#email = value;
    }

    get senha() {
        return this.#senha;
    }
    set senha(value) {
        this.#senha = value;
    }

    get ativo() {
        return this.#ativo;
    }
    set ativo(value) {
        this.#ativo = value;
    }

    get perfilId() {
        return this.#perfilId;
    }
    set perfilId(value) {
        this.#perfilId = value;
    }

    constructor(id, nome, email, senha, ativo, perfilId) {
        this.#id = id;
        this.#nome = nome;
        this.#email = email;
        this.#senha = senha;
        this.#ativo = ativo;
        this.#perfilId = perfilId;
    }

    async listar(filtro) {

        let str = "";
        let rows = [];
        let values = filtro;
        let DB = new db();
        if (typeof values == 'undefined') {
            str = "SELECT * FROM tb_user";
            rows =  await DB.ExecutaComando(str);
        }else{
            str = "SELECT * FROM tb_user WHERE id_perfil = ?";
            rows =  await DB.ExecutaComando(str,values);
        }
        
        let lista = [];
        console.log(rows);
        rows.forEach(user => {
            lista.push(new DB_Usuarios(
                user["id_user"],
                user["name_user"],
                user["email_user"],
                user["password_user"],
                user["status_user"],
                user["id_perfil"],
            ));
        });

        return lista;
    }
}


module.exports = DB_Usuarios;
