const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const authMiddlewareProfessor = require("../middlewares/authMiddlewareProfessor");
const alunoController = require("../controllers/alunoController");
const ProfessorController = require("../controllers/professorController");

let AMP = new authMiddlewareProfessor();
let PC = new ProfessorController();

const multer = require("multer");
const fs = require("fs");
let storage = multer.diskStorage({
    destination(req, file, cb) {
        if(!fs.existsSync('uploads')){
            fs.mkdirSync('uploads');
        }
        if(!fs.existsSync('uploads/'+file.mimetype.split("/").pop())){
            fs.mkdirSync('uploads/'+file.mimetype.split("/").pop());
        }
        cb(null, 'uploads/'+file.mimetype.split("/").pop());
    },
    filename(req, file, cb) {
        let nomeArquivo = file.originalname.split(".")[0]+ "_" + Date.now()+ "." + file.mimetype.split("/").pop();
        cb(null, nomeArquivo);
    }
});
const upload = multer({storage});

// ----- Outros -----
router.get("/", AMP.validar, PC.professores);
router.get("/atividades", AMP.validar, PC.atividades);
// router.get("/pagamentos", AMP.validar, PC.pagamentos);
// router.get("/notas", AMP.validar, PC.notas);
// router.get("/informacoes", AMP.validar, PC.informacoes);

// ----- Atividades -----
router.post("/atividades", AMP.validar, upload.single('anexo_atividade'), PC.atividades); // upload.single('anexo_atividade') para upload de arquivos
router.post("/deletarAtividade", AMP.validar, PC.deletarAtividades);
router.post("/editarAtividade", AMP.validar, PC.editarAtividadesPost);
router.get("/editarAtividade", AMP.validar, PC.editarAtividades);
router.post("/corrigirResposta",AMP.validar, PC.CorrigirAtividadesPost);

router.get("/materias",AMP.validar, PC.materiasView);
router.post("/materias",AMP.validar, PC.materias);

// ----- Fetchs -----
router.get("/fetchDisciplinasProfessor",AMP.validar, PC.fetchDisciplinasProfessor);
router.get("/fetchTurmasProfessor",AMP.validar, PC.fetchTurmasProfessor);
router.get("/fetchDisciplinaTurmaId",AMP.validar, PC.fetchDisciplinaTurmaId);
router.get("/fetchAtividades",AMP.validar, PC.fetchAtividades);
router.get("/fetchConteudos",AMP.validar, PC.fetchConteudos);


module.exports = router;
