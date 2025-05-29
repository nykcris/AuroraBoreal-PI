const db = require('../utils/database');

class DB_MaterialUso {
    #id; #produto_id; #professor_id; #quantidade_usada; #data_uso; #observacoes;

    get id() { return this.#id; }
    set id(value) { this.#id = value; }
    get produto_id() { return this.#produto_id; }
    set produto_id(value) { this.#produto_id = value; }
    get professor_id() { return this.#professor_id; }
    set professor_id(value) { this.#professor_id = value; }
    get quantidade_usada() { return this.#quantidade_usada; }
    set quantidade_usada(value) { this.#quantidade_usada = value; }
    get data_uso() { return this.#data_uso; }
    set data_uso(value) { this.#data_uso = value; }
    get observacoes() { return this.#observacoes; }
    set observacoes(value) { this.#observacoes = value; }

    constructor(id, produto_id, professor_id, quantidade_usada, observacoes) {
        this.#id = id;
        this.#produto_id = produto_id;
        this.#professor_id = professor_id;
        this.#quantidade_usada = quantidade_usada;
        this.#data_uso = new Date();
        this.#observacoes = observacoes;
    }

    async registrarUso() {
        let DB = new db();
        try {
            // Primeiro, verifica se há estoque suficiente
            const produto = await DB.ExecutaComando(
                "SELECT quantidade FROM tb_produtos WHERE id = ?", 
                [this.#produto_id]
            );
            
            if (!produto || produto.length === 0) {
                throw new Error("Produto não encontrado");
            }
            
            if (produto[0].quantidade < this.#quantidade_usada) {
                throw new Error("Estoque insuficiente");
            }

            // Registra o uso
            const resultUso = await DB.ExecutaComandoNonQuery(
                "INSERT INTO tb_material_uso (produto_id, professor_id, quantidade_usada, data_uso, observacoes) VALUES (?, ?, ?, ?, ?)",
                [this.#produto_id, this.#professor_id, this.#quantidade_usada, this.#data_uso, this.#observacoes]
            );

            if (resultUso) {
                // Reduz o estoque
                const resultEstoque = await DB.ExecutaComandoNonQuery(
                    "UPDATE tb_produtos SET quantidade = quantidade - ? WHERE id = ?",
                    [this.#quantidade_usada, this.#produto_id]
                );
                return resultEstoque;
            }
            
            return false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async listar() {
        let DB = new db();
        let rows = await DB.ExecutaComando(`
            SELECT 
                mu.id,
                mu.quantidade_usada,
                mu.data_uso,
                mu.observacoes,
                p.nome_produto,
                u.usu_nome as professor_nome
            FROM tb_material_uso mu
            JOIN tb_produtos p ON mu.produto_id = p.id
            JOIN tb_usuarios u ON mu.professor_id = u.usu_id
            ORDER BY mu.data_uso DESC
        `, []);
        return rows;
    }

    async listarPorProfessor(professor_id) {
        let DB = new db();
        let rows = await DB.ExecutaComando(`
            SELECT 
                mu.id,
                mu.quantidade_usada,
                mu.data_uso,
                mu.observacoes,
                p.nome_produto,
                p.tipo_produto
            FROM tb_material_uso mu
            JOIN tb_produtos p ON mu.produto_id = p.id
            WHERE mu.professor_id = ?
            ORDER BY mu.data_uso DESC
        `, [professor_id]);
        return rows;
    }

    toJSON() {
        return {
            id: this.#id,
            produto_id: this.#produto_id,
            professor_id: this.#professor_id,
            quantidade_usada: this.#quantidade_usada,
            data_uso: this.#data_uso,
            observacoes: this.#observacoes
        };
    }
}

module.exports = DB_MaterialUso;
