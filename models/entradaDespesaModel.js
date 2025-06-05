const db = require('../utils/database');

class DB_EntradaDespesa {
    #id;
    #nome;
    #tipo;
    #valor;
    #valor_lucro;

    get id() { return this.#id; }
    set id(value) { this.#id = value; }
    get nome() { return this.#nome; }
    set nome(value) { this.#nome = value; }
    get tipo() { return this.#tipo; }
    set tipo(value) { this.#tipo = value; }
    get valor() { return this.#valor; }
    set valor(value) { this.#valor = value; }
    get valor_lucro() { return this.#valor_lucro; }
    set valor_lucro(value) { this.#valor_lucro = value; }

    constructor(id, nome, tipo, valor, valor_lucro) {
        this.#id = id;
        this.#nome = nome;
        this.#tipo = tipo;
        this.#valor = valor;
        this.#valor_lucro = valor_lucro;
    }

    async listar() {
        const DB = new db();
        const rows = await DB.ExecutaComando("SELECT * FROM tb_entrada_despesa ORDER BY id DESC", []);
        return rows;
    }

    async obter(id) {
        const DB = new db();
        const rows = await DB.ExecutaComando("SELECT * FROM tb_entrada_despesa WHERE id = ?", [id]);
        return rows;
    }

    async cadastrar() {
        const DB = new db();
        const sql = `INSERT INTO tb_entrada_despesa (nome, tipo, valor, valor_lucro) VALUES (?, ?, ?, ?)`;
        const params = [this.#nome, this.#tipo, this.#valor, this.#valor_lucro];
        const result = await DB.ExecutaComandoNonQuery(sql, params);
        this.#id = result.insertId;
        return result;
    }

    async atualizar() {
        const DB = new db();
        const sql = `UPDATE tb_entrada_despesa SET nome = ?, tipo = ?, valor = ?, valor_lucro = ? WHERE id = ?`;
        const params = [this.#nome, this.#tipo, this.#valor, this.#valor_lucro, this.#id];
        const result = await DB.ExecutaComandoNonQuery(sql, params);
        return result;
    }

    async excluir(id) {
        const DB = new db();
        const sql = `DELETE FROM tb_entrada_despesa WHERE id = ?`;
        const params = [id];
        try {
            const result = await DB.ExecutaComandoNonQuery(sql, params);
            return result;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    // Métodos específicos para relatórios financeiros
    async calcularLucroTotal() {
        const DB = new db();
        const sql = `
            SELECT 
                SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END) as total_entradas,
                SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0 END) as total_despesas,
                (SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END) - 
                 SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0 END)) as lucro_total
            FROM tb_entrada_despesa
        `;
        const rows = await DB.ExecutaComando(sql, []);
        return rows.length > 0 ? rows[0] : { total_entradas: 0, total_despesas: 0, lucro_total: 0 };
    }

    async listarPorTipo(tipo) {
        const DB = new db();
        const sql = "SELECT * FROM tb_entrada_despesa WHERE tipo = ? ORDER BY id DESC";
        const rows = await DB.ExecutaComando(sql, [tipo]);
        return rows;
    }

    async obterResumoFinanceiro() {
        const DB = new db();
        const sql = `
            SELECT 
                tipo,
                COUNT(*) as quantidade,
                SUM(valor) as total_valor,
                AVG(valor) as media_valor
            FROM tb_entrada_despesa 
            GROUP BY tipo
        `;
        const rows = await DB.ExecutaComando(sql, []);
        return rows;
    }

    async obterMovimentacaoRecente(limite = 10) {
        const DB = new db();
        const sql = "SELECT * FROM tb_entrada_despesa ORDER BY id DESC LIMIT ?";
        const rows = await DB.ExecutaComando(sql, [limite]);
        return rows;
    }

    toJSON() {
        return {
            id: this.#id,
            nome: this.#nome,
            tipo: this.#tipo,
            valor: this.#valor,
            valor_lucro: this.#valor_lucro
        };
    }
}

module.exports = DB_EntradaDespesa;
