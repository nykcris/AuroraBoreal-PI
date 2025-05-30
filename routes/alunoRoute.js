const express = require("express");
const multer = require('multer');
const fs = require('fs');
const router = express.Router();
const authMiddlewareDirecao = require("../middlewares/authMiddlewareDirecao");
const authMiddlewareAluno = require("../middlewares/authMiddlewareAluno");
const alunoController = require("../controllers/alunoController");
const systemController = require("../controllers/systemController");

let AMD = new authMiddlewareDirecao();
let AMA = new authMiddlewareAluno();
let SC = new systemController();
let AC = new alunoController();


let storage = multer.diskStorage({
    destination(req, file, cb) {
        if(!fs.existsSync('uploads')){
            fs.mkdirSync('uploads');
        }
        if(!fs.existsSync('uploads/'+file.filename.split(".").pop())){
            fs.mkdirSync('uploads/'+file.filename.split(".").pop());
        }
        cb(null, 'uploads/'+file.filename.split(".").pop());
    },
    filename(req, file, cb) {
        let nomeArquivo = file.originalname.split(".")[0]+ "_" + Date.now()+ "." + file.filename.split(".").pop();
        cb(null, nomeArquivo);
    }
});

let upload = multer({storage});


router.get("/", AMA.validar, AC.alunos);

// ----- Gerenciar Aluno -----
router.get("/perfil",AMA.validar, AC.perfilAluno);
router.post("/perfil/atualizar", AMA.validar, AC.atualizarPerfilAluno);
router.get("/editar", AMD.validar, AC.editarAluno);
router.post("/atualizar", AMD.validar, AC.atualizarAluno);
router.post("/delete", AMD.validar, AC.deleteAluno);

// ----- Outros -----
// router.get("/pagamentos", AM.validar, AC.pagamentos);
// router.get("/notas", AM.validar, AC.notas);
// router.get("/informacoes", AM.validar, AC.informacoes);

// ----- Atividades -----
// router.get("/atividades", AM.validar, AC.atividades);
router.get("/resposta", AMA.validar, AC.responderAtividades);
router.post("/resposta", AMA.validar, upload.single('anexo_resposta'), AC.responderAtividadesPost);
router.get("/tabelaNotas",AMA.validar, AC.tabelaNotas);
router.post("/tabelaNotasFetch",AMA.validar, AC.tabelaNotasFetch);
router.get("/materias",AMA.validar, AC.materiasView);
router.post("/materias",AMA.validar, AC.materias);


// ----- Fetchs -----
router.get("/fetchDisciplinas",AMA.validar, AC.fetchDisciplinas);
router.get("/fetchAluno",AMA.validar, AC.fetchNomeAluno);

module.exports = router;
