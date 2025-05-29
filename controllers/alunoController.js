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

    let db_aluno = new DB_Aluno();
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


    res.render("Aluno/alunos_index",{ layout: 'layouts/layout_aluno', rows, atividades_cadastradas:atividades, atividadesFeitas });
  }

  async perfilAluno(req, res) {
    try {
      let DBA = new DB_Aluno();
      let DBT = new DB_Turma();
      let DBN = new DB_Notas();
      let DBPTD = new DB_ProfessorTurmaDisciplina();
      let DBR = new DB_Resposta();

      let aluno = await DBA.obter(req.cookies.usuarioLogado);

      if (aluno && aluno.length > 0) {
        // Buscar nome da turma
        let turma = await DBT.obter(aluno[0].turma_id);
        let nomeTurma = turma && turma.length > 0 ? turma[0].nome : 'Turma não encontrada';

        // Buscar estatísticas
        let estatisticas = {
          disciplinas: 0,
          atividades_concluidas: 0,
          media_geral: 0
        };

        try {
          // Contar disciplinas da turma
          let disciplinasTurma = await DBPTD.listarDisciplinas(aluno[0].turma_id);
          estatisticas.disciplinas = disciplinasTurma.length;

          // Contar atividades concluídas pelo aluno
          let atividadesConcluidas = await DBR.contarAtividadesConcluidas(req.cookies.usuarioLogado);
          estatisticas.atividades_concluidas = atividadesConcluidas || 0;

          // Calcular média geral das notas
          let mediaGeral = await DBN.calcularMediaGeral(req.cookies.usuarioLogado);
          estatisticas.media_geral = mediaGeral || 0;

        } catch (statsError) {
          console.log("Erro ao carregar estatísticas:", statsError);
        }

        res.render("Aluno/aluno_perfil", {
          layout: 'layouts/layout_aluno',
          aluno: aluno[0],
          nomeTurma: nomeTurma,
          estatisticas: estatisticas
        });
      } else {
        res.render("Aluno/aluno_perfil", {
          layout: 'layouts/layout_aluno',
          aluno: null,
          nomeTurma: 'Não informado',
          estatisticas: { disciplinas: 0, atividades_concluidas: 0, media_geral: 0 }
        });
      }
    } catch (error) {
      console.error("Erro ao carregar perfil do aluno:", error);
      res.render("Aluno/aluno_perfil", {
        layout: 'layouts/layout_aluno',
        aluno: null,
        nomeTurma: 'Erro ao carregar',
        estatisticas: { disciplinas: 0, atividades_concluidas: 0, media_geral: 0 }
      });
    }
  }

  async atualizarPerfilAluno(req, res) {
    try {
      console.log("=== ATUALIZAR PERFIL ALUNO ===");
      console.log("Dados recebidos:", req.body);
      console.log("Cookie usuarioLogado:", req.cookies.usuarioLogado);

      const { nome, email, cpf, data_nascimento, responsavel_nome, responsavel_telefone, nova_senha, senha_atual } = req.body;

      // Verificar se a senha atual foi fornecida
      if (!senha_atual) {
        console.log("Erro: Senha atual não fornecida");
        return res.json({
          sucesso: false,
          mensagem: "Senha atual é obrigatória para confirmar as alterações"
        });
      }

      let DBA = new DB_Aluno();

      // Verificar se a senha atual está correta
      let alunoAtual = await DBA.obter(req.cookies.usuarioLogado);
      console.log("Aluno encontrado:", alunoAtual);

      if (!alunoAtual || alunoAtual.length === 0) {
        console.log("Erro: Aluno não encontrado");
        return res.json({
          sucesso: false,
          mensagem: "Aluno não encontrado"
        });
      }

      console.log("Senha do banco:", alunoAtual[0].senha);
      console.log("Senha fornecida:", senha_atual);

      if (alunoAtual[0].senha !== senha_atual) {
        console.log("Erro: Senha atual incorreta");
        return res.json({
          sucesso: false,
          mensagem: "Senha atual incorreta"
        });
      }

      // Preparar dados para atualização (apenas campos que foram enviados)
      let dadosAtualizacao = {
        id: req.cookies.usuarioLogado
      };

      // Adicionar apenas os campos que foram fornecidos
      if (nome && nome.trim() !== '') {
        dadosAtualizacao.nome = nome.trim();
      } else {
        dadosAtualizacao.nome = alunoAtual[0].nome;
      }

      if (email && email.trim() !== '') {
        dadosAtualizacao.email = email.trim();
      } else {
        dadosAtualizacao.email = alunoAtual[0].email;
      }

      if (responsavel_nome && responsavel_nome.trim() !== '') {
        dadosAtualizacao.responsavel_nome = responsavel_nome.trim();
      } else {
        dadosAtualizacao.responsavel_nome = alunoAtual[0].responsavel_nome;
      }

      if (responsavel_telefone && responsavel_telefone.trim() !== '') {
        dadosAtualizacao.responsavel_telefone = responsavel_telefone.trim();
      } else {
        dadosAtualizacao.responsavel_telefone = alunoAtual[0].responsavel_tel;
      }

      // Processar CPF
      if (cpf && cpf.trim() !== '') {
        dadosAtualizacao.cpf = cpf.trim();
      } else {
        dadosAtualizacao.cpf = alunoAtual[0].aluno_cpf;
      }

      // Processar data de nascimento
      if (data_nascimento && data_nascimento.trim() !== '') {
        dadosAtualizacao.data_nascimento = data_nascimento.trim();
      } else {
        dadosAtualizacao.data_nascimento = alunoAtual[0].aluno_nasc;
      }

      // Verificar se quer alterar a senha
      if (nova_senha && nova_senha.trim() !== '') {
        if (nova_senha.length < 6) {
          return res.json({
            sucesso: false,
            mensagem: "Nova senha deve ter pelo menos 6 caracteres"
          });
        }
        dadosAtualizacao.senha = nova_senha.trim();
      } else {
        dadosAtualizacao.senha = alunoAtual[0].senha;
      }

      // Manter dados que não podem ser alterados pelo aluno
      dadosAtualizacao.turma_id = alunoAtual[0].turma_id;
      dadosAtualizacao.responsavel_cpf = alunoAtual[0].responsavel_cpf;

      console.log("Dados para atualização:", dadosAtualizacao);

      // Usar atualização dinâmica apenas dos campos alterados
      let DBA_Update = new DB_Aluno();
      let sucesso = await DBA_Update.atualizarPerfil(
        dadosAtualizacao.id,
        dadosAtualizacao.nome,
        dadosAtualizacao.email,
        dadosAtualizacao.responsavel_nome,
        dadosAtualizacao.responsavel_telefone,
        dadosAtualizacao.senha,
        dadosAtualizacao.cpf,
        dadosAtualizacao.data_nascimento
      );
      console.log("Resultado da atualização:", sucesso);

      if (sucesso) {
        console.log("Sucesso na atualização");
        res.json({
          sucesso: true,
          mensagem: "Perfil atualizado com sucesso!"
        });
      } else {
        console.log("Falha na atualização");
        res.json({
          sucesso: false,
          mensagem: "Erro ao atualizar perfil"
        });
      }

    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      res.json({
        sucesso: false,
        mensagem: "Erro interno do servidor"
      });
    }
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

    res.render("Aluno/respostas", { layout: 'layouts/layout_aluno', atividade });

  }

  async responderAtividadesPost(req, res) {
    let DBA = new DB_Resposta();
    let filtro = [];
    filtro.push(req.body.id_atividade);
    filtro.push(req.cookies.usuarioLogado);
    let update = await DBA.obterResposta(req.body.id_atividade, req.cookies.usuarioLogado);
    if(update.length > 0){
        if(update[0].corrigida == 1){
            res.json({ sucesso: false, mensagem: "A atividade já foi corrigida!" });
            return;
        }
    }
    let file;
    let sucesso;
    if(req.file != null){
        let filepath = "uploads/"+req.file.mimetype.split("/").pop()+"/"+req.file.filename;
        file = filepath;
    }else{
        file = "null";
    }
    try {
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
      res.json({ sucesso: true, mensagem: "Resposta enviada com sucesso!" });
    } catch (error) {
        console.error("Erro ao responder atividade:", error);
        return res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao responder atividade."
        });
    }
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
        let disc = await DBD.obter(turma_disciplinas[i].disciplina_id);
        if(disc.length > 0){
            disciplinas.push(disc);
        }
    }
    let data = [];
    console.log("============================");
    console.log(turma_disciplinas);
    console.log("============================");
    for (let i = 0; i < disciplinas.length; i++) {
      console.log(i);
      console.log(turma_disciplinas[i].disciplina_id);
        let notas = await DBN.obterNotasAluno(req.cookies.usuarioLogado, turma_disciplinas[i].disciplina_id, turma_disciplinas[i].turma_id);
        data.push({
            "disciplina_nome":disciplinas[i][0].nome,
            "nota1":notas[0] ? notas[0].valor_nota : 0,
            "nota2":notas[1] ? notas[1].valor_nota : 0,
            "nota3":notas[2] ? notas[2].valor_nota : 0,
            "nota4":notas[3] ? notas[3].valor_nota : 0,
            "media":(notas[0] ? notas[0].valor_nota : 0 + notas[1] ? notas[1].valor_nota : 0 + notas[2] ? notas[2].valor_nota : 0 + notas[3] ? notas[3].valor_nota : 0)/4
        })
    }


    res.send(data);




  }

  async tabelaNotas(req, res){
    res.render("Aluno/alunos_tabelaNotas",{ layout: 'layouts/layout_aluno'});
  }

  async editarAluno(req, res){
    let DBA = new DB_Aluno();
    let DBT = new DB_Turma();
    let turmas = await DBT.listar();
    let aluno = await DBA.obter(req.query.id);
    console.log(aluno);
    console.log(turmas);
    res.render("Direcao/editar_aluno",{ layout: 'layouts/layout', aluno , turmas });

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
    if(sucesso){
      res.redirect("/system/direcao");
    }
  }

  async materias(req, res){
    let DBD = new DB_Disciplina();
    let disciplina = await DBD.obter(req.query.materia_id);
    let DBA = new DB_Atividade();
    let atividades = await DBA.listar(req.query.materia_id);
    let DBN = new DB_Notas();
    let notas = await DBN.obterNotasAluno(req.cookies.usuarioLogado, req.query.materia_id);
    let DBR = new DB_Resposta();
    let respostas = await DBR.listar(req.query.aluno_id, req.query.materia_id);
    try{
        res.send({
          materia_nome: disciplina[0].nome,
          conteudo: disciplina[0].conteudo,
          atividades,
          notas,
          respostas
        });
    }catch(error){
        console.log(error);
    }
  }

  async materiasView(req, res){
    res.render("Aluno/aluno_materia",{ layout: 'layouts/layout_aluno'});
  }



  //============ Fetchs =============

  async fetchDisciplinas(req, res){
    let DBA = new DB_Aluno();
    let aluno = await DBA.obter(req.query.id);
    let DBPTD = new DB_ProfessorTurmaDisciplina();
    let disciplinas;
    if(aluno.length > 0){
      disciplinas = await DBPTD.listarDisciplinas(aluno[0].turma_id);
    }else{
      return;
    }
    res.send(disciplinas);
  }

  async fetchNomeAluno(req, res) {
    let DBA = new DB_Aluno();
    let alunos = await DBA.obter(req.query.id);
    res.send(alunos);
  }

  async fetchRespostasAtividade(req, res) {
    let DBR = new DB_Resposta();
    let respostas = await DBR.fetchRespostasAtividade(req.query.aluno, req.query.materia);
    res.send(respostas);
  }

  async fetchNotas(req, res) {
    let DBN = new DB_Notas();
    let notas = await DBN.fetchNotas(req.query.aluno, req.query.materia, req.query.bimestre);
    res.send(notas);
  }

}

module.exports = AlunoController;
