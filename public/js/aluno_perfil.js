document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector(".edit-box form");

    const usuarioLogado = document.cookie.split('; ').find(row => row.startsWith('usuarioLogado=')).split('=')[1];
  
    form.addEventListener("submit", function(event) {
      event.preventDefault();
  
      const nome = document.getElementById("nome").value;
      const email = document.getElementById("email").value;
      const responsavel = document.getElementById("responsavel").value;
  
      // Faça uma requisição para o servidor com os dados do formulário
      fetch("/aluno/atualizar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome: nome,
          email: email,
          responsavel: responsavel
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert("Dados salvos com sucesso!");
        } else {
          alert("Erro ao salvar os dados. Tente novamente mais tarde.");
        }
      })
      .catch(error => {
        console.error("Erro na requisição:", error);
        alert("Erro ao salvar os dados. Tente novamente mais tarde.");
      });
    });

    const fetchAluno = () => {
        console.log(usuarioLogado);
        let id = usuarioLogado;
        fetch(`/system/alunos/fetchAluno?id=${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                document.getElementById('nome_aluno').innerText = result[0].aluno_nome;
                document.getElementById('cpf_aluno').innerText = result[0].aluno_cpf;
                document.getElementById('data_nascimento').innerText = result[0].aluno_nasc;
                document.getElementById('email_aluno').innerText = result[0].email;
                document.getElementById('turma_id').innerText = result[0].turma_id;
                document.getElementById('turma_nome').innerText = result[0].turma_nome || '';
                document.getElementById('nome_responsavel').innerText = result[0].responsavel_nome;
                document.getElementById('cpf_responsavel').innerText = result[0].responsavel_cpf;
                document.getElementById('telefone_responsavel').innerText = result[0].responsavel_tel;
                document.getElementById('nome').value = result[0].aluno_nome;
                document.getElementById('email').value = result[0].email;
                document.getElementById('responsavel').value = result[0].responsavel_nome;
            })
            .catch(error => {
                console.error("Erro ao buscar dados do aluno:", error);
            });
    }

    fetchAluno();


  });

