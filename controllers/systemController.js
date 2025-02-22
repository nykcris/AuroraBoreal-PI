

class SystemController {
    index(req, res) {
        res.render("form_login");
    }

    alunos(req,res) {
        res.render("alunos_index");
    }

    direcao(req,res) {
        res.render("direcao_index");
    }

    professores(req,res) {
        res.render("professores_index");
    }
}



module.exports = SystemController;