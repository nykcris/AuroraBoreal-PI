const PerfilModel = require("../models/perfilModel");
const UsuarioModel = require("../models/usuarioModel");

class LoginController{
    async getlogin(req, res) {
        let db_perfi = new PerfilModel();
        let usersper = await db_perfi.listar();
        let rows = [];

        usersper.forEach(per => (
            rows.push({
                "per_id":per.id,
                "per_descricao":per.descricao
            })
        ))

        res.render("form_login",{ layout: false ,users:rows});
    }
    
    async postlogin(req, res) {
        const { email, senha } = req.body;
        console.log("Tentativa de login:", email);

        const usuarioModel = new UsuarioModel();
        const perfilModel = new PerfilModel();
        const validUser = await usuarioModel.validar(email, senha);
        const perfildesc = await perfilModel.listar([validUser.perfilId]);

        
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
            res.cookie("usuarioLogadoDesc", perfildesc[0].descricao, {
                sameSite: 'lax',
                path: '/'
            });
            
            let paginaDestino = '';
            if (validUser.perfilId == 1) {
                paginaDestino = 'alunos';
            } else if (validUser.perfilId == 2) {
                paginaDestino = 'professores';
            }else if (validUser.perfilId == 3) {
                paginaDestino = 'direcao';
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