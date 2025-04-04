const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const alunoController = require("../controllers/alunoController");

let AM = new authMiddleware();
let AC = new alunoController();


router.get("/", AM.validar, AC.index);
router.get("/atividades", AM.validar, AC.atividades);
router.get("/pagamentos", AM.validar, AC.pagamentos);
router.get("/notas", AM.validar, AC.notas);
router.get("/informacoes", AM.validar, AC.informacoes);

module.exports = router;
