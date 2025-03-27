const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const LoginController = require("../controllers/loginController");
const SystemController = require("../controllers/systemController");

let AM = new authMiddleware();
let SC = new SystemController();
let LC = new LoginController();




router.get("/",LC.getlogin);
router.post("/postlogin",LC.postlogin);
router.get("/alunos",AM.validar,SC.alunos);
router.get("/direcao",AM.validar,SC.direcao);
router.get("/professores",AM.validar,SC.professores);
router.get("/register",AM.validar,SC.register);





module.exports = router;
