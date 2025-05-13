const express = require("express");
const router = express.Router();
const authMiddlewareDirecao = require("../middlewares/authMiddlewareDirecao");
const LoginController = require("../controllers/loginController");
const SystemController = require("../controllers/systemController");
const AlunoController = require("../controllers/alunoController");
const ProfessorController = require('../controllers/professorController');

let PC = new ProfessorController();
let AMD = new authMiddlewareDirecao();
let SC = new SystemController();
let LC = new LoginController();
let AC = new AlunoController();

router.get("/", LC.getlogin);
router.post("/postlogin", LC.postlogin);
router.get("/direcao", AMD.validar, SC.direcao);
router.get("/register", AMD.validar, SC.register);

router.post("/cadastrarProfessor", AMD.validar, PC.cadastrarProfessor);
router.post("/cadastrarAluno", AMD.validar, AC.postCadastrarAluno);

router.get("/direcaoFetchTurma", AMD.validar, SC.direcaoFetchTurma);
router.get("/direcaoFetchDisciplina", AMD.validar, SC.direcaoFetchDisciplina);
router.post("/cadastrarProfessorTurmaDisciplina", AMD.validar, PC.cadastrarProfessorTurmaDisciplina);




/*
router.get("/professores", AM.validar, PC.getProfessores);
router.post("/professores", AM.validar, PC.postCadastrarProfessor);
*/
router.get("/teste", (req, res) => {
    console.log("Entrou na rota /system/teste");
    res.send("Funcionando");
});

module.exports = router;
