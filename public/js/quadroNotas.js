document.addEventListener("DOMContentLoaded", function() {
    const quadroNotas = document.querySelector(".table tbody");
  
    fetch("/system/alunos/tabelaNotasFetch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        aluno_id: document.cookie.split('; ').find(row => row.startsWith('usuarioLogado=')).split('=')[1]
      })
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Connection refused');
        }
      })
      .then(data => {
        document.getElementById('aluno-nome').innerHTML = data[0].aluno_nome;
        document.getElementById('id-aluno').innerHTML = "ID: " + data[0].aluno_id;
        let html = "";
        data.forEach(disciplina => {
          html += `
            <tr>
              <td>${disciplina.disciplina_nome}</td>
              <td>${disciplina.nota1}</td>
              <td>${disciplina.nota2}</td>
              <td>${disciplina.nota3}</td>
              <td>${disciplina.nota4}</td>
              <td>${disciplina.media}</td>
            </tr>
          `;
        });
        quadroNotas.innerHTML = html;
        if(data.length == 0){
            quadroNotas.innerHTML = "<tr><td colspan='6'>Nenhuma disciplina encontrada</td></tr>";
        }
      })
      .catch(err => alert(err.message));
  });

