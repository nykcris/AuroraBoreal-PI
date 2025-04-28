const express = require("express");
let multer = require('multer');
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const authMiddlewareAluno = require("../middlewares/authMiddlewareAluno");
const alunoController = require("../controllers/alunoController");

let AM = new authMiddleware();
let AMA = new authMiddlewareAluno();
let AC = new alunoController();


let storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename(req, file, cb) {
        let nomeArquivo = file.originalname+ "_" + Date.now()+ "." + file.mimetype.split("/").pop();
        cb(null, nomeArquivo);
    }
});

let upload = multer({storage});


router.get("/", AMA.validar, AC.alunos);
// router.get("/pagamentos", AM.validar, AC.pagamentos);
// router.get("/notas", AM.validar, AC.notas);
// router.get("/informacoes", AM.validar, AC.informacoes);

// ----- Atividades -----
// router.get("/atividades", AM.validar, AC.atividades);
router.get("/resposta", AMA.validar, AC.responderAtividades);
router.post("/resposta", AMA.validar, AC.responderAtividadesPost);

module.exports = router;
