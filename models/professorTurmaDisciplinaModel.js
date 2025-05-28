
const db = require('../utils/database');

class DB_ProfessorTurmaDisciplina {

    #id;
    #id_professor;
    #id_turma;
    #id_disciplina;

    get id() { return this.#id; }
    set id(value) { this.#id = value; }
    get id_professor() { return this.#id_professor; }
    set id_professor(value) { this.#id_professor = value; }
    get id_turma() { return this.#id_turma; }
    set id_turma(value) { this.#id_turma = value; }
    get id_disciplina() { return this.#id_disciplina; }
    set id_disciplina(value) { this.#id_disciplina = value; }

    constructor(id, id_professor, id_turma, id_disciplina) {
        this.#id = id;
        this.#id_professor = id_professor;
        this.#id_turma = id_turma;
        this.#id_disciplina = id_disciplina;
    }


    static async listarContratos() {
        const DB = new db();
        const rows = await DB.ExecutaComando(`
            SELECT pd.id AS contrato_id, p.nome AS professor, d.nome AS disciplina
            FROM tb_turma_disciplina_professor pd
            JOIN tb_professor p ON pd.professor_id = p.id
            JOIN tb_disciplina d ON pd.disciplina_id = d.id
        `, []);
        return rows;
    }

    async cadastrar() {
        try {
            const DB = new db();
            let comp = await this.listarDisciplinas(this.#id_turma);
            console.log(comp);
            if(comp.length > 0){
                for(let i = 0; i < comp.length; i++){
                    if(comp[i].disciplina_id == this.#id_disciplina && comp[i].professor_id == this.#id_professor && comp[i].turma_id == this.#id_turma){
                        return { success: false, message: "Esta combinação de turma e disciplina já existe" };
                    }
                }
            }
            const sql = `INSERT INTO tb_turma_disciplina_professor (professor_id, turma_id, disciplina_id) VALUES (?, ?, ?)`;
            const params = [this.#id_professor, this.#id_turma, this.#id_disciplina];
            
            try {
                const result = await DB.ExecutaComandoNonQuery(sql, params);
                this.#id = result.insertId;
                return { success: true, data: result };
            } catch (dbError) {
                // Check for duplicate entry error
                if (dbError.code === 'ER_DUP_ENTRY') {
                    console.log("Tentativa de inserção duplicada detectada:", dbError.sqlMessage);
                    return { 
                        success: false, 
                        message: "Esta combinação de professor, turma e disciplina já existe",
                        error: dbError.sqlMessage
                    };
                }
                // Re-throw other database errors
                throw dbError;
            }
        } catch (error) {
            console.error("Erro ao cadastrar:", error);
            return { 
                success: false, 
                message: "Erro ao cadastrar professor-turma-disciplina", 
                error: error.message 
            };
        }
    }

    async listarDisciplinas(id_turma) {
        const DB = new db();
        const rows = await DB.ExecutaComando(`
            SELECT pd.id, pd.turma_id, pd.disciplina_id, pd.professor_id, d.nome
            FROM tb_turma_disciplina_professor pd
            JOIN tb_disciplina d ON pd.disciplina_id = d.id
            WHERE pd.id IN (
                SELECT MIN(id)
                FROM tb_turma_disciplina_professor
                WHERE turma_id = pd.turma_id
                GROUP BY disciplina_id
            )
            AND pd.turma_id = ?;

        `, [id_turma]);
        return rows;
    }

    async listarTurmasDisciplina(id_disciplina) {
        const DB = new db();
        const rows = await DB.ExecutaComando(`
            SELECT pd.id, pd.turma_id, pd.disciplina_id, pd.professor_id, t.nome, d.nome AS disciplina_nome
            FROM tb_turma_disciplina_professor pd
            JOIN tb_turma t ON pd.turma_id = t.id
            JOIN tb_disciplina d ON pd.disciplina_id = d.id            
            WHERE pd.disciplina_id = ?
        `, [id_disciplina]);
        return rows;
    }

    async listarDisciplinasProfessor(id_professor) {
        const DB = new db();
        const rows = await DB.ExecutaComando(`
            SELECT pd.id, pd.turma_id, pd.disciplina_id, pd.professor_id, t.nome, d.nome AS disciplina_nome
            FROM tb_turma_disciplina_professor pd
            JOIN tb_turma t ON pd.turma_id = t.id
            JOIN tb_disciplina d ON pd.disciplina_id = d.id
            WHERE pd.professor_id = ?
        `, [id_professor]);
        return rows;
    }

    async listarDisciplinasTurmaProfessor(id_turma, id_professor) {
        const DB = new db();
        const rows = await DB.ExecutaComando(`
            SELECT pd.id, pd.turma_id, pd.disciplina_id, pd.professor_id, t.nome, d.nome AS disciplina_nome
            FROM tb_turma_disciplina_professor pd
            JOIN tb_turma t ON pd.turma_id = t.id
            JOIN tb_disciplina d ON pd.disciplina_id = d.id
            WHERE pd.turma_id = ? AND pd.professor_id = ?
        `, [id_turma, id_professor]);
        return rows;
    }

    async listarTurmasDisciplina(id_disciplina) {
        const DB = new db();
        const rows = await DB.ExecutaComando(`
            SELECT pd.id, pd.turma_id, pd.disciplina_id, pd.professor_id, t.nome, d.nome AS disciplina_nome
            FROM tb_turma_disciplina_professor pd
            JOIN tb_turma t ON pd.turma_id = t.id
            JOIN tb_disciplina d ON pd.disciplina_id = d.id
            WHERE pd.disciplina_id = ?
        `, [id_disciplina]);
        return rows;
    }


    async listarTurmasProfessor(id_professor) {
        const DB = new db();
        const rows = await DB.ExecutaComando(`
            SELECT pd.id, pd.turma_id, pd.disciplina_id, pd.professor_id, t.nome, d.nome AS disciplina_nome
            FROM tb_turma_disciplina_professor pd
            JOIN tb_turma t ON pd.turma_id = t.id
            JOIN tb_disciplina d ON pd.disciplina_id = d.id            
            WHERE pd.professor_id = ?
        `, [id_professor]);
        return rows;
    }

    async fetchDisciplinaTurmaId(turma, disciplina) {
        const DB = new db();
        const rows = await DB.ExecutaComando(`
            SELECT pd.id, pd.turma_id, pd.disciplina_id, pd.professor_id, t.nome, d.nome AS disciplina_nome
            FROM tb_turma_disciplina_professor pd
            JOIN tb_turma t ON pd.turma_id = t.id
            JOIN tb_disciplina d ON pd.disciplina_id = d.id
            WHERE pd.turma_id = ? AND pd.disciplina_id = ?
        `, [turma, disciplina]);
        return rows;
    }


    async excluir(id) {
        const DB = new db();
        const sql = `DELETE FROM tb_turma_disciplina_professor WHERE id = ?`;
        const params = [id];
        try {
            const result = await DB.ExecutaComandoNonQuery(sql, params);
            return result;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    toJSON() {
        return {
            id: this.#id,
            id_professor: this.#id_professor,
            id_turma: this.#id_turma,
            id_disciplina: this.#id_disciplina
        };
    }
}

module.exports = DB_ProfessorTurmaDisciplina;
