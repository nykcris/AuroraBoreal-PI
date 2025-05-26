document.addEventListener('DOMContentLoaded', function() {
    // Inicializa variáveis
    let materiaId = null;
    
    // ===== LISTENERS DE EVENTOS =====
    
    // Botão de salvar atividade
    const btnSalvarAtividade = document.querySelector('#novoAtividade .modal-footer .btn-primary');
    if(btnSalvarAtividade) btnSalvarAtividade.addEventListener('click', validateAtividadeForm);
    
    // Botão de salvar conteúdo
    const btnSalvarConteudo = document.querySelector('#novoConteudo .modal-footer .btn-primary');
    if(btnSalvarConteudo) btnSalvarConteudo.addEventListener('click', validateConteudoForm);

	// Função para validar o peso da atividade
	const pesoInput = document.getElementById('peso');
	if(pesoInput) pesoInput.addEventListener('input', validatePeso);
    
    // Delegação de eventos para botões de atividades
    const atividadesLista = document.getElementById('atividades-lista');
    if(atividadesLista) {
        atividadesLista.addEventListener('click', function(e) {
            if(e.target.classList.contains('ver-atividade')) {
                verAtividade(e.target.dataset.id);
            } else if(e.target.classList.contains('excluir-atividade')) {
                excluirAtividade(e.target.dataset.id);
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
    
    // Inicializa dados da página
    getMateriaId(); // Carrega o ID da matéria a partir da turma e disciplina selecionadas
    carregarAtividades();
    carregarConteudos();

	// ===== FUNÇÕES DE INICIALIZAÇÃO =====

	function getMateriaId() {
        fetch(`/system/professores/fetchDisciplinaTurmaId?turma=${turmaId}&disciplina=${disciplinaId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            materiaId = data[0].id;
        })
        .catch(err => {
            console.error(err);
        });
    }
    
    // ===== FUNÇÕES DE VALIDAÇÃO DE FORMULÁRIO =====
    
    function validateAtividadeForm() {
        const titulo = document.getElementById('titulo-atividade').value.trim();
        const descricao = tinymce.get('descricao-atividade').getContent();
        const tipo = document.getElementById('tipo-atividade').value;
        const dataEntrega = document.getElementById('data-entrega').value;
		const peso = document.getElementById('peso').value;
		const bimestre = document.getElementById('bimestre').value;
		const anexo = document.getElementById('anexo-atividade').files[0];
        
        let isValid = true;
        
        isValid = isValid && titulo !== '';
        
        if(!isValid) {
            alert('Ops! Você precisa preencher o título da atividade');
            return;
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
                
                // Recarrega a lista de atividades
                carregarAtividades();
            } else {
                alert('Não foi possível salvar a atividade: ' + (result.mensagem || 'Erro desconhecido'));
            }
        })
        .catch(err => {
            console.error(err);
            alert('Ops! Tivemos um problema ao tentar salvar sua atividade');
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
		document.getElementById('peso').max = 100 - totalPeso;
		document.querySelector('.peso-maximo').textContent = `O peso total das atividades não pode exceder ${document.getElementById('peso').max}.`;
		document.getElementById('peso').value = Math.min(parseInt(document.getElementById('peso').value), document.getElementById('peso').max);
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
        fetch(`/system/professores/atividades/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if(data.sucesso) {
                const modal = new bootstrap.Modal(document.getElementById('verAtividade'));
                modal.show();
                document.getElementById('titulo-atividade').value = data.atividade.titulo;
                document.getElementById('tipo-atividade').value = data.atividade.tipo;
                tinymce.get('descricao-atividade').setContent(data.atividade.descricao);
                document.getElementById('data-entrega').value = new Date(data.atividade.data_entrega).toISOString().slice(0, 16);
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
            fetch(`/system/professores/atividades/${id}`, {
                method: 'DELETE',
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
        
        fetch(`/system/professores/atividades/${materiaId}`, {
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
            
            data.forEach(atividade => {
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';
                li.innerHTML = `
                    <div>
                        <h6>${atividade.titulo}</h6>
                        <small>Entrega: ${new Date(atividade.data_entrega).toLocaleDateString()}</small>
                    </div>
                    <div>
                        <button class="btn btn-sm btn-info ver-atividade" data-id="${atividade.ati_id}">Ver</button>
                        <button class="btn btn-sm btn-danger excluir-atividade" data-id="${atividade.ati_id}">Excluir</button>
                    </div>
                `;
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
});
