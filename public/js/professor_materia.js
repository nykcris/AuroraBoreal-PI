document.addEventListener('DOMContentLoaded', function() {
    // Inicializa variáveis
    let materiaId = null;
    materiaId = new URLSearchParams(window.location.search).get('disciplina');
    let turmaId = null;
    turmaId = new URLSearchParams(window.location.search).get('turma');
    let aluno_id = null;
    let maxPeso = [0, 0, 0, 0];
    
    // ===== LISTENERS DE EVENTOS =====
    
    // Botão de salvar atividade
    const btnSalvarAtividade = document.querySelector('#novoAtividade .modal-footer .btn-primary');
    if(btnSalvarAtividade) btnSalvarAtividade.addEventListener('click', validateAtividadeForm);
    
    // Botão de salvar conteúdo
    const btnSalvarConteudo = document.querySelector('#novoConteudo .modal-footer .btn-primary');
    if(btnSalvarConteudo) btnSalvarConteudo.addEventListener('click', validateConteudoForm);

	// Função para validar o peso da atividade
	const pesoInput = document.getElementById('peso');
	if(pesoInput) pesoInput.addEventListener('input', () => validatePeso(bimestreSelect.value));
    
    // Botão de baixar anexo
    const downloadAnexoButton = document.getElementById('anexo-resposta-link');
    if(downloadAnexoButton) downloadAnexoButton.addEventListener('click', function(e) {
        e.preventDefault();
        downloadAnexo(this.href);
    });

    // Função para pegar e setar o peso
    const bimestreSelect = document.querySelector('#novoAtividade #bimestre');
    if(bimestreSelect) bimestreSelect.addEventListener('change', () => setMaximumPeso(bimestreSelect.value));

    // Botão de enviar resposta
    const btnSendResposta = document.querySelector('#verResposta .modal-footer .btn-primary');
    if(btnSendResposta) btnSendResposta.addEventListener('click', () => validateSendResposta(aluno_id));

    // Delegação de eventos para botões de atividades
    const atividadesLista = document.getElementById('atividades-lista');
    if(atividadesLista) {
        atividadesLista.addEventListener('click', function(e) {
            if(e.target.classList.contains('ver-atividade')) {
                verAtividade(e.target.dataset.id);
            } else if(e.target.classList.contains('excluir-atividade')) {
                excluirAtividade(e.target.dataset.id);
            } else if(e.target.classList.contains('editar-atividade')) {
                editarAtividade(e.target.dataset.id);
            }
        });
    }
    
    // Delegação de eventos para botões de conteúdo
    const conteudoLista = document.getElementById('conteudo-lista');
    if(conteudoLista) {
        conteudoLista.addEventListener('click', function(e) {
            if(e.target.classList.contains('ver-conteudo')) {
                verConteudo(e.target.dataset.id);
            } else if(e.target.classList.contains('excluir-conteudo')) {
                excluirConteudo(e.target.dataset.id);
            }
        });
    }


    const notaInput = document.getElementById('nota');
    if(notaInput) notaInput.addEventListener('input', validateNota);
    
	const tipoAtividade = document.getElementById('tipo-atividade');
	if(tipoAtividade) tipoAtividade.addEventListener('change', provaButton);
	provaButton();
    
	function provaButton() {
		const tipo = document.getElementById('tipo-atividade').value;
		if(tipo == 3){
			document.getElementById('prova-div').style.display = 'block';
		} else {
			document.getElementById('prova-div').style.display = 'none';
		}
	}
    
    // ===== FUNÇÕES DE VALIDAÇÃO DE FORMULÁRIO =====
    
    function validateAtividadeForm() {
        const titulo = document.getElementById('titulo-atividade').value.trim();
        const descricao = tinymce.get('descricao-atividade').getContent();
        let tipo = document.getElementById('tipo-atividade').value;
        const dataEntrega = document.getElementById('data-entrega').value;
		const peso = document.getElementById('peso').value;
		const bimestre = document.getElementById('bimestre').value;
		const anexo = document.getElementById('anexo-atividade').files[0];
        const checkProva = document.getElementById('check-prova').checked;
        
        let isValid = true;
        
        isValid = isValid && titulo !== '';
        isValid = isValid && descricao !== '';
        isValid = isValid && dataEntrega !== '';
		isValid = isValid && peso !== '';
		isValid = isValid && bimestre !== '';
        
        if(!isValid) {
            alert('Ops! Você precisa preencher os campos obrigatórios');
            return;
        }

        if(materiaId == null){
            alert('Ops! Não foi possível carregar a matéria');
            return;
        }

        if(checkProva){
            tipo = 4;
        }
        
        let Form = new FormData();
        Form.set('titulo', titulo);
        Form.set('descricao', descricao);
        Form.set('tipo', tipo);
        Form.set('data_entrega', dataEntrega);
		Form.set('id_materia', materiaId);
		Form.set('peso', peso);
		Form.set('bimestre', bimestre);
		if(anexo) Form.set('anexo_atividade', anexo);

        console.log(Form);
        
        fetch('/system/professores/atividades', {
            method: 'POST',
            credentials: 'include',
            body: Form
        })
        .then(res => res.json())
        .then(result => {
            if(result.sucesso) {
                // Fecha o modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('novoAtividade'));
                modal.hide();
                
                // Limpa os campos do formulário
                document.getElementById('titulo-atividade').value = '';
                tinymce.get('descricao-atividade').setContent('');
                document.getElementById('data-entrega').value = '';
				document.getElementById('peso').value = '';
                
                // Mostra mensagem de sucesso
                alert('Atividade salva com sucesso!');

                // Preenche automaticamente a resposta
                if(tipo == 4 || tipo == 3) autoFillProva(result.id_atividade);
                
                // Recarrega a lista de atividades
                carregarAtividades();
            } else {
                alert('Não foi possível salvar a atividade: ' + (result.mensagem || 'Erro desconhecido'));
            }
        })
        .catch(err => {
            console.error(err);
            // Fecha o modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('novoAtividade'));
            modal.hide();
            
            // Limpa os campos do formulário
            document.getElementById('titulo-atividade').value = '';
            tinymce.get('descricao-atividade').setContent('');
            document.getElementById('data-entrega').value = '';
            document.getElementById('peso').value = '';
            
            // Mostra mensagem de sucesso
            alert('Ops! Tivemos um problema ao tentar salvar a atividade');
            
            // Recarrega a lista de atividades
            carregarAtividades();
        });
    }

	function validatePeso() {
		const bimestre = document.getElementById('bimestre').value;
		if(!bimestre) return;
		const pesoAtividade = document.querySelectorAll(`.peso-atividade .bimestre-${bimestre}`);
		let totalPeso = 0;
		pesoAtividade.forEach(peso => {
			totalPeso += parseInt(peso.value);
		});
		document.querySelector('#novoAtividade #peso').max = 100 - totalPeso;
		document.querySelector('#novoAtividade .peso-maximo').textContent = `O peso total das atividades não pode exceder ${document.getElementById('peso').max}.`;
		document.querySelector('#novoAtividade #peso').value = Math.min(parseInt(document.getElementById('peso').value), document.getElementById('peso').max);
	}
    
    function validateConteudoForm() {
        const titulo = document.getElementById('titulo-conteudo').value.trim();
        const descricao = tinymce.get('descricao-conteudo').getContent();
        
        let isValid = true;
        
        isValid = isValid && titulo !== '';
        
        if(!isValid) {
            alert('Ops! Você precisa preencher o título do conteúdo');
            return;
        }
        
        const dados = {
            titulo: titulo,
            descricao: descricao,
            id_materia: materiaId
        };
        
        fetch('/system/professores/conteudos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(dados)
        })
        .then(res => res.json())
        .then(result => {
            if(result.sucesso) {
                // Fecha o modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('novoConteudo'));
                modal.hide();
                
                // Limpa os campos do formulário
                document.getElementById('titulo-conteudo').value = '';
                tinymce.get('descricao-conteudo').setContent('');
                
                // Mostra mensagem de sucesso
                alert('Conteúdo salvo com sucesso!');
                
                // Recarrega a lista de conteúdos
                carregarConteudos();
            } else {
                alert('Não foi possível salvar o conteúdo: ' + (result.mensagem || 'Erro desconhecido'));
            }
        })
        .catch(err => {
            console.error(err);
            alert('Ops! Tivemos um problema ao tentar salvar seu conteúdo');
        });
    }
    
    // ===== FUNÇÕES DE AÇÃO =====
    
    function verAtividade(id) {
        fetch(`/system/professores/fetchAtividades?id=${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if(data.length > 0) {
                const modal = new bootstrap.Modal(document.getElementById('verAtividade'));
                modal.show();
                document.querySelector('#verAtividade #titulo-atividade').value = data[0].titulo;
                document.querySelector('#verAtividade #tipo-atividade').value = data[0].tipo;
                tinymce.get('descricao-ver-atividade').setContent(data[0].descricao);
                document.querySelector('#verAtividade #data-entrega').value = new Date(data[0].data_entrega).toISOString().slice(0, 16);
            } else {
                alert('Não foi possível carregar a atividade: ' + (data.mensagem || 'Erro desconhecido'));
            }
        })
        .catch(err => {
            console.error(err);
            alert('Ops! Tivemos um problema ao tentar carregar a atividade');
        });
    }

    function verListaRespostas(alunoId) {
        fetch(`/system/fetchRespostas?aluno=${alunoId}&materia=${materiaId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            const modal = new bootstrap.Modal(document.getElementById('verTodasRespostas'));
            modal.show();
            const respostas = data;
            const tabelaRespostasBody = document.querySelector('#respostas-body');
            tabelaRespostasBody.innerHTML = '';
            if(respostas.length == 0){
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td colspan="4">Nenhuma resposta encontrada</td>
                `;
                tabelaRespostasBody.appendChild(row);
                return;
            }
            respostas.forEach(resposta => {
                if(resposta.corrigida == 0){
                    resposta.corrigida = 'Não';
                }else{
                    resposta.corrigida = 'Sim';
                }
                if(resposta.data_entrega < new Date()){
                    resposta.corregir = 'disabled';
                }else{
                    resposta.atrasada = '';
                }
                
                const row = document.createElement('tr');

                console.log(resposta.tipo);

                if(resposta.tipo == 4 || resposta.tipo == 3){
                    row.style.backgroundColor = '#ff0000';
                    row.innerHTML = `
                            <td>${resposta.titulo}</td>
                            <td>${new Date(resposta.data_envio).toLocaleDateString()}</td>
                            <td>
                            Nota: ${resposta.nota}
                            Corrigido: ${resposta.corrigida}
                            </td>
                            <td>
                                <button class="btn btn-sm btn-success ver-resposta" data-id="${resposta.res_id}">Avaliar</button>
                            </td>
                    `;
                    tabelaRespostasBody.appendChild(row);
                    return;
                }

                row.innerHTML = `
                    <td>${resposta.titulo}</td>
                    <td>${new Date(resposta.data_envio).toLocaleDateString()}</td>
                    <td>
                    <p>Nota: ${resposta.nota}</p>
                    <p>Corrigido: ${resposta.corrigida}</p>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-info ver-resposta" data-id="${resposta.res_id}"  ${resposta.corregir}>Ver</button>
                    </td>
                `;
                tabelaRespostasBody.appendChild(row);
            });



        })
        .then(() => {
            const verRespostaButtons = document.querySelectorAll('.ver-resposta');
            verRespostaButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const modal = new bootstrap.Modal(document.getElementById('verTodasRespostas'));
                    modal.hide();
                    verResposta(button.dataset.id, alunoId);
                });
            });

            const closeListaRespostasButton = document.querySelector('#verTodasRespostas .btn-close');
            closeListaRespostasButton.addEventListener('click', () => {
                const modal = new bootstrap.Modal(document.getElementById('verTodasRespostas'));
                modal.hide();
            });
        })
        .catch(err => {
            console.error('Erro ao carregar respostas:', err);
            const tabelaRespostasBody = document.querySelector('#respostas-body');
            if(tabelaRespostasBody) {
                tabelaRespostasBody.innerHTML = '<tr><td colspan="4">Ops! Não conseguimos carregar as respostas</td></tr>';
            }
        });
    }





    function verResposta(id, alunoId) {
        aluno_id = alunoId;
        fetch(`/system/fetchRespostas?id=${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if(data.length > 0) {
                const modal = new bootstrap.Modal(document.getElementById('verResposta'));
                modal.show();
                document.querySelector('#verResposta #atividade-titulo').value = data[0].titulo;
                tinymce.get('resposta').setContent(data[0].resposta);
                if(data[0].anexo_resposta){
                    document.querySelector('#verResposta #anexo-resposta-link').href = "/"+ data[0].anexo_resposta;
                    document.querySelector('#verResposta #anexo-resposta-link').style.display = 'block';
                }
                document.querySelector('#verResposta #nota').value = data[0].nota;
                document.querySelector('#verResposta #comentario-professor').value = data[0].comentario_professor;
                document.querySelector('#verResposta #resposta-id').value = data[0].res_id;
            } else {
                alert('Não foi possível carregar a resposta: ' + (data.mensagem || 'Erro desconhecido'));
            }
        })
        .catch(err => {
            console.error(err);
            alert('Ops! Tivemos um problema ao tentar carregar a resposta');
        });
    }



    function editarAtividade(id) {
        fetch(`/system/professores/fetchAtividades?id=${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if(data.length > 0) {
                const modal = new bootstrap.Modal(document.getElementById('editarAtividade'));
                modal.show();
                document.querySelector('#editarAtividade #titulo-atividade').value = data[0].titulo;
                document.querySelector('#editarAtividade #tipo-atividade').value = data[0].tipo;
                tinymce.get('descricao-editar-atividade').setContent(data[0].descricao);
                document.querySelector('#editarAtividade #data-entrega').value = new Date(data[0].data_entrega).toISOString().slice(0, 16);
            } else {
                alert('Não foi possível carregar a atividade: ' + (data.mensagem || 'Erro desconhecido'));
            }
        })
        .catch(err => {
            console.error(err);
            alert('Ops! Tivemos um problema ao tentar carregar a atividade');
        });
    }



    
    function excluirAtividade(id) {
        if(confirm('Tem certeza que deseja excluir esta atividade?')) {
            fetch(`/system/professores/deletarAtividade?id=${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            })
            .then(response => response.json())
            .then(data => {
                if(data.sucesso) {
                    alert('Atividade excluída com sucesso!');
                    carregarAtividades();
                } else {
                    alert('Não foi possível excluir a atividade: ' + (data.mensagem || 'Erro desconhecido'));
                }
            })
            .catch(err => {
                console.error(err);
                alert('Ops! Tivemos um problema ao tentar excluir a atividade');
            });
        }
    }
    
    function verConteudo(id) {
        fetch(`/system/professores/conteudos/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if(data.sucesso) {
                const modal = new bootstrap.Modal(document.getElementById('verConteudo'));
                modal.show();
                document.getElementById('titulo-conteudo').value = data.conteudo.conteudo_nome;
                tinymce.get('descricao-conteudo').setContent(data.conteudo.descricao);
            } else {
                alert('Não foi possível carregar o conteúdo: ' + (data.mensagem || 'Erro desconhecido'));
            }
        })
        .catch(err => {
            console.error(err);
            alert('Ops! Tivemos um problema ao tentar carregar o conteúdo');
        });
    }
    
    function excluirConteudo(id) {
        if(confirm('Tem certeza que deseja excluir este conteúdo?')) {
            fetch(`/system/professores/conteudos/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            })
            .then(response => response.json())
            .then(data => {
                if(data.sucesso) {
                    alert('Conteúdo excluído com sucesso!');
                    carregarConteudos();
                } else {
                    alert('Não foi possível excluir o conteúdo: ' + (data.mensagem || 'Erro desconhecido'));
                }
            })
            .catch(err => {
                console.error(err);
                alert('Ops! Tivemos um problema ao tentar excluir o conteúdo');
            });
        }
    }
    
    // ===== FUNÇÕES DE CARREGAMENTO DE DADOS =====
    
    function carregarAtividades() {
        if(!materiaId) return;
        
        fetch(`/system/professores/fetchAtividades?materia=${materiaId}`, {
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
            let bimestreCount = 0;
            let peso = 0;
            data.forEach((atividade, index) => {
                if(bimestreCount != atividade.bimestre) {
                    bimestreCount = atividade.bimestre;
                    const li = document.createElement('li');
                    li.className = 'list-group-item';
                    li.textContent = `Bimestre ${bimestreCount} - Peso total: `;
                    const span = document.createElement('span');
                    span.className = `peso-total-${bimestreCount}`;
                    span.textContent = "0";
                    li.appendChild(span);
                    listaAtividades.appendChild(li);
                    peso = 0;
                    setMaximumPeso(1);
                }
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';
                li.innerHTML = `
                    <div>
                        <h6>${atividade.titulo}</h6>
                        <small>Entrega: ${new Date(atividade.data_entrega).toLocaleDateString()}</small>
                    </div>
                    <div>
                        <p class="peso-atividade bimestre-${atividade.bimestre}" value="${atividade.peso}">peso: ${atividade.peso}</p>
                    </div>
                    <div>
                        <button class="btn btn-sm btn-info ver-atividade" data-id="${atividade.ati_id}">Ver</button>
                        <button class="btn btn-sm btn-warning editar-atividade" data-id="${atividade.ati_id}">Editar</button>
                        <button class="btn btn-sm btn-danger excluir-atividade" data-id="${atividade.ati_id}">Excluir</button>
                    </div>
                `;
                peso += atividade.peso;
                maxPeso[bimestreCount - 1] = parseInt(peso);
                document.querySelector(`.peso-total-${bimestreCount}`).textContent = maxPeso[bimestreCount - 1].toFixed(2);
                console.log(peso);
                listaAtividades.appendChild(li);
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
    
    function carregarConteudos() {
        if(!materiaId) return;
        
        fetch(`/system/professores/conteudos/${materiaId}`, {
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
                    <div>
                        <button class="btn btn-sm btn-info ver-conteudo" data-id="${conteudo.con_id}">Ver</button>
                        <button class="btn btn-sm btn-warning editar-conteudo" data-id="${conteudo.con_id}">Editar</button>
                        <button class="btn btn-sm btn-danger excluir-conteudo" data-id="${conteudo.con_id}">Excluir</button>
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


    function fetchAlunos(){
        fetch(`/system/fetchAlunos?turma=${turmaId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            const alunos = data;
            const tabelaAlunosBody = document.querySelector('#tabela-alunos tbody');
            tabelaAlunosBody.innerHTML = '';
            alunos.forEach(aluno => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <th scope="row">${aluno.id}</th>
                    <td>${aluno.aluno_nome}</td>
                    <td>
                        <button class="btn btn-sm btn-info ver-aluno" data-id="${aluno.id}">Ver Respostas</button>
                    </td>
                `;
                tabelaAlunosBody.appendChild(row);
            });

        })
        .then(() => {
            const verAlunoButtons = document.querySelectorAll('.ver-aluno');
            verAlunoButtons.forEach(button => {
                button.addEventListener('click', () => {
                    verListaRespostas(button.dataset.id);
                });
            });
        })
        .catch(err => {
            console.error('Erro ao carregar alunos:', err);
            const alunosSelect = document.getElementById('aluno-select');
            if(alunosSelect) {
                alunosSelect.innerHTML = '<option value="">Ops! Não conseguimos carregar os alunos</option>';
            }
        });

    }

    function fetchRespostas(alunoId){
        fetch(`/system/fetchRespostas?aluno=${alunoId}&materia=${materiaId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            const respostas = data;
            const tabelaRespostasBody = document.querySelector('#respostas-body');
            tabelaRespostasBody.innerHTML = '';
            if(respostas.length == 0){
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td colspan="4">Nenhuma resposta encontrada</td>
                `;
                tabelaRespostasBody.appendChild(row);
                return;
            }
            respostas.forEach(resposta => {
                if(resposta.corrigida == 0){
                    resposta.corrigida = 'Não';
                }else{
                    resposta.corrigida = 'Sim';
                }
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${resposta.titulo}</td>
                    <td>${new Date(resposta.data_envio).toLocaleDateString()}</td>
                    <td>
                    Nota: ${resposta.nota}
                    Corrigido: ${resposta.corrigida}
                    </td>
                    <td>
                        <button class="btn btn-sm btn-info ver-resposta" data-id="${resposta.res_id}">Ver</button>
                    </td>
                `;
                tabelaRespostasBody.appendChild(row);
            });

        })
        .then(() => {
        })
        .catch(err => {
            console.error('Erro ao carregar respostas:', err);
            const tabelaRespostasBody = document.querySelector('#respostas-body');
            if(tabelaRespostasBody) {
                tabelaRespostasBody.innerHTML = '<tr><td colspan="4">Ops! Não conseguimos carregar as respostas</td></tr>';
            }
        });

    }

    function fetchMateriaNome(){
        fetch(`/system/fetchNomeMateria?id=${materiaId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            const materiaNome = document.querySelector('#materia-nome');
            materiaNome.innerHTML = data[0].disciplina_nome;
        })
        .catch(err => {
            console.error('Erro ao carregar nome da matéria:', err);
        });

    }

    //-------- Validacoes --------

    function validateNota() {
        const nota = document.getElementById('nota').value;
        try{
            if(nota < 0 || nota > 10){
                alert('Nota inválida');
                document.getElementById('nota').value = '';
            }
        }catch(err){
            console.error(err);
        }
    }

    function validatePeso(bimestre) {
        const peso = document.getElementById('peso').value;
        setMaximumPeso(bimestre);
        try{
            if(peso < 0){
                document.getElementById('peso').value = 0;
            }
            if(peso > 100){
                document.getElementById('peso').value = 100;
            }
            if(peso > 100 - maxPeso[bimestre - 1]){
                document.getElementById('peso').value = 100 - maxPeso[bimestre - 1];
            }
            
        }catch(err){
            console.error(err);
        }
    }

    function validateDataEntrega() {
        const dataEntrega = document.getElementById('data-entrega').value;
        try{
            if(dataEntrega < new Date().toLocaleDateString()){
                alert('Data de entrega inválida');
                document.getElementById('data-entrega').value = '';
            }
        }catch(err){
            console.error(err);
        }
    }

    function validateAnexo() {
        const anexo = document.getElementById('anexo-atividade').files[0];
        try{
            if(anexo.size > 10000000){
                alert('Arquivo muito grande');
                document.getElementById('anexo-atividade').value = '';
            }
        }catch(err){
            console.error(err);
        }
    }

    function validateSendResposta(alunoId) {
        const nota = document.getElementById('nota').value;
        const comentario = tinymce.get('comentario-professor').getContent();
        const idResposta = document.querySelector('#verResposta #resposta-id').value;
        if(nota == ''){
            alert('Preencha a nota');
            return;
        }

        if(idResposta == ''){
            alert('Erro interno');
            return;
        }

        fetch('/system/professores/corrigirResposta', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                nota: nota,
                comentario_professor: comentario,
                res_id: idResposta
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data.sucesso) {
                alert('Resposta enviada com sucesso!');
                const modal = bootstrap.Modal.getInstance(document.getElementById('verResposta'));
                modal.hide();
            } else {
                alert('Não foi possível enviar a resposta: ' + (data.mensagem || 'Erro desconhecido'));
            }
        })
        .then(() => {
            updateTabelaNotas(alunoId);
            fetchRespostas(alunoId);
        })
        .catch(err => {
            console.error(err);
            alert('Ops! Tivemos um problema ao tentar enviar a resposta');
        });
    }

    //-------- Download --------

    function downloadAnexo(path) {
        fetch(`/system/download?path=${path}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = path.split('/').pop();
            a.click();
        })
        .catch(err => {
            console.error('Erro ao baixar anexo:', err);
            alert('Ops! Tivemos um problema ao tentar baixar o anexo');
        });

    }

    //-------- Handle aluno --------

    function updateTabelaNotas(alunoId){
        let atividades;

        fetch(`/system/fetchRespostasAtividade?aluno=${alunoId}&materia=${materiaId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            atividades = data;
            let bimestre = [[],[],[],[]];
            atividades.forEach(atividade => {
                bimestre[atividade.bimestre - 1].push(atividade);
            });
            
            bimestre.forEach((bimestre, index) => {
                let total = 0;
                bimestre.forEach(atividade => {
                    console.log(atividade);
                    total += atividade.nota * (atividade.peso / 100);
                });
                fetch(`/system/fetchNotas?aluno=${alunoId}&materia=${materiaId}&bimestre=${index + 1}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                })
                .then(response => response.json())
                .then(data => {
                    if(data.length == 0){
                        fetch(`/system/professores/cadastrarNota`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({
                                aluno_id: alunoId,
                                turma_disciplina_id: materiaId,
                                valor_nota: total,
                                bimestre: index + 1
                            })
                        })
                        .then(response => response.json())
                        .then(data => {
                            if(data.sucesso) {
                                console.log('Nota cadastrada com sucesso!');
                            } else {
                                console.log('Não foi possível cadastrar a nota: ' + (data.mensagem || 'Erro desconhecido'));
                            }
                        })
                        .catch(err => {
                            console.error(err);
                            alert('Ops! Tivemos um problema ao tentar cadastrar a nota');
                        });
                    }else{
                        fetch(`/system/professores/atualizarNota`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify({
                                aluno_id: alunoId,
                                turma_disciplina_id: materiaId,
                                valor_nota: total,
                                bimestre: index + 1
                            })
                        })
                        .then(response => response.json())
                        .then(data => {
                            if(data.sucesso) {
                                console.log('Nota atualizada com sucesso!');
                            } else {
                                console.log('Não foi possível atualizar a nota: ' + (data.mensagem || 'Erro desconhecido'));
                            }
                        })
                        .catch(err => {
                            console.error(err);
                            alert('Ops! Tivemos um problema ao tentar atualizar a nota');
                        });
                    }
                })
                .catch(err => {
                    console.error(err);
                    alert('Ops! Tivemos um problema ao tentar atualizar a nota');
                });
            });

        })

    }

    function autoFillProva(atividade_id) {
        console.log('Preenchendo provas automaticamente');
        fetch(`/system/fetchAlunos?turma=${turmaId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            const alunos = data;
            alunos.forEach(aluno => {
                const atividadeId = atividade_id;
                const aluno_id = aluno.id;
                const resposta = 'Resposta automática';
                
                if(!atividadeId) {
                    alert('Ops! Não foi possível identificar a atividade');
                    return;
                }
                
                let file = new FormData();
                file.set('aluno_id', aluno_id);
                file.set('resposta', resposta);
                file.set('id_atividade', atividadeId);
                try{
                    if(document.getElementById('anexo-resposta').files[0]) file.set('anexo_resposta', document.getElementById('anexo-resposta').files[0]);
                }catch(err){
                    console.error(err);
                }

                console.log(resposta);
                console.log(atividadeId);

                fetch('/system/alunos/resposta', {
                    method: 'POST',
                    credentials: 'include',
                    body: file
                })
                .then(response => response.json())
                .then(data => {
                    if(data.sucesso) {
                        console.log('Resposta enviada com sucesso!');
                    } else {
                        alert('Não foi possível Gerar respostas automáticas: ' + (data.mensagem || 'Erro desconhecido'));
                    }
                })
                .catch(err => {
                    console.error(err);
                    alert('Ops! Tivemos um problema ao tentar Gerar respostas automáticas');
                });
            });

        })


    }

    //------- Outras Funções -------

    function setMaximumPeso(bimestre) {
        let pesoTotal = maxPeso[bimestre - 1];
        document.querySelector('#novoAtividade #peso').max = 100 - pesoTotal;
        document.querySelector('#novoAtividade .peso-maximo').textContent = `O peso total das atividades não pode exceder ${document.getElementById('peso').max}.`;
        
    }



    // Inicializa dados da página
    carregarAtividades();
    carregarConteudos();
    fetchAlunos();
    fetchMateriaNome();
    setMaximumPeso(1);

});
