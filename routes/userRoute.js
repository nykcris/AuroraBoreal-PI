const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const userController = require("../controllers/userController");

let UC = new userController();
let AM = new authMiddleware();



router.get("/",AM.validar,UC.index);
router.get("/listar",AM.validar,UC.listar);
router.get("/cadastrar",AM.validar,UC.cadastrar);
router.post("/cadastrar",AM.validar,UC.gravar);
router.get("/editar/:id",AM.validar,UC.editar);
router.post("/editar/:id",AM.validar,UC.atualizar);
router.get("/excluir/:id",AM.validar,UC.excluir);



module.exports = router;
