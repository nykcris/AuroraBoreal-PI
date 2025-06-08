const db = require('../utils/database');

class DB_Professor {
    #id; 
    #nome; 
    #email; 
    #cpf; 
    #senha; 
    #salario; 
    #telefone;

    get id() { return this.#id; }
    set id(value) { this.#id = value; }
    get nome() { return this.#nome; }
    set nome(value) { this.#nome = value; }
    get email() { return this.#email; }
    set email(value) { this.#email = value; }
    get cpf() { return this.#cpf; }
    set cpf(value) { this.#cpf = value; }
    get senha() { return this.#senha; }
    set senha(value) { this.#senha = value; }
    get salario() { return this.#salario; }
    set salario(value) { this.#salario = value; }
    get telefone() { return this.#telefone; }
    set telefone(value) { this.#telefone = value; }

    constructor(id, nome, email, cpf, senha, salario, telefone) {
        this.#id = id;
        this.#nome = nome;
        this.#email = email;
        this.#cpf = cpf;
        this.#senha = senha;
        this.#salario = salario;
        this.#telefone = telefone;
    }


    async listar() {
        const DB = new db();
        const rows = await DB.ExecutaComando("SELECT * FROM tb_professor", []);
        return rows;
    }

    async obter(id) {
        const DB = new db();
        const rows = await DB.ExecutaComando("SELECT * FROM tb_professor WHERE id = ?", [id]);
        return rows;
    }

    async validar(email, senha, usuId) {
        const DB = new db();
        let sql = "SELECT * FROM tb_professor WHERE email = ? AND senha = ?";
        if(usuId != null){
            sql += " AND id = ?";
        }
        const rows = await DB.ExecutaComando(sql, [email, senha, usuId]);
        return rows.length > 0 ? rows[0] : null;
    }

    async cadastrar() {
        const DB = new db();
        const sql = `INSERT INTO tb_professor (nome, email, cpf, senha, salario, telefone) VALUES (?, ?, ?, ?, ?, ?)`;
        const params = [this.#nome, this.#email, this.#cpf, this.#senha, this.#salario, this.#telefone];
        const result = await DB.ExecutaComandoNonQuery(sql, params);
        this.#id = result.insertId;
        return result;
    }

    async atualizar() {
        const DB = new db();
        const sql = `UPDATE tb_professor SET nome = ?, email = ?, cpf = ?, senha = ?, salario = ?, telefone = ? WHERE id = ?`;
        const params = [this.#nome, this.#email, this.#cpf, this.#senha, this.#salario, this.#telefone, this.#id];
        const result = await DB.ExecutaComandoNonQuery(sql, params);
        return result;
    }

    async excluir(id) {
        const DB = new db();
        const sql = `DELETE FROM tb_professor WHERE id = ?`;
        const params = [id];
        try {
            const result = await DB.ExecutaComandoNonQuery(sql, params);
            return result;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async atualizarPerfil(id, nome, email, telefone, senha, cpf, salario) {
        try {
            const DB = new db();

            console.log("=== MODELO PROFESSOR - ATUALIZAR PERFIL ===");
            console.log("ID recebido:", id);
            console.log("Parâmetros recebidos:", { nome, email, telefone, senha: senha ? "***" : null, cpf, salario });

            // Verificar se o ID é válido
            if (!id || id === 'undefined' || id === 'null') {
                console.error("ID inválido para atualização:", id);
                return { success: false, message: "ID inválido para atualização" };
            }

            // Primeiro, verificar se o registro existe
            const verificaExistencia = await DB.ExecutaComando("SELECT id FROM tb_professor WHERE id = ?", [id]);
            console.log("Registro encontrado:", verificaExistencia);

            if (!verificaExistencia || verificaExistencia.length === 0) {
                console.error("Nenhum registro encontrado com ID:", id);
                return { success: false, message: "Professor não encontrado" };
            }

            // Construir SQL dinamicamente apenas para campos que foram fornecidos
            let campos = [];
            let valores = [];

            if (nome && nome.trim() !== '') {
                campos.push('nome = ?');
                valores.push(nome.trim());
                console.log("Adicionando nome:", nome.trim());
            }

            if (email && email.trim() !== '') {
                campos.push('email = ?');
                valores.push(email.trim());
                console.log("Adicionando email:", email.trim());
            }

            if (telefone && telefone.trim() !== '') {
                campos.push('telefone = ?');
                valores.push(telefone.trim());
                console.log("Adicionando telefone:", telefone.trim());
            }

            if (senha && senha.trim() !== '') {
                campos.push('senha = ?');
                valores.push(senha.trim());
                console.log("Adicionando senha: ***");
            }

            if (cpf && cpf.trim() !== '') {
                campos.push('cpf = ?');
                valores.push(cpf.trim());
                console.log("Adicionando cpf:", cpf.trim());
            }

            if (salario && salario.toString().trim() !== '') {
                campos.push('salario = ?');
                valores.push(parseFloat(salario));
                console.log("Adicionando salario:", parseFloat(salario));
            }

            if (campos.length === 0) {
                console.log("Nenhum campo para atualizar");
                return { success: false, message: "Nenhum campo para atualizar" };
            }

            valores.push(parseInt(id)); // Garantir que o ID seja um número

            const sql = `UPDATE tb_professor SET ${campos.join(', ')} WHERE id = ?`;

            console.log("SQL de atualização:", sql);
            console.log("Valores finais:", valores);

            const result = await DB.ExecutaComandoNonQuery(sql, valores);
            console.log("Resultado da atualização:", result);
            console.log("Tipo do resultado:", typeof result);
            console.log("affectedRows:", result.affectedRows);
            console.log("changedRows:", result.changedRows);

            if (result.affectedRows > 0) {
                console.log("Atualização bem-sucedida");
                return { success: true, message: "Perfil atualizado com sucesso!" };
            } else {
                console.log("Nenhuma linha foi afetada");
                return { success: false, message: "Nenhum registro foi atualizado" };
            }

        } catch (error) {
            console.error("Erro no modelo ao atualizar perfil do professor:", error);
            return { success: false, message: "Erro interno do servidor: " + error.message };
        }
    }


    toJSON() {
        return {
            id: this.#id,
            nome: this.#nome,
            email: this.#email,
            cpf: this.#cpf,
            senha: this.#senha,
            salario: this.#salario,
            telefone: this.#telefone
        };
    }
}

module.exports = DB_Professor;
