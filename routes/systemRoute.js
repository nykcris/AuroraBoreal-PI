const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const LoginController = require("../controllers/loginController");
const SystemController = require("../controllers/systemController");
const AlunoController = require("../controllers/alunoController");
const ProfessorController = require('../controllers/professorController');
let PC = new ProfessorController();
let AM = new authMiddleware();
let SC = new SystemController();
let LC = new LoginController();
let AC = new AlunoController();

router.get("/", LC.getlogin);
router.post("/postlogin", LC.postlogin);

router.post("/atividades", AM.validar, SC.atividades);
router.post("/deletarAtividade", AM.validar, SC.deletarAtividades);
router.post("/editarAtividade", AM.validar, SC.editarAtividadesPost);
router.get("/editarAtividade", AM.validar, SC.editarAtividades);
router.post("/corrigirResposta",AM.validar,SC.CorrigirAtividadesPost);
router.get("/resposta", AM.validar, SC.responderAtividades);
router.post("/resposta", AM.validar, SC.responderAtividadesPost);

router.get("/alunos", AM.validar, SC.alunos);
router.get("/direcao", AM.validar, SC.direcao);
router.get("/professores", AM.validar, SC.professores);
router.get("/register", AM.validar, SC.register);


router.post("/cadastrarAluno", AM.validar, AC.postCadastrarAluno);


/*
router.get("/professores", AM.validar, PC.getProfessores);
router.post("/professores", AM.validar, PC.postCadastrarProfessor);
*/
router.get("/teste", (req, res) => {
    console.log("Entrou na rota /system/teste");
    res.send("Funcionando");
});

module.exports = router;
