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

        let nome_aluno = document.querySelectorAll('.nome_aluno');
        let cpf_aluno = document.querySelectorAll('.cpf_aluno');
        let data_nascimento = document.querySelectorAll('.data_nascimento');
        let email_aluno = document.querySelectorAll('.email_aluno');
        let turma_id = document.querySelectorAll('.turma_id');
        let turma_nome = document.querySelectorAll('.turma_nome');
        let nome_responsavel = document.querySelectorAll('.nome_responsavel');
        let cpf_responsavel = document.querySelectorAll('.cpf_responsavel');
        let telefone_responsavel = document.querySelectorAll('.telefone_responsavel');
        


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

                nome_aluno.forEach(element => { element.innerText = result[0].aluno_nome; element.value = result[0].aluno_nome; });
                cpf_aluno.forEach(element => { element.innerText = result[0].aluno_cpf; element.value = result[0].aluno_cpf; });
                data_nascimento.forEach(element => { element.innerText = result[0].aluno_nasc; element.value = result[0].aluno_nasc; });
                email_aluno.forEach(element => { element.innerText = result[0].email; element.value = result[0].email; });
                turma_id.forEach(element => { element.innerText = result[0].turma_id; element.value = result[0].turma_id; });
                turma_nome.forEach(element => { element.innerText = result[0].turma_nome; element.value = result[0].turma_nome; });
                nome_responsavel.forEach(element => { element.innerText = result[0].responsavel_nome; element.value = result[0].responsavel_nome; });
                cpf_responsavel.forEach(element => { element.innerText = result[0].responsavel_cpf; element.value = result[0].responsavel_cpf; });
                telefone_responsavel.forEach(element => { element.innerText = result[0].responsavel_tel; element.value = result[0].responsavel_tel; });
                
            })
            .catch(error => {
                console.error("Erro ao buscar dados do aluno:", error);
            });
    }

    fetchAluno();


  });