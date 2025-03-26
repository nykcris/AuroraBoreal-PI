const DB = require('../utils/database');
const db = new DB();

class DB_Usuario {

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

    /**
     * Insere um novo usuário no db de dados.
     *
     * Executa um comando SQL de inserção na tabela `tb_user` com os valores
     * do nome, email, senha, status de ativo e perfil do usuário atual.
     *
     * @returns {Promise<boolean>} Retorna um booleano indicando se a operação 
     * foi bem-sucedida.
     */

    async gravar() {
        let sql = `insert into tb_user 
                        (name_user, email_user, password_user, status_user, id_perfil)
                    values 
                        (?, ?, ?, ?, ?)`;
        let valores = [this.#nome, this.#email, this.#senha, this.#ativo, this.#perfilId]
        
        let resultado = await db.ExecutaComandoNonQuery(sql, valores);

        return resultado;
    }

    /**
     * Valida um usuário com base em email e senha.
     *
     * Executa um comando SQL de seleção na tabela `tb_user` com os valores
     * do email e senha recebidos como parâmetro. Caso exista um registro com
     * os valores informados e o status de ativo seja 1, retorna um objeto do tipo
     * `DB_Usuario` com os dados do usuário. Caso contrário, retorna `null`.
     *
     * @param {string} email - Email do usuário a ser validado.
     * @param {string} senha - Senha do usuário a ser validado.
     *
     * @returns {Promise<DB_Usuario|null>} Retorna um objeto do tipo `DB_Usuario`
     * com os dados do usuário caso a validação seja bem-sucedida, ou `null` caso
     * contrário.
     */
    async validar(email, senha) {

        let sql = `select * from tb_user where 
        email_user= ? and password_user = ? and status_user = 1`;
        let valores = [email, senha];
        

        let rows = await db.ExecutaComando(sql, valores);

        if(rows.length > 0) {
            let row = rows[0];
            return new DB_Usuario(row["id_user"], row["name_user"], 
            row["email_user"], row["password_user"], row["status_user"], row["id_perfil"])
        }

        return null;
    }

    /**
     * Retorna um array de objetos do tipo `DB_Usuario` com todos os usuários
     * com o ID recebido como parâmetro.
     *
     * @param {number} id - ID do usuário a ser obtido.
     *
     * @returns {Promise<DB_Usuario[]>} Retorna um array de objetos do tipo
     * `DB_Usuario` com os dados do usuário, ou um array vazio se o ID não
     * existir.
     */
    async obter(id) {

        let sql = "select * from tb_user where id_user = ?";
        let valores = [id];
        
        let rows = await db.ExecutaComando(sql, valores);
        let lista = [];
        for(let i = 0; i < rows.length; i++) {

            lista.push(new DB_Usuario(rows[i]["id_user"], 
                                        rows[i]["name_user"],
                                        rows[i]["email_user"],
                                        rows[i]["password_user"],
                                        rows[i]["status_user"],
                                        rows[i]["id_perfil"]));
        }

        return lista;

    }

    /**
     * Retorna um array de objetos do tipo `DB_Usuario` com todos os usuários
     * da base de dados.
     *
     * @returns {Promise<DB_Usuario[]>} Retorna um array de objetos do tipo
     * `DB_Usuario` com os dados de todos os usuários, ou um array vazio se
     * não houverem usuários.
     */
    async listar() {

        let sql = "select * from tb_user";
        
        let lista = [];
        let rows = await db.ExecutaComando(sql);
        for(let i = 0; i < rows.length; i++) {

            lista.push(new DB_Usuario(rows[i]["id_user"], 
                                        rows[i]["name_user"],
                                        rows[i]["email_user"],
                                        rows[i]["password_user"],
                                        rows[i]["status_user"],
                                        rows[i]["id_perfil"]));
        }

        return lista;
    }

    /**
     * Exclui um usuário com base no ID.
     *
     * Executa um comando SQL de exclusão na tabela `tb_user` com o valor
     * do ID recebido como parâmetro. Retorna um booleano indicando se a
     * operação foi bem-sucedida.
     *
     * @param {number} id - ID do usuário a ser excluído.
     *
     * @returns {Promise<boolean>} Retorna um booleano indicando se a operação
     * foi bem-sucedida.
     */
    async excluir(id){
        let sql = "delete from tb_user where id_user = ?";
        
        const valores = [id];
        const resultado = await db.ExecutaComandoNonQuery(sql,valores)
        return resultado;   //true ou false      
    }



}

module.exports = DB_Usuario;
