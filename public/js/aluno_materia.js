document.addEventListener("DOMContentLoaded", function() {
    const materiaId = new URLSearchParams(window.location.search).get('materia_id');
    let statusMateria = null;
    const materiaNome = document.querySelector('.materia-nome');
    const conteudoLista = document.getElementById('conteudo-lista');
    const atividadesLista = document.getElementById('atividades-lista');
    const tabelaBimestre1 = document.getElementById('tabela-bimestre1');
    const tabelaBimestre2 = document.getElementById('tabela-bimestre2');
    const tabelaBimestre3 = document.getElementById('tabela-bimestre3');
    const tabelaBimestre4 = document.getElementById('tabela-bimestre4');

    //Botao para salvar resposta
    const btnSalvarResposta = document.querySelector('#responderAtividade .modal-footer .btn-primary');
    if(btnSalvarResposta) btnSalvarResposta.addEventListener('click', salvarResposta);

    //Botao para responder atividade
    const btnResponderAtividade = document.querySelector('#atividades-lista .responder-atividade');
    if(btnResponderAtividade) btnResponderAtividade.addEventListener('click', () => responderAtividade(btnResponderAtividade.dataset.id));
    

    function carregarConteudos() {
        if(!materiaId) return;
        
        fetch(`/system/alunos/conteudos/${materiaId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            const listaConteudos = document.getElementById('conteudo-lista');
            if(!listaConteudos) return;
            
            listaConteudos.innerHTML = '';
            
            if(data.length === 0) {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.textContent = 'Nenhum conteúdo cadastrado ainda';
                listaConteudos.appendChild(li);
                return;
            }
            
            data.forEach(conteudo => {
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';
                li.innerHTML = `
                    <div>
                        <h6>${conteudo.titulo}</h6>
                    </div>
                `;
                listaConteudos.appendChild(li);
            });
        })
        .catch(err => {
            console.error('Erro ao carregar conteúdos:', err);
            const listaConteudos = document.getElementById('conteudo-lista');
            if(listaConteudos) {
                listaConteudos.innerHTML = '<li class="list-group-item">Ops! Não conseguimos carregar os conteúdos</li>';
            }
        });
    }

    function carregarAtividades() {
        if(!materiaId) return;
        
        fetch(`/system/fetchAtividades?materia=${materiaId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            const listaAtividades = document.getElementById('atividades-lista');
            if(!listaAtividades) return;
            
            listaAtividades.innerHTML = '';
            
            if(data.length === 0) {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.textContent = 'Nenhuma atividade cadastrada ainda';
                listaAtividades.appendChild(li);
                return;
            }
            let bimestre = 0;
            data.forEach(atividade => {
                if(atividade.tipo == 3) return;
                if(bimestre != atividade.bimestre) {
                    bimestre = atividade.bimestre;
                    const li = document.createElement('li');
                    li.className = 'list-group-item';
                    li.textContent = `Bimestre ${bimestre}`;
                    listaAtividades.appendChild(li);
                }
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';
                li.innerHTML = `
                    <div>
                        <h6>${atividade.titulo}</h6>
                        <small>Entrega: ${new Date(atividade.data_entrega).toLocaleDateString()} - Peso: ${atividade.peso}</small>
                    </div>
                    <div>
                        <button class="btn btn-sm btn-info responder-atividade" data-id="${atividade.ati_id}">Responder</button>
                    </div>
                `;
                listaAtividades.appendChild(li);


            });
        })
        .then(() => {
            const responderAtividadeButtons = document.querySelectorAll('.responder-atividade');
            responderAtividadeButtons.forEach(button => {
                button.addEventListener('click', () => {
                    responderAtividade(button.dataset.id);
                });
            });
        })
        .catch(err => {
            console.error('Erro ao carregar atividades:', err);
            const listaAtividades = document.getElementById('atividades-lista');
            if(listaAtividades) {
                listaAtividades.innerHTML = '<li class="list-group-item">Ops! Não conseguimos carregar as atividades</li>';
            }
        });
    }

    function responderAtividade(id) {
        const modal = new bootstrap.Modal(document.getElementById('responderAtividade'));
        modal.show();
        verAtividade(id);
    }

    function salvarResposta() {
        const titulo = document.getElementById('titulo-atividade').textContent;
        const dataEntrega = document.getElementById('data-entrega').textContent;
        const descricao = document.getElementById('descricao-atividade').innerHTML;
        const resposta = tinymce.get('resposta').getContent();
        const atividadeId = document.getElementById('atividade-id').value;
        
        if(!atividadeId) {
            alert('Ops! Não foi possível identificar a atividade');
            return;
        }
        
        if(!resposta) {
            alert('Ops! Você precisa preencher a resposta');
            return;
        }
        
        let file = new FormData();
        file.set('resposta', resposta);
        file.set('id_atividade', atividadeId);
        try{
            if(document.getElementById('anexo-resposta').files[0]) file.set('anexo_resposta', document.getElementById('anexo-resposta').files[0]);
        }catch(err){
            console.error(err);
        }

        console.log(resposta);
        console.log(atividadeId);
        console.log(file);

        fetch('/system/alunos/resposta', {
            method: 'POST',
            credentials: 'include',
            body: file
        })
        .then(response => response.json())
        .then(data => {
            if(data.sucesso) {
                alert('Resposta enviada com sucesso!');
                const modal = bootstrap.Modal.getInstance(document.getElementById('responderAtividade'));
                modal.hide();
            } else {
                alert('Não foi possível enviar a resposta: ' + (data.mensagem || 'Erro desconhecido'));
            }
        })
        .catch(err => {
            console.error(err);
            alert('Ops! Tivemos um problema ao tentar enviar a resposta');
        });
    }

    function verAtividade(id) {
        fetch(`/system/fetchAtividades?id=${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if(data.length > 0) {
                const modal = new bootstrap.Modal(document.getElementById('responderAtividade'));
                modal.show();
                document.querySelector('#responderAtividade #titulo-atividade').textContent = data[0].titulo;
                document.querySelector('#responderAtividade #data-entrega').textContent = "Data de Entrega: " + new Date(data[0].data_entrega).toLocaleDateString() + " - Peso: " + data[0].peso;
                document.querySelector('#responderAtividade #descricao-atividade').innerHTML = data[0].descricao;
                document.querySelector('#responderAtividade #atividade-id').value = data[0].ati_id;
            } else {
                alert('Não foi possível carregar a atividade: ' + (data.mensagem || 'Erro desconhecido'));
            }
        })
        .catch(err => {
            console.error(err);
            alert('Ops! Tivemos um problema ao tentar carregar a atividade');
        });
    }

    function carregarTabelaNotas() {
        console.log("Carregar tabela notas");
        console.log(materiaId);
        if(!materiaId) return;

        let alunoId = document.cookie.split('; ').find(row => row.startsWith('usuarioLogado=')).split('=')[1];
        
        fetch(`/system/fetchRespostasAtividade?aluno=${alunoId}&materia=${materiaId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if(data.length > 0) {
              let tabelaBimestre1 = document.querySelector('#tabela-bimestre1 tbody');
              let tabelaBimestre2 = document.querySelector('#tabela-bimestre2 tbody');
              let tabelaBimestre3 = document.querySelector('#tabela-bimestre3 tbody');
              let tabelaBimestre4 = document.querySelector('#tabela-bimestre4 tbody');
                data.forEach(resposta => {
                  statusMateria = resposta.status;
                  if(resposta.corrigida == null){
                    resposta.nota = "Não Corrigida";
                  }
                    if(resposta.bimestre == 1){
                        tabelaBimestre1.innerHTML += `
                            <tr>
                                <td>${resposta.titulo}</td>
                                <td>${resposta.nota}</td>
                                <td>${resposta.peso}</td>
                                <td>${resposta.nota * (resposta.peso / 100)}</td>
                            </tr>
                        `;
                    }else if(resposta.bimestre == 2){
                        tabelaBimestre2.innerHTML += `
                            <tr>
                                <td>${resposta.titulo}</td>
                                <td>${resposta.nota}</td>
                                <td>${resposta.peso}</td>
                                <td>${resposta.nota * (resposta.peso / 100)}</td>
                            </tr>
                        `;
                    }else if(resposta.bimestre == 3){
                        tabelaBimestre3.innerHTML += `
                            <tr>
                                <td>${resposta.titulo}</td>
                                <td>${resposta.nota}</td>
                                <td>${resposta.peso}</td>
                                <td>${resposta.nota * (resposta.peso / 100)}</td>
                            </tr>
                        `;
                    }else if(resposta.bimestre == 4){
                        tabelaBimestre4.innerHTML += `
                            <tr>
                                <td>${resposta.titulo}</td>
                                <td>${resposta.nota}</td>
                                <td>${resposta.peso}</td>
                                <td>${resposta.nota * (resposta.peso / 100)}</td>
                            </tr>
                        `;
                    }


                });
            } else {
                alert('Não foi possível carregar a nota: ' + (data.mensagem || 'Erro desconhecido'));
            }
        })
        .then(() => {
            totalNotasBimestre();
        })
        .catch(err => {
            console.error(err);
            alert('Ops! Tivemos um problema ao tentar carregar a nota');
        });
    }

    function totalNotasBimestre(){
        let total = 0;
        let index = 1;
        let tabelaBimestre1 = document.querySelector('#tabela-bimestre1 tbody');
        let tabelaBimestre2 = document.querySelector('#tabela-bimestre2 tbody');
        let tabelaBimestre3 = document.querySelector('#tabela-bimestre3 tbody');
        let tabelaBimestre4 = document.querySelector('#tabela-bimestre4 tbody');
        let bimestre = [tabelaBimestre1, tabelaBimestre2, tabelaBimestre3, tabelaBimestre4];
        bimestre.forEach(bimestre => {
            let tr = bimestre.querySelectorAll('tr');
            tr.forEach(tr => {
                let td = tr.querySelectorAll('td:nth-child(4)');
                td.forEach(td => {
                    if(!isNaN(td.innerHTML)){
                        total += parseFloat(td.innerHTML);
                    }
                });
            });
            let totalBimestre = document.querySelector(`#tabela-bimestre${index} tfoot tr .total-bimestre`);
            totalBimestre.innerHTML = total;
            let status = document.querySelector(`#tabela-bimestre${index} tfoot tr .status`);
            if(!statusMateria == "ativo"){
                if(total >= 6){
                    status.innerHTML = '<td>Aprovado</td>';
                    status.className = 'badge bg-success';
                }else{
                    status.innerHTML = '<td>Reprovado</td>';
                    status.className = 'badge bg-danger';
                }
            }else{
                status.innerHTML = '<td>Aguardando</td>';
                status.className = 'badge bg-warning';
            }
            total = 0;
            index++;
        });

    }











    // Inicializa dados da página
    carregarAtividades();
    carregarTabelaNotas();
    carregarConteudos();


  });


