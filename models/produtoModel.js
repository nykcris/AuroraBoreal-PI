const db = require('../utils/database');

class DB_Produto {
    #id; #nome; #descricao; #quantidade; #valor; #tipo; #data_registro;

    get id() { return this.#id; }
    set id(value) { this.#id = value; }
    get nome() { return this.#nome; }
    set nome(value) { this.#nome = value; }
    get descricao() { return this.#descricao; }
    set descricao(value) { this.#descricao = value; }
    get quantidade() { return this.#quantidade; }
    set quantidade(value) { this.#quantidade = value; }
    get valor() { return this.#valor; }
    set valor(value) { this.#valor = value; }
    get tipo() { return this.#tipo; }
    set tipo(value) { this.#tipo = value; }
    get data_registro() { return this.#data_registro; }
    set data_registro(value) { this.#data_registro = value; }

    constructor(id, nome, descricao, quantidade, valor, tipo) {
        this.#id = id;
        this.#nome = nome;
        this.#descricao = descricao;
        this.#quantidade = quantidade;
        this.#valor = valor;
        this.#tipo = tipo;
        this.#data_registro = new Date();
    }

    async listar() {
        let DB = new db();
        let rows = await DB.ExecutaComando("SELECT * FROM tb_produtos", []);
        return rows
    }

    async cadastrar() {
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(
            "INSERT INTO tb_produtos (nome_produto, descricao, quantidade, valor, tipo_produto, data_registro) VALUES (?, ?, ?, ?, ?, ?)",
            [this.#nome, this.#descricao, this.#quantidade, this.#valor, this.#tipo, this.#data_registro]
        );
    }

    async obter(id) {
        let DB = new db();
        let rows = await DB.ExecutaComando("SELECT * FROM tb_produtos WHERE id = ?", [id]);
        return rows;
    }

    async atualizar() {
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(
            "UPDATE tb_produtos SET nome = ?, descricao = ?, quantidade = ?, valor = ?, tipo = ? WHERE id = ?",
            [this.#nome, this.#descricao, this.#quantidade, this.#valor, this.#tipo, this.#id]
        );
    }

    async excluir(id) {
        let DB = new db();
        return await DB.ExecutaComandoNonQuery(
            "DELETE FROM tb_produtos WHERE id = ?",
            [id]
        );
    }

    toJSON() {
        return {
            id: this.#id,
            nome: this.#nome,
            descricao: this.#descricao,
            quantidade: this.#quantidade,
            valor: this.#valor,
            tipo: this.#tipo,
            data_registro: this.#data_registro
        };
    }
}

module.exports = DB_Produto;





