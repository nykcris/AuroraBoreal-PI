const express = require("express");
const router = express.Router();
const authMiddlewareDirecao = require("../middlewares/authMiddlewareDirecao");
const userController = require("../controllers/userController");

let UC = new userController();
let AMD = new authMiddlewareDirecao();



router.get("/",AMD.validar,UC.index);
router.get("/listar",AMD.validar,UC.listar);
router.get("/cadastrar",AMD.validar,UC.cadastrar);
router.post("/cadastrar",AMD.validar,UC.gravar);
router.get("/editar/:id",AMD.validar,UC.editar);
router.post("/editar/:id",AMD.validar,UC.atualizar);
router.get("/excluir/:id",AMD.validar,UC.excluir);



module.exports = router;
