const DB_Disciplina = require("../models/disciplinaModel");
const DB_Usuarios = require("../models/usuarioModel");
const DB_Atividade = require("../models/atividadeModel");
const DB_Resposta = require("../models/respostaModel");
const DB_Aluno = require("../models/alunoModel");
const DB_Notas = require("../models/notasModel");
const DB_Turma = require("../models/turmaModel");
const DB_ProfessorTurmaDisciplina = require("../models/professorTurmaDisciplinaModel");

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
    
    
    res.render("Aluno/alunos_index",{ layout: 'layouts/layout', rows, atividades_cadastradas:atividades, atividadesFeitas });
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

    res.render("Aluno/respostas", { layout: 'layouts/layout', atividade });

  }

  async responderAtividadesPost(req, res) {
    let DBA = new DB_Resposta();
    let filtro = [];
    filtro.push(req.body.id_atividade);
    filtro.push(req.cookies.usuarioLogado);
    let update = await DBA.listar(filtro, 1);
    let filepath = "uploads/"+req.file.mimetype.split("/").pop()+"/"+req.file.filename;
    let file;
    if(req.file != null){
        file = filepath;
    }else{
        file = "null";
    }
    if (update.length > 0) {
      DBA = new DB_Resposta(
        update[0].res_id,
        req.body.id_atividade,
        req.cookies.usuarioLogado,
        req.body.resposta,
        file,
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
        file,
        new Date(),
        0,
        0
      );
      let sucesso = await DBA.gravar();
    }

    res.redirect("/system/alunos");
  }

  async tabelaNotasFetch(req, res){
    let DBN = new DB_Notas();
    let DBD = new DB_Disciplina();
    let DBA = new DB_Aluno();
    let DBT = new DB_Turma();
    let DBPTD = new DB_ProfessorTurmaDisciplina();
    let aluno = await DBA.obter(req.cookies.usuarioLogado);
    if(aluno.length == 0){
        res.send("Aluno não encontrado!");
        return;
    }
    let turma = await DBT.obter(aluno[0].turma_id);
    let turma_disciplinas = await DBPTD.listarDisciplinas(turma[0].id);
    let disciplinas = [];
    for (let i = 0; i < turma_disciplinas.length; i++) {
        disciplinas.push(await DBD.obter(turma_disciplinas[i].id_disciplina));
    }
    let data = [];
    for (let i = 0; i < disciplinas.length; i++) {
        let notas = await DBN.obter(req.cookies.usuarioLogado, turma_disciplinas[i].id);
        data.push({
            "disciplina_nome":disciplinas[i][0].nome,
            "nota1":notas[0] ? notas[0].nota : 0,
            "nota2":notas[1] ? notas[1].nota : 0,
            "nota3":notas[2] ? notas[2].nota : 0,
            "nota4":notas[3] ? notas[3].nota : 0,
            "media":(notas[0] ? notas[0].nota : 0 + notas[1] ? notas[1].nota : 0 + notas[2] ? notas[2].nota : 0 + notas[3] ? notas[3].nota : 0)/4
        })
    }


    res.send(data);




  }

  async quadroNotas(req, res){
    res.render("Aluno/quadroNotas",{ layout: 'layouts/layout'});
  }

  async editarAluno(req, res){
    let DBA = new DB_Aluno();
    let aluno = await DBA.obter(req.query.id);
    res.render("Aluno/editar_aluno",{ layout: 'layouts/layout', aluno });

  }

  async deleteAluno(req, res){
    let DBA = new DB_Aluno();
    let aluno = await DBA.excluir(req.body.id);
    if(aluno){
      res.send("Aluno excluido!");
    }

  }

  async atualizarAluno(req, res){
    let DBA = new DB_Aluno();
    let aluno = new DB_Aluno(req.body.id,req.body.aluno_nome,req.body.aluno_cpf,req.body.turma_id,req.body.email,req.body.senha,req.body.aluno_nasc,req.body.responsavel_nome,req.body.responsavel_cpf,req.body.responsavel_tel);
    let sucesso = await aluno.atualizar();
  }




  

}

module.exports = AlunoController;
