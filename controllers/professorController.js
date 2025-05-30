const db = require("../utils/database");
const DB_Perfil = require("../models/perfilModel");
const DB_Usuarios = require("../models/usuarioModel");
const DB_Atividade = require("../models/atividadeModel");
const DB_Resposta = require("../models/respostaModel");
const DB_Aluno = require("../models/alunoModel");
const DB_Professor = require('../models/professorModel');
const DB_Disciplina = require("../models/disciplinaModel");
const DB_Turma = require("../models/turmaModel");
const DB_ProfessorTurmaDisciplina = require("../models/professorTurmaDisciplinaModel");
const DB_Notas = require("../models/notasModel");
const DB_Conteudo = require("../models/conteudoModel");
const DB_Produto = require("../models/produtoModel");

var DB = new db();

class ProfessorController {
    async professores(req,res) {
        let db_func = new DB_Usuarios();
        let funcs = await db_func.listar([2]);
        let rows = [];

        for (let i = 0; i < funcs.length; i++) {
            rows.push({
                "usu_id":funcs[i].id,
                "usu_nome":funcs[i].nome,
                "usu_email":funcs[i].email,
                "usu_senha":funcs[i].senha,

                "per_id":funcs[i].perfilId
            })
        }


        let db_atividade = new DB_Atividade();
        let atividades = await db_atividade.listar();
        let atividades_lista = [];
        for (let i = 0; i < atividades.length; i++) {
            atividades_lista.push({
                "ati_id":atividades[i].ati_id,
                "titulo":atividades[i].titulo,
                "descricao":atividades[i].descricao,
                "data_criacao":atividades[i].data_criacao,
                "data_entrega":atividades[i].data_entrega,
                "id_professor":atividades[i].id_professor,
                "anexo_atividade":atividades[i].anexo_atividade,
            })
        }

        let atividades_row = [];
        let db_resposta = new DB_Resposta();

        for (let i = 0; i < atividades.length; i++) {
            atividades_row.push({
                "titulo":atividades[i].titulo,
                "data_entrega":atividades[i].data_entrega,
                "respostas": await db_resposta.listar(atividades[i].ati_id,2),
            })
            console.log(atividades[i].data_entrega);
        }

        res.render("Professor/professores_index",{ layout: 'layouts/layout_professor',rows, 'atividades_cadastradas':atividades_lista, atividades_row});
    }

    async deletarAtividades(req, res) {
        let DBA = new DB_Atividade();
        let sucesso = await DBA.excluir(req.query.id);

        if (sucesso) {
            console.log("Sucesso ao deletar a atividade");
            res.json({ sucesso: true, mensagem: "Atividade deletada com sucesso!" });
        } else {
            console.log("Erro ao deletar atividade");
            res.json({ sucesso: false, mensagem: "Erro ao deletar atividade" });
        }
    }

    async editarAtividades(req, res) {
        let DBA = new DB_Atividade();
        let lista = [];
        let atividade = await DBA.listar(req.query.id);
        console.log(atividade);

        res.render("Professor/editar_atividades", { layout: 'layout', atividade });
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
        let update = await DBA.obter(req.body.res_id);
        if (update.length > 0) {
            DBA = new DB_Resposta(
                update[0].res_id,
                update[0].id_atividade,
                update[0].id_aluno,
                update[0].resposta,
                update[0].anexo_resposta,
                update[0].data_envio,
                req.body.nota,
                req.body.comentario_professor,
                update[0].nome_aluno,
                1
            );
            let sucesso = await DBA.atualizar();
            console.log(sucesso);
        }
        res.json({ sucesso: true, mensagem: "Resposta enviada com sucesso!" });
    }

    async atividades(req, res) {


        let atividade = new DB_Atividade(
          0,
          req.body.titulo,
          req.body.descricao,
          new Date(), // data_criacao
          req.body.data_entrega,
          req.cookies.usuarioLogado,
          req.body.anexo_atividade, // ou `req.file.filename` se estiver usando upload
          req.body.id_materia,
          req.body.tipo,
          req.body.peso,
          req.body.bimestre
        );
        let sucesso = await atividade.gravar(); // chama o método da própria instância

        console.log(sucesso);
        let id_atividade = await atividade.ati_id;
        if (sucesso) {
          console.log("Sucesso ao gravar a atividade");
          res.json({ sucesso: true, mensagem: "Atividade cadastrada com sucesso!", id_atividade: id_atividade });
        } else {
          console.log("Erro ao gravar atividade");
          res.json({ sucesso: false, mensagem: "Erro ao gravar atividade" });
        }
    }

    async cadastrarProfessorTurmaDisciplina(req, res) {
        try {
            console.log("Entrou na rota /system/cadastrarProfessorTurmaDisciplina");
            console.log(req.body);

            let DBT = new DB_Turma();
            let DBP = new DB_Professor();
            let DBD = new DB_Disciplina();
            let turma = await DBT.obter(req.body.turma);
            let disciplina = await DBD.obter(req.body.disciplina);
            let professor = await DBP.obter(req.body.professor);

            if (!turma.length || !disciplina.length || !professor.length) {
                return res.json({
                    sucesso: false,
                    mensagem: "Professor, turma ou disciplina não encontrados"
                });
            }

            let DBPD = new DB_ProfessorTurmaDisciplina(0, professor[0].id, turma[0].id, disciplina[0].id);
            let resultado = await DBPD.cadastrar();

            if (resultado.success) {
                res.json({ sucesso: true, mensagem: "Associação realizada com sucesso" });
            } else {
                res.json({
                    sucesso: false,
                    mensagem: resultado.message || "Erro ao realizar associação"
                });
            }
        } catch (error) {
            console.error("Erro no controller:", error);
            res.status(500).json({
                sucesso: false,
                mensagem: "Erro interno do servidor",
                erro: error.message
            });
        }
    }

    async cadastrarProfessor(req,res){
        let DBP = new DB_Professor();
        let professor = new DB_Professor(0,req.body.prof_nome,req.body.email,req.body.prof_cpf,req.body.senha,req.body.prof_salario,req.body.telefone);
        let sucesso = await professor.cadastrar();
        if (sucesso) {
            console.log("Sucesso ao cadastrar professor");
            res.send("Sucesso ao cadastrar professor");
        } else {
            console.log("Erro ao cadastrar professor");
            res.send("Erro ao cadastrar professor");
        }

    }

    async materias(req, res){
        let DBD = new DB_Disciplina();
        let disciplina = await DBD.obter(req.query.materia_id);
        let DBA = new DB_Atividade();
        let atividades = await DBA.listar(req.query.materia_id);
        let DBR = new DB_Resposta();
        let respostas = await DBR.listar(req.query.aluno_id, req.query.materia_id);
        try{
            res.send({
              materia_nome: disciplina[0].nome,
              conteudo: disciplina[0].conteudo,
              atividades,
              respostas
            });
        }catch(error){
            console.log(error);
        }
    }

    async materiasView(req, res){
        res.render("Professor/professor_materias",{ layout: 'layouts/layout_professor'});
    }

    async deleteProfessor(req, res){
        let DBP = new DB_Professor();
        let sucesso = await DBP.excluir(req.body.id);
        if (sucesso) {
            console.log("Sucesso ao deletar professor");
            res.json({ sucesso: true, mensagem: "Professor deletado com sucesso!" });
        } else {
            console.log("Erro ao deletar professor");
            res.json({ sucesso: false, mensagem: "Erro ao deletar professor" });
        }
    }

    async editarProfessor(req, res) {
        let DBP = new DB_Professor();
        let professor = await DBP.obter(req.query.id);
        res.render("Professor/editar_professor", { layout: 'layouts/layout', professor });
    }

    async atualizarProfessor(req, res) {
        let DBP = new DB_Professor();
        let professor = new DB_Professor(req.body.id, req.body.prof_nome, req.body.email, req.body.prof_cpf, req.body.senha, req.body.prof_salario, req.body.telefone);
        let sucesso = await professor.atualizar();
        if (sucesso) {
            console.log("Sucesso ao atualizar professor");
            res.redirect("/system/direcao");
        } else {
            console.log("Erro ao atualizar professor");
            res.send("Erro ao atualizar professor");
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
        let DBPD = new DB_ProfessorTurmaDisciplina();
        let disciplinas;
        if(req.query.turma){
            disciplinas = await DBPD.listarDisciplinasTurmaProfessor(req.query.turma, req.query.professor);
            console.log(disciplinas);
        }else{
            disciplinas = await DBPD.listarDisciplinasProfessor(req.query.professor);
            console.log(disciplinas);
        }
        res.send(disciplinas);
    }

    async fetchTurmasProfessor(req, res) {
        let DBPD = new DB_ProfessorTurmaDisciplina();
        let turmas;
        if(req.query.disciplina){
            turmas = await DBPD.listarTurmasDisciplina(req.query.disciplina);
        }else{
            turmas = await DBPD.listarTurmasProfessor(req.query.professor);
        }
        res.send(turmas);
    }

    async fetchDisciplinaTurmaId(req, res) {
        let DBPD = new DB_ProfessorTurmaDisciplina();
        let disciplina = await DBPD.fetchDisciplinaTurmaId(req.query.turma, req.query.disciplina);
        res.send(disciplina);
    }

    async fetchAtividades(req, res) {
        let DBA = new DB_Atividade();
        let atividades;
        if(req.query.materia){
            atividades = await DBA.fetchAtividades(req.query.materia);
        }else if(req.query.id){
            atividades = await DBA.listar(req.query.id);
        }else{
            atividades = await DBA.listar();
        }
        res.send(atividades);
    }

    async fetchConteudos(req, res) {
        let DBC = new DB_Conteudo();
        let conteudos = await DBC.fetchConteudos(req.query.materia);
        res.send(conteudos);
    }

    async fetchRespostas(req, res) {
        let DBR = new DB_Resposta();
        let respostas;
        if(req.query.id){
            respostas = await DBR.obter(req.query.id);
        }else if(req.query.aluno && req.query.materia){
            respostas = await DBR.fetchRespostas(req.query.aluno, req.query.materia);
        }else{
            respostas = await DBR.listar();
        }
        res.send(respostas);
    }

    async cadastrarNota(req, res) {
        let DBN = new DB_Notas();
        let nota = new DB_Notas(0, req.body.aluno_id, req.body.turma_disciplina_id, req.body.valor_nota, req.body.bimestre);
        let sucesso = await nota.gravar();
        if (sucesso) {
            console.log("Sucesso ao cadastrar nota");
            res.json({ sucesso: true, mensagem: "Nota cadastrada com sucesso!" });
        } else {
            console.log("Erro ao cadastrar nota");
            res.json({ sucesso: false, mensagem: "Erro ao cadastrar nota" });
        }
    }

    async atualizarNota(req, res) {
        let DBN = new DB_Notas();
        let nota = new DB_Notas(0, req.body.aluno_id, req.body.turma_disciplina_id, req.body.valor_nota, req.body.bimestre);
        let sucesso = await nota.atualizar();
        if (sucesso) {
            console.log("Sucesso ao atualizar nota");
            res.json({ sucesso: true, mensagem: "Nota atualizada com sucesso!" });
        } else {
            console.log("Erro ao atualizar nota");
            res.json({ sucesso: false, mensagem: "Erro ao atualizar nota" });
        }
    }

    async fetchMateriaNome(req, res) {
        let DBPTD = new DB_ProfessorTurmaDisciplina();
        let disciplina = await DBPTD.obter(req.query.id);
        res.send(disciplina);
    }



    // ========== Métodos para Materiais ==========

    async fetchMateriaisDisponiveis(req, res) {
        try {
            console.log("Buscando materiais disponíveis...");
            let DBP = new DB_Produto();
            let materiais = await DBP.listarDisponiveis();
            console.log("Materiais disponíveis:", materiais);
            res.json(materiais);
        } catch (error) {
            console.error("Erro ao buscar materiais:", error);
            res.status(500).json({ erro: "Erro interno do servidor", detalhes: error.message });
        }
    }

    async registrarUsoMaterial(req, res) {
        try {
            console.log("Registrando uso de material:", req.body);
            let DBP = new DB_Produto();

            // Verificar se há estoque suficiente
            let produto = await DBP.obter(req.body.produto_id);
            if (!produto || produto.length === 0) {
                return res.json({ sucesso: false, mensagem: "Produto não encontrado" });
            }

            if (produto[0].quantidade < req.body.quantidade_usada) {
                return res.json({ sucesso: false, mensagem: "Estoque insuficiente" });
            }

            // Reduzir estoque diretamente
            let sucesso = await DBP.reduzirEstoque(req.body.produto_id, req.body.quantidade_usada);

            if (sucesso) {
                console.log("Sucesso ao registrar uso de material");
                res.json({ sucesso: true, mensagem: "Uso de material registrado com sucesso!" });
            } else {
                console.log("Erro ao registrar uso de material");
                res.json({ sucesso: false, mensagem: "Erro ao registrar uso de material" });
            }
        } catch (error) {
            console.error("Erro ao registrar uso:", error);
            res.status(500).json({ sucesso: false, mensagem: "Erro interno do servidor" });
        }
    }



    //========== Fim Fetchs ==========
}

module.exports = ProfessorController;
