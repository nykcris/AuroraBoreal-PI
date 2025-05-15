const db = require("../utils/database");
const DB_Perfil = require("../models/perfilModel");
const DB_Usuarios = require("../models/usuarioModel");
const DB_Atividade = require("../models/atividadeModel");
const DB_Resposta = require("../models/respostaModel");
const DB_Aluno = require("../models/alunoModel");
const DB_Professor = require("../models/professorModel");
const DB_Disciplina = require("../models/disciplinaModel");
const DB_Turma = require("../models/turmaModel");
const DB_ProfessorTurmaDisciplina = require("../models/professorTurmaDisciplinaModel");

const DB = new db();

class ProfessorController {
  async professores(req, res) {
    let db_func = new DB_Usuarios();
    let funcs = await db_func.listar([2]);
    let rows = [];
    for (let i = 0; i < funcs.length; i++) {
      rows.push({
        usu_id: funcs[i].id,
        usu_nome: funcs[i].nome,
        usu_email: funcs[i].email,
        usu_senha: funcs[i].senha,

        per_id: funcs[i].perfilId,
      });
    }

    let db_atividade = new DB_Atividade();
    let atividades = await db_atividade.listar();
    let atividades_lista = [];
    for (let i = 0; i < atividades.length; i++) {
      atividades_lista.push({
        ati_id: atividades[i].ati_id,
        titulo: atividades[i].titulo,
        descricao: atividades[i].descricao,
        data_criacao: atividades[i].data_criacao,
        data_entrega: atividades[i].data_entrega,
        id_professor: atividades[i].id_professor,
        anexo_atividade: atividades[i].anexo_atividade,
      });
    }

    let atividades_row = [];
    let db_resposta = new DB_Resposta();

    for (let i = 0; i < atividades.length; i++) {
      atividades_row.push({
        titulo: atividades[i].titulo,
        data_entrega: atividades[i].data_entrega,
        respostas: await db_resposta.listar(atividades[i].ati_id, 2),
      });
      console.log(atividades[i].data_entrega);
    }

    res.render("Professor/professores_index", {
      layout: "layouts/layout",
      rows,
      atividades_cadastradas: atividades_lista,
      atividades_row,
    });
  }

  async deletarAtividades(req, res) {
    let DBA = new DB_Atividade();
    let sucesso = await DBA.excluir(req.query.id);

    if (sucesso) {
      console.log("Sucesso ao deletar a atividade");
      res.redirect("/system/professores");
    } else {
      console.log("Erro ao deletar atividade");
      res.send("Erro ao deletar atividade");
    }
  }

  async editarAtividades(req, res) {
    let DBA = new DB_Atividade();
    let lista = [];
    let atividade = await DBA.listar(req.query.id);
    console.log(atividade);

    res.render("Professor/editar_atividades", { layout: "layout", atividade });
  }

  async editarAtividadesPost(req, res) {
    let atividade = new DB_Atividade(
      req.body.id,
      req.body.titulo,
      req.body.descricao,
      new Date(),
      req.body.data_entrega,
      req.cookies.usuarioLogado,
      req.body.anexo_atividade
    );
    console.log(atividade.ati_id);
    console.log(atividade.ati_id);
    console.log(atividade.ati_id);

    let sucesso = await atividade.atualizar();

    res.redirect("/system/professores");
  }

  async CorrigirAtividadesPost(req, res) {
    let DBA = new DB_Resposta();
    let filtro = [];
    filtro.push(req.body.res_id);
    let update = await DBA.listar(filtro);
    if (update.length > 0) {
      DBA = new DB_Resposta(
        update[0].res_id,
        update[0].id_atividade,
        update[0].id_aluno,
        update[0].resposta,
        update[0].data_envio,
        req.body.nota,
        req.body.comentario_professor
      );
      let sucesso = await DBA.atualizar();
    }
    res.redirect("/system/professores");
  }

  async atividades(req, res) {
    let atividade = new DB_Atividade(
      0,
      req.body.titulo,
      req.body.descricao,
      new Date(), // data_criacao
      req.body.data_entrega,
      req.cookies.usuarioLogado,
      req.body.anexo_atividade // ou `req.file.filename` se estiver usando upload
    );
    let sucesso = await atividade.gravar(); // chama o método da própria instância

    console.log(sucesso);
    if (sucesso) {
      console.log("Sucesso ao gravar a atividade");
      res.redirect("/system/professores");
    } else {
      console.log("Erro ao gravar atividade");
      res.send("Erro ao gravar atividade");
    }
  }

  async cadastrarProfessorTurmaDisciplina(req, res) {
    console.log("Entrou na rota /system/cadastrarProfessorTurmaDisciplina");
    console.log(req.body);
    let DBT = new DB_Turma();
    let turma = await DBT.obter(req.body.turma);
    let DBD = new DB_Disciplina();
    let disciplina = await DBD.obter(req.body.disciplina);
    let DBP = new DB_Professor();
    let professor = await DBP.obter(req.body.professor);
    let DBPD = new DB_ProfessorTurmaDisciplina(
      0,
      professor[0].id,
      turma[0].id,
      disciplina[0].id
    );
    let sucesso = await DBPD.cadastrar(); // chama o método da própria instância
    if (sucesso) {
      console.log("Sucesso ao cadastrar professor disciplina");
      res.send("Sucesso ao cadastrar professor disciplina");
    } else {
      console.log("Erro ao cadastrar professor disciplina");
      res.send("Erro ao cadastrar professor disciplina");
    }
  }

  async cadastrarProfessor(req, res) {
    try {
      const {
        prof_nome,
        prof_cpf,
        prof_salario,
        email,
        senha,
        telefone
      } = req.body;
  
      // Verificação de campos obrigatórios
      if (!prof_nome || !prof_cpf || !prof_salario || !email || !senha || !telefone) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Preencha todos os campos obrigatórios."
        });
      }
  
      const novoProfessor = new DB_Professor(
        null, // id
        prof_nome,
        email,
        prof_cpf,
        senha,
        prof_salario,
        telefone
      );
  
      const resultado = await novoProfessor.cadastrar();
  
      if (resultado) {
        // resultado será true se a inserção foi bem-sucedida
        return res.status(201).json({
          sucesso: true,
          mensagem: "Professor cadastrado com sucesso!"
        });
      } else {
        return res.status(500).json({
          sucesso: false,
          mensagem: "Erro ao salvar professor no banco de dados."
        });
      }
  
    } catch (error) {
      if (error.errno == 1062) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Email já cadastrado."
        });
      }
      console.error("ERRO INTERNO no cadastro de professor:", error);
      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro interno no servidor ao tentar cadastrar o professor."
      });
    }

  }

  //========== Fetchs ==========
  async fetchNomeProfessor(req, res) {
    let DBP = new DB_Professor();
    let professores = await DBP.obter(req.query.id);
    res.send(professores);
  }

  async fetchListaProfessor(req, res) {
    let DBP = new DB_Professor();
    let professores = await DBP.listar();
    res.send(professores);
  }

  async fetchDisciplinasProfessor(req, res) {
    let DBPTD = new DB_ProfessorTurmaDisciplina();
    let disciplinas = await DBPTD.listarDisciplinasProfessor(
      req.body.professor
    );
    res.send(disciplinas);
  }
  //========== Fim Fetchs ==========
}

module.exports = ProfessorController;
