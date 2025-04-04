const PerfilModel = require("../models/perfilModel");
const UsuarioModel = require("../models/usuarioModel");

class LoginController{
    async getlogin(req, res) {
        let db_perfi = new PerfilModel();
        let usersper = await db_perfi.listar();
        let rows = [];

        usersper.forEach(per => (
            rows.push({
                "id_perfil":per.id,
                "desc_perfil":per.nome
            })
        ))

        res.render("form_login",{ layout: false ,users:rows});
    }

    /**
     * Realiza o login do usuário com base nos dados recebidos.
     *
     * Recebe os dados de email e senha do usuário e verifica se
     * existem um usuário com esses dados no banco de dados. Caso
     * exista, armazena o ID do usuário em uma cookie e retorna
     * uma resposta JSON com um status de sucesso e a descrição do
     * perfil do usuário. Caso contrário, retorna uma resposta JSON
     * com um status de erro e uma mensagem de erro.
     *
     * @param {Request} req - Requisição HTTP.
     * @param {Response} res - Resposta HTTP.
     */
    async postlogin(req, res) {
        const { email, senha } = req.body;
        console.log(email, senha);
        const usuarioModel = new UsuarioModel();
        const perfilModel = new PerfilModel();
        const validUser = await usuarioModel.validar(email, senha);
        const perfildesc = await perfilModel.listar([validUser.id]);
        
        if (validUser) {
            
            res.cookie("usuarioLogado", validUser.id);
            res.cookie("usuarioLogadoNome", validUser.nome);
            res.cookie("usuarioLogadoDesc", perfildesc[0].nome);
            res.json({success: true, message: "login realizado com sucesso", role: validUser.perfilId});
        } else {
            res.json({success: false, message: "Email ou senha inválidos"});
        }
    }
}

module.exports = LoginController;