document.addEventListener("DOMContentLoaded", function() {

    const usuarioLogado = document.cookie.split('; ').find(row => row.startsWith('usuarioLogado=')).split('=')[1];

    fetch(`/system/professores/fetchTurmasProfessor?professor=${usuarioLogado}`)
        .then(response => response.json())
        .then(data => {
            const turmas = [...new Map(data.map(item => [item.turma_id, item])).values()];
            const turmatable = document.getElementById('turmas');
            turmatable.innerHTML = '';
            console.log(turmas);
            turmas.forEach(turma => {
                const turmaElement = document.createElement('li');
                turmaElement.innerHTML = `<li class="nav-item">
                        <a class="nav-link collapsed" data-bs-target="#turma-${turma.turma_id}" data-bs-toggle="collapse">
                            <i class="bi bi-box-seam"></i><span>${turma.nome}</span><i class="bi bi-chevron-down ms-auto"></i>
                        </a>
                        <ul id="turma-${turma.turma_id}" class="nav-content collapse " data-bs-parent="#turmas">
                            <li class="nav-item">
                                <a class="nav-link collapsed" data-bs-target="#disciplinas-${turma.turma_id}" data-bs-toggle="collapse">
                                    <i class="bi bi-box-seam"></i><span>Disciplinas</span><i class="bi bi-chevron-down ms-auto"></i>
                                </a>
                                <ul id="disciplinas-${turma.turma_id}" class="nav-content collapse " data-bs-parent="#turma-${turma.turma_id}">
                                    
                                </ul>
                            </li>
                        </ul>
                    </li>`;
                turmatable.appendChild(turmaElement);

                fetch(`/system/professores/fetchDisciplinasProfessor?turma=${turma.turma_id}`)
                    .then(response => response.json())
                    .then(data => {
                        const disciplinas = data;
                        const disciplinastable = document.getElementById(`disciplinas-${turma.turma_id}`);
                        disciplinastable.innerHTML = '';
                        disciplinas.forEach(disciplina => {
                            const disciplinaElement = document.createElement('li');
                            disciplinaElement.innerHTML = `<li class="nav-item">
                                    <a class="nav-link collapsed" href="/system/professores/materias?turma=${turma.turma_id}&disciplina=${disciplina.id}">
                                        <i class="bi bi-box-seam"></i><span>${disciplina.nome}</span>
                                    </a>
                                </li>`;
                            disciplinastable.appendChild(disciplinaElement);
                        });
                    })
                    .catch(error => {
                        const disciplinastable = document.getElementById(`disciplinas-${turma.turma_id}`);
                        disciplinastable.innerHTML = '<li class="nav-item">Nenhuma disciplina encontrada / Erro ao buscar disciplinas</li>';
                        console.error('Erro ao buscar disciplinas:', error);
                    });
            });
        })
        .catch(error => {
            const turmatable = document.getElementById('turmas');
            turmatable.innerHTML = '<li class="nav-item">Nenhuma turma encontrada / Erro ao buscar turmas</li>';
            console.error('Erro ao buscar turmas:', error);
        });



});
