const express = require("express");
const router = express.Router();
const authMiddlewareDirecao = require("../middlewares/authMiddlewareDirecao");
const authMiddlewareAluno = require("../middlewares/authMiddlewareAluno");
const LoginController = require("../controllers/loginController");
const SystemController = require("../controllers/systemController");
const AlunoController = require("../controllers/alunoController");
const ProfessorController = require('../controllers/professorController');
const TurmaController = require('../controllers/turmaController');
const SerieController = require('../controllers/serieController');
const DisciplinaController = require('../controllers/disciplinaController');

let PC = new ProfessorController();
let AMD = new authMiddlewareDirecao();
let AMA = new authMiddlewareAluno();
let SC = new SystemController();
let SRC = new SerieController();
let TC = new TurmaController();
let LC = new LoginController();
let AC = new AlunoController();
let DC = new DisciplinaController();

router.get("/", LC.getlogin);
router.post("/postlogin", LC.postlogin);
router.get("/direcao", AMD.validar, SC.direcao);
router.get("/register", AMD.validar, SC.register);
router.get("/download", AMD.validar, SC.download);

router.post("/professores/cadastrarProfessor", AMD.validar, PC.cadastrarProfessor);
router.post("/professores/delete", AMD.validar, PC.deleteProfessor);
router.get("/professores/editar", AMD.validar, PC.editarProfessor);
router.post("/professores/atualizar", AMD.validar, PC.atualizarProfessor);
router.post("/professores/cadastrarNota", AMD.validar, PC.cadastrarNota);
router.post("/professores/atualizarNota", AMD.validar, PC.atualizarNota);

router.post("/alunos/cadastrarAluno", AMD.validar, AC.postCadastrarAluno);
router.post("/alunos/delete", AMD.validar, AC.deleteAluno);
router.get("/alunos/editar", AMD.validar, AC.editarAluno);
router.post("/alunos/atualizar", AMD.validar, AC.atualizarAluno);

router.get("/direcaoFetchTurma", AMD.validar, SC.direcaoFetchTurma);
router.get("/direcaoFetchDisciplina", AMD.validar, SC.direcaoFetchDisciplina);
router.get("/direcaoFetchSerie", AMD.validar, SC.direcaoFetchSerie);
router.get("/direcaoFetchHorario", AMD.validar, SC.direcaoFetchHorario);
router.get("/direcao/FetchDisciplinaOnTurmaID", AMD.validar, SC.FetchDisciplinaOnTurmaID);

router.post("/cadastrarProfessorTurmaDisciplina", AMD.validar, PC.cadastrarProfessorTurmaDisciplina);
router.post("/professores/deleteProfessorTurmaDisciplina", AMD.validar, SC.deleteProfessorTurmaDisciplina);
router.get("/professores/fetchDisciplinasProfessor", AMD.validar, PC.fetchDisciplinasProfessor);
router.post("/cadastrarTurmaSala", AMD.validar, SC.cadastrarTurmaSala);

router.post("/turma/cadastrarTurma", AMD.validar, TC.cadastrarTurma);
router.post("/turma/delete", AMD.validar, TC.deleteTurma);
router.get("/turma/editar", AMD.validar, TC.editarTurma);
router.post("/turma/atualizar", AMD.validar, TC.atualizarTurma);

router.post("/sala/cadastrarSala", AMD.validar, SC.cadastrarSala);
router.post("/sala/delete", AMD.validar, SC.deleteSala);
router.get("/sala/editar", AMD.validar, SC.editarSala);
router.post("/sala/atualizar", AMD.validar, SC.atualizarSala);


router.post("/serie/cadastrarSerie", AMD.validar, SRC.cadastrarSerie);
router.post("/serie/delete", AMD.validar, SRC.deleteSerie);
router.get("/serie/editar", AMD.validar, SRC.editarSerie);
router.post("/serie/atualizar", AMD.validar, SRC.atualizarSerie);

router.post("/disciplina/cadastrarDisciplina", AMD.validar, DC.cadastrarDisciplina);
router.post("/disciplina/delete", AMD.validar, DC.deleteDisciplina);
router.get("/disciplina/editar", AMD.validar, DC.editarDisciplina);
router.post("/disciplina/atualizar", AMD.validar, DC.atualizarDisciplina);

router.post("/produto/cadastrarProduto", AMD.validar, SC.cadastrarProduto);
router.post("/produto/delete", AMD.validar, SC.deleteProduto);
router.get("/produto/editar", AMD.validar, SC.editarProduto);
router.post("/produto/atualizar", AMD.validar, SC.atualizarProduto);
router.get("/produto/fetchProdutos", AMD.validar, SC.fetchProdutos);


// ----- Fetchs -----

router.get("/fetchNomeAluno", AMD.validar, SC.fetchNomeAluno);
router.get("/fetchNomeProfessor", AMD.validar, SC.fetchNomeProfessor);
router.get("/fetchNomeDisciplina", AMD.validar, SC.fetchNomeDisciplina);
router.get("/fetchNomeTurma", AMD.validar, SC.fetchNomeTurma);
router.get("/fetchNomeSala", AMD.validar, SC.fetchNomeSala);
router.get("/fetchTurmaSala", AMD.validar, SC.fetchTurmaSala);
router.get("/fetchDisciplinas", AMD.validar, SC.fetchDisciplinas);
router.get("/fetchSerie", AMD.validar, SC.fetchSerie);
router.get("/fetchAlunos", AMD.validar, SC.fetchAlunos);
router.get("/fetchProfessores", AMD.validar, SC.fetchProfessores);
router.get("/fetchSalas", AMD.validar, SC.fetchSalas);
router.get("/fetchRespostas", AMD.validar, PC.fetchRespostas);
router.get("/fetchAtividades", AMD.validar, PC.fetchAtividades);
router.get("/fetchRespostasAtividade", AMA.validar, AC.fetchRespostasAtividade);
router.get("/fetchNotas", AMD.validar, AC.fetchNotas);



/*
router.get("/professores", AM.validar, PC.getProfessores);
router.post("/professores", AM.validar, PC.postCadastrarProfessor);
*/
router.get("/teste", (req, res) => {
    console.log("Entrou na rota /system/teste");
    res.send("Funcionando");
});

module.exports = router;
