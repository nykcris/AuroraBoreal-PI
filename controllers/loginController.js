const AlunoModel = require("../models/alunoModel");
const ProfessorModel = require("../models/professorModel"); 
const DirecaoModel = require("../models/DirecaoModel");


class LoginController{
    async getlogin(req, res) {

        res.render("Sistema/form_login",{ layout: false });
    }

    async postlogin(req, res) {
        const { email, senha , type} = req.body;
        let typeName = ''
        let validUser = '';

        let aluno = new AlunoModel();
        let professor = new ProfessorModel();
        let direcao = new DirecaoModel();

        switch (type) {
            case '1':
                validUser = await professor.validar(email, senha);
                typeName = 'Professor';
                break;
            case '2':
                validUser = await direcao.validar(email, senha);
                typeName = 'Direcao';
                break;
            case '3':
                validUser = await aluno.validar(email, senha);
                typeName = 'Aluno';
                break;
            default:
                validUser = null;
                typeName = 'Invalid';
                break;
        }

        if (validUser) {

            res.cookie("usuarioLogado", validUser.id, {
                httpOnly: true,
                sameSite: 'lax',
                path: '/'
            });
            res.cookie("usuarioLogadoNome", validUser.nome, {
                sameSite: 'lax',
                path: '/'
            });
            res.cookie("usuarioLogadoDesc", typeName, {
                sameSite: 'lax',
                path: '/'
            });
            res.cookie("usuarioLogadoType", type, {
                sameSite: 'lax',
                path: '/'
            });
            res.cookie("usuarioLogadoEmail", email, {
                sameSite: 'lax',
                path: '/'
            });
            res.cookie("usuarioLogadoSenha", senha, {
                sameSite: 'lax',
                path: '/'
            });

            let paginaDestino = '';
            switch (type) {
                case '1':
                    paginaDestino = 'professores';
                    break;
                case '2':
                    paginaDestino = 'direcao';
                    break;
                case '3':
                    paginaDestino = 'alunos';
                    break;
                default:
                    paginaDestino = '';
                    break;
            }
            console.log(`Login bem-sucedido para: ${validUser.nome} (${email}) - Perfil: ${validUser.perfilId}`);
            res.json({ success: true, role: validUser.perfilId, destino: paginaDestino });
            console.log("Resposta enviada:", { success: true, destino: paginaDestino });
        } else {
            console.log(`Falha no login para: ${email}`);
            res.json({success: false, message: "Email ou senha inválidos"});
        }
    }
}

module.exports = LoginController;