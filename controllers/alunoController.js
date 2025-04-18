const DB_Perfil = require("../models/perfilModel");
const DB_Usuarios = require("../models/usuarioModel");
const DB_Atividade = require("../models/atividadeModel");
const DB_Resposta = require("../models/respostaModel");
const DB_Aluno = require("../models/alunoModel");
const DB_Professor = require('../models/professorModel');
const DB_Disciplina = require("../models/disciplinaModel");

class AlunoController {
  async alunos(req,res) {
    console.log("Entrou na página de alunos");
    
    let db_aluno = new DB_Usuarios();
    let alunos = await db_aluno.listar([1]);
    let rows = [];
    for (let i = 0; i < alunos.length; i++) {
        rows.push({
            "usu_id":alunos[i].id,
            "usu_nome":alunos[i].nome,
            "email_user":alunos[i].email,
            "usu_senha":alunos[i].senha,
            "per_id":alunos[i].perfilId
        })
    }
    console.log("Numeros de Alunos:" + rows.length);

    let db_atividade = new DB_Atividade();
    let db_resposta = new DB_Resposta();
    let atividades = await db_atividade.listar();
    let atividadesFeitas = [];
    for (let i = 0; i < atividades.length; i++) {
        let filtro = [];
        filtro.push(atividades[i].ati_id);
        filtro.push(req.cookies.usuarioLogado);
        let respostas = await db_resposta.listar(filtro,1);
        console.log(respostas);
        atividadesFeitas.push(respostas.length > 0 ? {feito:1,nota:respostas[0].nota} : {feito:0,nota:0});
    }
    
    
    res.render("alunos_index",{ layout: 'layouts/layout', rows, atividades_cadastradas:atividades, atividadesFeitas });
  }

  async postCadastrarAluno(req, res) {
    console.log("DADOS RECEBIDOS:", req.body);

    try {
      const {
        aluno_nome,
        aluno_cpf,
        turma_id,
        email,
        senha,
        aluno_nasc,
        responsavel_nome,
        responsavel_cpf,
        responsavel_tel
      } = req.body;

      // Verificação de campos obrigatórios
      if (
        !aluno_nome || !aluno_cpf || !turma_id || !email || !senha ||
        !aluno_nasc || !responsavel_nome || !responsavel_cpf || !responsavel_tel
      ) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Preencha todos os campos obrigatórios."
        });
      }

      const novoAluno = new DB_Aluno(
        null, // id
        aluno_nome,
        aluno_cpf,
        turma_id,
        email,
        senha,
        aluno_nasc,
        responsavel_nome,
        responsavel_cpf,
        responsavel_tel
      );

      const resultado = await novoAluno.cadastrar();

      if (resultado) { // resultado será true se a inserção foi bem-sucedida
        return res.status(201).json({
          sucesso: true,
          mensagem: "Aluno cadastrado com sucesso!"
        });
      } else {
        return res.status(500).json({
          sucesso: false,
          mensagem: "Erro ao salvar aluno no banco de dados."
        });
      }

    } catch (error) {
      console.error("ERRO INTERNO no cadastro de aluno:", error);
      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro interno no servidor ao tentar cadastrar o aluno."
      });
    }
  }

  async responderAtividades(req, res) {
    let DBA = new DB_Atividade();
    let lista = [];
    let atividade = await DBA.listar(req.query.id);
    console.log(atividade);

    res.render("respostas", { layout: 'layout', atividade });

  }

  async responderAtividadesPost(req, res) {
    let DBA = new DB_Resposta();
    let filtro = [];
    filtro.push(req.body.id_atividade);
    filtro.push(req.cookies.usuarioLogado);
    let update = await DBA.listar(filtro, 1);
    if (update.length > 0) {
      DBA = new DB_Resposta(
        update[0].res_id,
        req.body.id_atividade,
        req.cookies.usuarioLogado,
        req.body.resposta,
        new Date(),
        0,
        0
      );
      let sucesso = await DBA.atualizar();
    } else {
      DBA = new DB_Resposta(
        0,
        req.body.id_atividade,
        req.cookies.usuarioLogado,
        req.body.resposta,
        new Date(),
        0,
        0
      );
      let sucesso = await DBA.gravar();
    }

    res.redirect("/system/alunos");
  }

  

}

module.exports = AlunoController;
