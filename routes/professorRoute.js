const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const authMiddlewareProfessor = require("../middlewares/authMiddlewareProfessor");
const alunoController = require("../controllers/alunoController");
const ProfessorController = require("../controllers/professorController");

let AMP = new authMiddlewareProfessor();
let PC = new ProfessorController();

// ----- Outros -----
router.get("/", AMP.validar, PC.professores);
router.get("/atividades", AMP.validar, PC.atividades);
// router.get("/pagamentos", AMP.validar, PC.pagamentos);
// router.get("/notas", AMP.validar, PC.notas);
// router.get("/informacoes", AMP.validar, PC.informacoes);

// ----- Atividades -----
router.post("/atividades", AMP.validar, PC.atividades);
router.post("/deletarAtividade", AMP.validar, PC.deletarAtividades);
router.post("/editarAtividade", AMP.validar, PC.editarAtividadesPost);
router.get("/editarAtividade", AMP.validar, PC.editarAtividades);
router.post("/corrigirResposta",AMP.validar, PC.CorrigirAtividadesPost);

module.exports = router;
