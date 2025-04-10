// models/professorDisciplinaModel.js
const db = require('../utils/database');

class DB_ProfessorDisciplina {
    static async listarContratos() {
        const DB = new db();
        const rows = await DB.ExecutaComando(`
            SELECT pd.id AS contrato_id, p.nome AS professor, d.nome AS disciplina
            FROM tb_professor_disciplina pd
            JOIN tb_professor p ON pd.id_professor = p.id
            JOIN tb_disciplina d ON pd.id_disciplina = d.id
        `, []);
        return rows;
    }

    static async cadastrar(idProfessor, idDisciplina) {
        const DB = new db();
        return await DB.ExecutaComandoNonQuery(`
            INSERT INTO tb_professor_disciplina (id_professor, id_disciplina) VALUES (?, ?)
        `, [idProfessor, idDisciplina]);
    }
}

module.exports = DB_ProfessorDisciplina;
