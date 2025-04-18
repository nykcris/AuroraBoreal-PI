const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const alunoController = require("../controllers/alunoController");
const ProfessorController = require("../controllers/professorController");

let AM = new authMiddleware();
let PC = new ProfessorController();

// ----- Outros -----
router.get("/", AM.validar, PC.professores);
router.get("/atividades", AM.validar, PC.atividades);
// router.get("/pagamentos", AM.validar, PC.pagamentos);
// router.get("/notas", AM.validar, PC.notas);
// router.get("/informacoes", AM.validar, PC.informacoes);

// ----- Atividades -----
router.post("/atividades", AM.validar, PC.atividades);
router.post("/deletarAtividade", AM.validar, PC.deletarAtividades);
router.post("/editarAtividade", AM.validar, PC.editarAtividadesPost);
router.get("/editarAtividade", AM.validar, PC.editarAtividades);
router.post("/corrigirResposta",AM.validar, PC.CorrigirAtividadesPost);

module.exports = router;
