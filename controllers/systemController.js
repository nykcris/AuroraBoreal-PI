const DB_Perfil = require("../models/perfilModel");
const DB_Aluno = require("../models/alunoModel");
const DB_Professor = require('../models/professorModel');
const DB_Disciplina = require("../models/disciplinaModel");
const DB_Turma = require("../models/turmaModel");
const DB_Serie = require("../models/serieModel");
const DB_Sala = require("../models/salaModel");
const DB_Produto = require("../models/produtoModel");
const DB_ProfessorTurmaDisciplina = require("../models/professorTurmaDisciplinaModel");
const DB_Horario = require("../models/horarioModel");
const DB_EntradaDespesa = require("../models/entradaDespesaModel");


class SystemController {
    async index(req, res) {
        let db_perfi = new DB_Perfil();
        let usersper = await db_perfi.listar();
        let rows = [];

        usersper.forEach(per => (
            rows.push({
                "per_id":per.id,
                "per_descricao":per.descricao
            })
        ))
        res.render("Sistema/form_login",{ layout: false ,users:rows});
    }

    async download(req, res) {
        res.download(req.query.path);
    }


    async direcao(req, res) {

        const db_serie = new DB_Serie();
        const db_turma = new DB_Turma();
        const db_aluno = new DB_Aluno();
        const db_disciplina = new DB_Disciplina();
        const db_prof = new DB_Professor();
        const db_sala = new DB_Sala();
        const db_financeiro = new DB_EntradaDespesa();


        const professores = await db_prof.listar();
        const listaAlunos = await db_aluno.listar();
        const salas = await db_sala.listar();
        const turmas_salas = await db_sala.listarAssociacao();
        const disciplinas = await db_disciplina.listar();

        // Buscar dados financeiros
        const resumoFinanceiro = await db_financeiro.calcularLucroTotal();
        const movimentacaoRecente = await db_financeiro.obterMovimentacaoRecente(5);
        const resumoPorTipo = await db_financeiro.obterResumoFinanceiro();

        res.render("Direcao/direcao_index", {
            layout: 'layouts/layout',
            alunos: listaAlunos,
            professores,
            salas,
            turmas_salas,
            disciplinas,
            resumoFinanceiro,
            movimentacaoRecente,
            resumoPorTipo
        });
    }

    async register(req,res) {
        let db_perfi = new DB_Perfil();
        let usersper = await db_perfi.listar();
        let rows = [];

        usersper.forEach(per => (
            rows.push({
                "per_id":per.id,
                "per_descricao":per.descricao
            })
        ))
        res.render("Sistema/form_register",{ layout: 'imports_layout',rows});
    }

    async cadastrarSala(req, res) {
        let DBS = new DB_Sala();
        let sala = new DB_Sala(0, req.body.sala_nome);
        let sucesso = await sala.cadastrar();
        if (sucesso) {
            console.log("Sucesso ao cadastrar sala");
            res.json({ sucesso: true, mensagem: "Sala cadastrada com sucesso!" });
        } else {
            console.log("Erro ao cadastrar sala");
            res.json({ sucesso: false, mensagem: "Erro ao cadastrar sala" });
        }
    }

    async deleteSala(req, res) {
        let DBS = new DB_Sala();
        let sucesso = await DBS.excluir(req.body.id);
        if (sucesso) {
            console.log("Sucesso ao deletar sala");
            res.send("Sucesso ao deletar sala");
        } else {
            console.log("Erro ao deletar sala");
            res.send("Erro ao deletar sala");
        }
    }

    async editarSala(req, res) {
        let DBS = new DB_Sala();
        let sala = await DBS.obter(req.query.id);
        res.render("Sala/editar_sala", { layout: 'layouts/layout', sala });
    }

    async atualizarSala(req, res) {
        let DBS = new DB_Sala();
        let sala = new DB_Sala(req.body.id, req.body.sala_nome);
        let sucesso = await sala.atualizar();
        if (sucesso) {
            console.log("Sucesso ao atualizar sala");
            res.redirect("/system/direcao");
        } else {
            console.log("Erro ao atualizar sala");
            res.send("Erro ao atualizar sala");
        }
    }

    async cadastrarTurmaSala(req, res) {

        let DBS = new DB_Sala();
        let nome = await DBS.obter(req.body.id);
        let sala = new DB_Sala(req.body.id, nome[0].nome, req.body.turma);
        let sucesso = await sala.atualizar();
        console.log(req.body);
        console.log(sucesso);

        if (sucesso) {
            console.log("Sucesso ao cadastrar turma sala");
            res.json({ sucesso: true, mensagem: "Associação realizada com sucesso!" });
        } else {
            console.log("Erro ao cadastrar turma sala");
            res.json({ sucesso: false, mensagem: "Erro ao cadastrar turma sala" });
        }
    }

    async cadastrarProduto(req, res) {
        let DBP = new DB_Produto();
        console.log(req.body);
        let produto = new DB_Produto(0, req.body.nome, req.body.descricao, req.body.quantidade, req.body.valor, req.body.tipo);
        let sucesso = await produto.cadastrar();
        if (sucesso) {
            console.log("Sucesso ao cadastrar produto");
            res.json({ sucesso: true, mensagem: "Produto cadastrado com sucesso!" });
        } else {
            console.log("Erro ao cadastrar produto");
            res.json({ sucesso: false, mensagem: "Erro ao cadastrar produto" });
        }
    }

    async deleteProduto(req, res) {
        let DBP = new DB_Produto();
        let sucesso = await DBP.excluir(req.body.id);
        if (sucesso) {
            console.log("Sucesso ao deletar produto");
            res.json({ sucesso: true, mensagem: "Produto deletado com sucesso!" });
        } else {
            console.log("Erro ao deletar produto");
            res.json({ sucesso: false, mensagem: "Erro ao deletar produto" });
        }
    }

    async editarProduto(req, res) {
        let DBP = new DB_Produto();
        let produto = await DBP.obter(req.query.id);
        res.render("direcao/editar_produto", { layout: 'layouts/layout', produto });
    }

    async atualizarProduto(req, res) {
        let DBP = new DB_Produto();
        let produto = new DB_Produto(req.body.id, req.body.produto_nome, req.body.produto_descricao, req.body.produto_quantidade, req.body.produto_valor, req.body.produto_tipo);
        let sucesso = await produto.atualizar();
        if (sucesso) {
            console.log("Sucesso ao atualizar produto");
            res.redirect("/system/direcao");
        } else {
            console.log("Erro ao atualizar produto");
            res.send("Erro ao atualizar produto");
        }
    }

    async deleteProfessorTurmaDisciplina(req, res) {
        let DBP = new DB_ProfessorTurmaDisciplina();
        let sucesso = await DBP.excluir(req.body.id);
        if (sucesso) {
            console.log("Sucesso ao deletar professor turma disciplina");
            res.json({ sucesso: true, mensagem: "Associação deletada com sucesso!" });
        } else {
            console.log("Erro ao deletar professor turma disciplina");
            res.json({ sucesso: false, mensagem: "Erro ao deletar associação" });
        }
    }





    //======== Area de Fetch para Nome e Outros =========

    async direcaoFetchTurma(req, res) {
        let DBT = new DB_Turma();
        let turmas = await DBT.listar();
        res.json(turmas);
    }

    async direcaoFetchDisciplina(req, res) {
        let DBD = new DB_Disciplina();
        let disciplinas = await DBD.listar();
        res.send(disciplinas);
    }

    async FetchDisciplinaOnTurmaID(req, res) {
        let DBD = new DB_Disciplina();
        let disciplinas = await DBD.listarOnTurmaID(req.query.turma_id);
        res.send(disciplinas);
    }

    async direcaoFetchSerie(req, res) {
        let DBS = new DB_Serie();
        let series = await DBS.listar();
        res.send(series);
    }

    async fetchNomeAluno(req, res) {
        let DBA = new DB_Aluno();
        let alunos = await DBA.obter(req.query.id);
        res.send(alunos);
    }
    
    async fetchNomeProfessor(req, res) {
        let DBP = new DB_Professor();
        let professores = await DBP.obter(req.query.id);
        res.send(professores);
    }
    
    async fetchNomeDisciplina(req, res) {
        let DBD = new DB_Disciplina();
        let disciplinas = await DBD.obter(req.query.id);
        res.send(disciplinas);
    }
    
    async fetchNomeTurma(req, res) {
        let DBT = new DB_Turma();
        let turmas = await DBT.obter(req.query.id);
        res.send(turmas);
    }

    async fetchNomeSala(req, res) {
        let DBS = new DB_Sala();
        let salas = await DBS.obter(req.query.id);
        res.send(salas);
    }

    async fetchTurmaSala(req, res) {
        let DBS = new DB_Sala();
        let turma_sala = await DBS.listarAssociacao();
        res.send(turma_sala);
    }

    async fetchProdutos(req, res) {
        let DBP = new DB_Produto();
        let produtos = await DBP.listar();
        res.send(produtos);
    }

    async fetchDisciplinas(req, res) {
        let DBD = new DB_Disciplina();
        let disciplinas = await DBD.listar();
        res.send(disciplinas);
    }

    async fetchSerie(req, res) {
        let DBS = new DB_Serie();
        let series = await DBS.listar();
        res.send(series);
    }

    async fetchAlunos(req, res) {
        let DBA = new DB_Aluno();
        let alunos;
        if(req.query.turma){
            alunos = await DBA.listarOnTurma(req.query.turma);
        }else{
            alunos = await DBA.listar();
        }
        res.send(alunos);
    }

    async fetchProfessores(req, res) {
        let DBP = new DB_Professor();
        let professores = await DBP.listar();
        res.send(professores);
    }

    async fetchSalas(req, res) {
        let DBS = new DB_Sala();
        let salas = await DBS.listar();
        res.send(salas);
    }

    async fetchTurmaSala(req, res) {
        let DBS = new DB_Sala();
        let turma_sala = await DBS.listarAssociacao();
        res.send(turma_sala);
    }

    async direcaoFetchHorario(req, res) {
        let DBH = new DB_Horario();
        let horario = await DBH.listar(req.query.turma);
        res.send(horario);
    }

    //======== Fim da Area de Fetch para Nome e Outros =========

    // ======== Métodos Financeiros =========
    async cadastrarEntradaDespesa(req, res) {
        try {
            console.log("=== CADASTRAR ENTRADA/DESPESA ===");
            console.log("Dados recebidos:", req.body);

            const { nome, tipo, valor } = req.body;

            // Validar dados obrigatórios
            if (!nome || !tipo || !valor) {
                return res.json({
                    sucesso: false,
                    mensagem: "Nome, tipo e valor são obrigatórios"
                });
            }

            // Validar tipo
            if (tipo !== 'entrada' && tipo !== 'despesa') {
                return res.json({
                    sucesso: false,
                    mensagem: "Tipo deve ser 'entrada' ou 'despesa'"
                });
            }

            // Calcular valor_lucro baseado no tipo
            let valor_lucro = parseFloat(valor);
            if (tipo === 'despesa') {
                valor_lucro = -valor_lucro; // Despesas são valores negativos
            }

            let DB_ED = new DB_EntradaDespesa();
            let entradaDespesa = new DB_EntradaDespesa(0, nome, tipo, parseFloat(valor), valor_lucro);
            let sucesso = await entradaDespesa.cadastrar();

            if (sucesso) {
                console.log("Sucesso ao cadastrar entrada/despesa");
                res.json({
                    sucesso: true,
                    mensagem: `${tipo === 'entrada' ? 'Entrada' : 'Despesa'} cadastrada com sucesso!`,
                    id: entradaDespesa.id
                });
            } else {
                console.log("Erro ao cadastrar entrada/despesa");
                res.json({
                    sucesso: false,
                    mensagem: "Erro ao cadastrar entrada/despesa"
                });
            }

        } catch (error) {
            console.error("Erro ao cadastrar entrada/despesa:", error);
            res.json({
                sucesso: false,
                mensagem: "Erro interno do servidor"
            });
        }
    }

    async listarEntradasDespesas(req, res) {
        try {
            let DB_ED = new DB_EntradaDespesa();
            let lista = await DB_ED.listar();
            res.json({
                sucesso: true,
                dados: lista
            });
        } catch (error) {
            console.error("Erro ao listar entradas/despesas:", error);
            res.json({
                sucesso: false,
                mensagem: "Erro ao carregar dados financeiros"
            });
        }
    }

    async obterResumoFinanceiro(req, res) {
        try {
            let DB_ED = new DB_EntradaDespesa();
            let resumo = await DB_ED.calcularLucroTotal();
            let movimentacao = await DB_ED.obterMovimentacaoRecente(10);

            res.json({
                sucesso: true,
                resumo: resumo,
                movimentacao: movimentacao
            });
        } catch (error) {
            console.error("Erro ao obter resumo financeiro:", error);
            res.json({
                sucesso: false,
                mensagem: "Erro ao carregar resumo financeiro"
            });
        }
    }

    async excluirEntradaDespesa(req, res) {
        try {
            const { id } = req.body;

            if (!id) {
                return res.json({
                    sucesso: false,
                    mensagem: "ID é obrigatório"
                });
            }

            let DB_ED = new DB_EntradaDespesa();
            let sucesso = await DB_ED.excluir(id);

            if (sucesso) {
                res.json({
                    sucesso: true,
                    mensagem: "Registro excluído com sucesso!"
                });
            } else {
                res.json({
                    sucesso: false,
                    mensagem: "Erro ao excluir registro"
                });
            }

        } catch (error) {
            console.error("Erro ao excluir entrada/despesa:", error);
            res.json({
                sucesso: false,
                mensagem: "Erro interno do servidor"
            });
        }
    }

    // ======== Fim dos Métodos Financeiros =========
}



module.exports = SystemController;