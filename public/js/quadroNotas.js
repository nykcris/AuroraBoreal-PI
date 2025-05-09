document.addEventListener("DOMContentLoaded", function() {
    const quadroNotas = document.querySelector(".table tbody");
  
    fetch("/system/alunos/quadroNotasFetch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Connection refused');
        }
      })
      .then(data => {
        console.log(data);
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
      })
      .catch(err => alert(err.message));
  });

