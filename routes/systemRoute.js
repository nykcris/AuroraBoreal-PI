const express = require("express");
const router = express.Router();
const SystemController = require("../controllers/systemController");

let SC = new SystemController();




router.get("/",SC.index);
router.get("/alunos",SC.alunos);
router.get("/direcao",SC.direcao);
router.get("/professores",SC.professores);






module.exports = router;