document.addEventListener("DOMContentLoaded", function() {
    
    const usuarioLogado = document.cookie.split('; ').find(row => row.startsWith('usuarioLogado=')).split('=')[1];

    function fetchDisciplinasLinks() {
        fetch('/system/alunos/fetchDisciplinas?id=${usuarioLogado}', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(result => {
                let ul = document.querySelector('#components-nav');
                result.forEach(materia => {
                    let li = document.createElement('li');
                    let a = document.createElement('a');
                    a.href = `/system/alunos/materias?materia_id=${materia.id}`;
                    a.innerHTML = `<i class="bi bi-circle"></i><span>${materia.nome}</span>`;
                    li.appendChild(a);
                    ul.appendChild(li);
                });
            })
            .catch(err => {
                console.error(err);
            });
    }

    fetchDisciplinasLinks();
});


