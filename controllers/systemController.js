const DB_Perfil = require("../models/perfilModel");
const DB_Usuarios = require("../models/usuarioModel");
const DB_Atividade = require("../models/atividadeModel");
const DB_Resposta = require("../models/respostaModel");

class SystemController {
    async index(req, res) {
        let db_perfi = new DB_Perfil();
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

    async alunos(req,res) {
        console.log("Entrou na página de alunos");
        
        let db_aluno = new DB_Usuarios();
        let alunos = await db_aluno.listar([1]);
        let rows = [];
        for (let i = 0; i < alunos.length; i++) {
            rows.push({
                "usu_id":alunos[i].id,
                "usu_nome":alunos[i].nome,
                "email_user":alunos[i].email,
                "usu_senha":alunos[i].senha,
                "per_id":alunos[i].perfilId
            })
        }
        console.log("Numeros de Alunos:" + rows.length);

        let db_atividade = new DB_Atividade();
        let db_resposta = new DB_Resposta();
        let atividades = await db_atividade.listar();
        let atividadesFeitas = [];
        atividades.forEach(async atividade => {
            let filtro = [];
            filtro.push(atividade.ati_id);
            filtro.push(req.cookies.usuarioLogado);
            let respostas = await db_resposta.listar(filtro,1);
            console.log(respostas);
            atividadesFeitas.push(respostas.length > 0 ? 1 : 0);
        });
        
        res.render("alunos_index",{ layout: 'layout', rows, atividades_cadastradas:atividades, atividadesFeitas });
    }

    direcao(req,res) {
        res.render("direcao_index",{ layout: 'layout' });
    }

    async professores(req,res) {
        let db_func = new DB_Usuarios();
        let funcs = await db_func.listar([2]);
        let rows = [];

        for (let i = 0; i < funcs.length; i++) {
            rows.push({
                "usu_id":funcs[i].id,
                "usu_nome":funcs[i].nome,
                "usu_email":funcs[i].email,
                "usu_senha":funcs[i].senha,
                
                "per_id":funcs[i].perfilId
            })
        }
        console.log(rows.length);

        
        let db_atividade = new DB_Atividade();
        let atividades = await db_atividade.listar();
        let atividades_rows = [];
        for (let i = 0; i < atividades.length; i++) {
            atividades_rows.push({
                "ati_id":atividades[i].ati_id,
                "titulo":atividades[i].titulo,
                "descricao":atividades[i].descricao,
                "data_criacao":atividades[i].data_criacao,
                "data_entrega":atividades[i].data_entrega,
                "id_professor":atividades[i].id_professor,
                "anexo_atividade":atividades[i].anexo_atividade,
            })
        }


        console.log(atividades_rows.slice(-1)[0]);
        res.render("professores_index",{ layout: 'layout',rows, 'atividades_cadastradas':atividades_rows});
    }

    async register(req,res) {
        let db_perfi = new DB_Perfil();
        let usersper = await db_perfi.listar();
        let rows = [];

        usersper.forEach(per => (
            rows.push({
                "per_id":per.id,
                "per_descricao":per.descricao
            })
        ))
        res.render("form_register",{ layout: 'imports_layout',rows});
    }

    async atividades(req, res) {
        

        let atividade = new DB_Atividade(
            0,
            req.body.titulo,
            req.body.descricao,
            new Date(), // data_criacao
            req.body.data_entrega,
            req.cookies.usuarioLogado,
            req.body.anexo_atividade // ou `req.file.filename` se estiver usando upload
        );
        let sucesso = await atividade.gravar(); // chama o método da própria instância
        
        console.log(sucesso);
        if(sucesso){
            console.log("Sucesso ao gravar a atividade");
            res.redirect("/system/professores");
        } else {
            console.log("Erro ao gravar atividade");
            res.send("Erro ao gravar atividade");
        }
    }


    async deletarAtividades(req, res) {
        let DBA = new DB_Atividade();
        let sucesso = await DBA.excluir(req.query.id);

        if(sucesso){
            console.log("Sucesso ao deletar a atividade");
            res.redirect("/system/professores");
        } else {
            console.log("Erro ao deletar atividade");
            res.send("Erro ao deletar atividade");
        }
    }

    async editarAtividades(req, res) {
        let DBA = new DB_Atividade();
        let lista = [];
        let atividade = await DBA.listar(req.query.id);
        console.log(atividade);

        res.render("editar_atividades", { layout:'layout', atividade });
    }

    async editarAtividadesPost(req, res) {

        let atividade = new DB_Atividade(
            req.body.id,
            req.body.titulo,
            req.body.descricao,
            new Date(),
            req.body.data_entrega,
            req.cookies.usuarioLogado,
            req.body.anexo_atividade
        );
        console.log(atividade.ati_id);
        console.log(atividade.ati_id);
        console.log(atividade.ati_id);

        let sucesso = await atividade.atualizar();

        res.redirect("/system/professores");
    }

    async responderAtividades(req, res) {
        let DBA = new DB_Atividade();
        let lista = [];
        let atividade = await DBA.listar(req.query.id);
        console.log(atividade);

        res.render("respostas", { layout:'layout', atividade });
        
    }

    async responderAtividadesPost(req, res) {
        let DBA = new DB_Resposta();
        let filtro = [];
        filtro.push(req.body.id_atividade);
        filtro.push(req.cookies.usuarioLogado);
        let update = await DBA.listar(filtro,1);
        if (update.length > 0) {
            DBA = new DB_Resposta(
                update[0].res_id,
                req.body.id_atividade,
                req.cookies.usuarioLogado,
                req.body.resposta,
                new Date(),
                0,
                0
            );
            let sucesso = await DBA.atualizar();
        }else{
            DBA = new DB_Resposta(
                0,
                req.body.id_atividade,
                req.cookies.usuarioLogado,
                req.body.resposta,
                new Date(),
                0,
                0
            );
            let sucesso = await DBA.gravar();            
        }

        res.redirect("/system/alunos");
    }
}



module.exports = SystemController;