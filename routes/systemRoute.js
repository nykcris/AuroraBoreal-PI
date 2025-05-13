const express = require("express");
const router = express.Router();
const authMiddlewareDirecao = require("../middlewares/authMiddlewareDirecao");
const LoginController = require("../controllers/loginController");
const SystemController = require("../controllers/systemController");
const AlunoController = require("../controllers/alunoController");
const ProfessorController = require('../controllers/professorController');
const TurmaController = require('../controllers/turmaController');
const SerieController = require('../controllers/serieController');
const DisciplinaController = require('../controllers/disciplinaController');

let PC = new ProfessorController();
let AMD = new authMiddlewareDirecao();
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

router.post("/cadastrarProfessor", AMD.validar, PC.cadastrarProfessor);
router.post("/cadastrarAluno", AMD.validar, AC.postCadastrarAluno);

router.get("/direcaoFetchTurma", AMD.validar, SC.direcaoFetchTurma);
router.get("/direcaoFetchDisciplina", AMD.validar, SC.direcaoFetchDisciplina);
router.post("/cadastrarProfessorTurmaDisciplina", AMD.validar, PC.cadastrarProfessorTurmaDisciplina);

router.post("/turma/cadastrarTurma", AMD.validar, TC.cadastrarTurma);
router.post("/turma/delete", AMD.validar, TC.deleteTurma);
router.get("/turma/editar", AMD.validar, TC.editarTurma);
router.post("/turma/atualizar", AMD.validar, TC.atualizarTurma);

router.post("/serie/cadastrarSerie", AMD.validar, SRC.cadastrarSerie);
router.post("/serie/delete", AMD.validar, SRC.deleteSerie);
router.get("/serie/editar", AMD.validar, SRC.editarSerie);
router.post("/serie/atualizar", AMD.validar, SRC.atualizarSerie);

router.post("/disciplina/cadastrarDisciplina", AMD.validar, DC.cadastrarDisciplina);
router.post("/disciplina/delete", AMD.validar, DC.deleteDisciplina);
router.get("/disciplina/editar", AMD.validar, DC.editarDisciplina);
router.post("/disciplina/atualizar", AMD.validar, DC.atualizarDisciplina);


/*
router.get("/professores", AM.validar, PC.getProfessores);
router.post("/professores", AM.validar, PC.postCadastrarProfessor);
*/
router.get("/teste", (req, res) => {
    console.log("Entrou na rota /system/teste");
    res.send("Funcionando");
});

module.exports = router;
