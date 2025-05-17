document.addEventListener("DOMContentLoaded", function() {
    const materiaId = new URLSearchParams(window.location.search).get('materia_id');
    const materiaNome = document.querySelector('.materia-nome');
    const conteudoLista = document.getElementById('conteudo-lista');
    const atividadesLista = document.getElementById('atividades-lista');
    const tabelaBimestre1 = document.getElementById('tabela-bimestre1');
    const tabelaBimestre2 = document.getElementById('tabela-bimestre2');
    const tabelaBimestre3 = document.getElementById('tabela-bimestre3');
    const tabelaBimestre4 = document.getElementById('tabela-bimestre4');

    let usuarioLogado;
    const cookies = document.cookie.split('; ');
    const usuarioLogadoCookie = cookies.find(row => row.startsWith('usuarioLogado='));
    console.log(usuarioLogadoCookie);
    if (usuarioLogadoCookie) {
        usuarioLogado = usuarioLogadoCookie.split('=')[1];
    } else {
        console.error('Usuario não está logado');
        // Handle the case when the user is not logged in
        // For example, redirect to login page or show an error message
        return;
    }
    console.log(usuarioLogado);
    
    fetch(`/alunos/materias?materia_id=${materiaId}&aluno_id=${usuarioLogado}`)
      .then(res => res.json())
      .then(data => {
        materiaNome.innerText = data.materia_nome;
        data.conteudo.forEach(conteudo => {
          const li = document.createElement('li');
          li.classList.add('list-group-item');
          li.innerText = conteudo.conteudo_nome;
          conteudoLista.appendChild(li);
        });
  
        data.atividades.forEach(atividade => {
          const li = document.createElement('li');
          li.classList.add('list-group-item');
          li.innerText = atividade.titulo;
          atividadesLista.appendChild(li);
        });
  
        data.notas.forEach(nota => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>
                <div>
                    <img src="/img/atividade.png" alt="Imagem da atividade" width="50">
                    <p>${nota.atividade.titulo}</p>
                    <p>${nota.atividade.data_entrega}</p>
                </div>
            </td>
            <td>${nota.nota}</td>
          `;
          tabelaBimestre1.appendChild(tr);
        });
      })
      .catch(err => alert(err.message));
  });


