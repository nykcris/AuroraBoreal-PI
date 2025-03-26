const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

let UC = new userController();




router.get("/",UC.index);
router.get("/listar",UC.listar);
router.get("/cadastrar",UC.cadastrar);
router.post("/cadastrar",UC.gravar);
router.get("/editar/:id",UC.editar);
router.post("/editar/:id",UC.atualizar);
router.get("/excluir/:id",UC.excluir);



module.exports = router;
