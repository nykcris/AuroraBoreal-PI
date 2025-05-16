

class gerenciarAlunos {

    validarAlunoButton;
    editAlunoButton;
    deleteAlunoButton;

    constructor() {
        this.validarAlunoButton = document.getElementById("validar-aluno-button");
        this.editAlunoButton = document.querySelectorAll(".button-edit-aluno");
        this.deleteAlunoButton = document.querySelectorAll(".button-delete-aluno");
    }

    init() {
        this.validarAlunoButton.addEventListener("click", this.validateAlunoForm.bind(this));
        this.editAlunoButton.forEach((button) => {
            button.addEventListener("click", this.editAluno.bind(this));
        });
        this.deleteAlunoButton.forEach((button) => {
            button.addEventListener("click", this.deleteAluno.bind(this));
        });
    }

    validateAlunoForm() {
        const aluno = document.getElementById("nome-aluno").value.trim();
        const cpfAluno = document.getElementById("cpf-aluno").value.trim();
        const serie = document.getElementById("turma-select").value.trim();
        const email = document.getElementById("email-aluno").value.trim();
        const senha = document.getElementById("senha-academica").value.trim();
        const dataNasc = document.getElementById("data_aniversario").value.trim();
        const responsavel = document.getElementById("nome-responsavel").value.trim();
        const cpfResponsavel = document.getElementById("cpf-responsavel").value.trim();
        const telefone = document.getElementById("numero-celular").value.trim();

        let isValid = true;

        isValid = isValid && aluno !== "";
        isValid = isValid && isValidCPF(cpfAluno);
        isValid = isValid && serie !== "";
        isValid = isValid && email !== "";
        isValid = isValid && senha !== "";
        isValid = isValid && validateDateOfBirth();
        isValid = isValid && responsavel !== "";
        isValid = isValid && isValidCPF(cpfResponsavel);
        isValid = isValid && telefone !== "";

        document.getElementById("nome-aluno-error").style.display = aluno ? "none" : "inline";
        document.getElementById("cpf-aluno-error").style.display = isValidCPF(cpfAluno) ? "none" : "inline";
        document.getElementById("turma-select-error").style.display = serie ? "none" : "inline";
        document.getElementById("email-aluno-error").style.display = email ? "none" : "inline";
        document.getElementById("senha-error").style.display = senha ? "none" : "inline";
        document.getElementById("data-aniversario-error").style.display = validateDateOfBirth() ? "none" : "inline";
        document.getElementById("nome-responsavel-error").style.display = responsavel ? "none" : "inline";
        document.getElementById("cpf-responsavel-error").style.display = isValidCPF(cpfResponsavel) ? "none" : "inline";
        document.getElementById("celular-error").style.display = telefone ? "none" : "inline";

        if (!isValid) {
            document.getElementById("matricula-erro").style.display = "block";
            document.getElementById("matricula-sucesso").style.display = "none";
            return;
        }

        const dados = {
            aluno_nome: aluno,
            aluno_cpf: cpfAluno,
            turma_id: serie,
            email: email,
            senha: senha,
            aluno_nasc: dataNasc,
            responsavel_nome: responsavel,
            responsavel_cpf: cpfResponsavel,
            responsavel_tel: telefone
        };

        fetch("/system/aluno/cadastrar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(dados),
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sucesso) {
                    document.getElementById("matricula-sucesso").style.display = "block";
                    document.getElementById("matricula-erro").style.display = "none";
                } else {
                    document.getElementById("matricula-erro").innerText = result.mensagem || "Erro no cadastro";
                    document.getElementById("matricula-erro").style.display = "block";
                    document.getElementById("matricula-sucesso").style.display = "none";
                }
            })
            .catch((err) => {
                console.error(err);
                document.getElementById("matricula-erro").innerText = "Erro na requisição";
                document.getElementById("matricula-erro").style.display = "block";
            });
        window.location.reload();
    }

    editAluno() {
        window.location.href = `/system/alunos/editar?id=${this.value}`;
    }

    deleteAluno() {
        fetch(`/system/alunos/delete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ id: this.value }),
        })
            .then((response) => response.json())
            .then((data) => {
                alert(data.mensagem);
                location.reload();
            })
            .catch((err) => {
                console.error(err);
                alert("Erro ao deletar aluno");
            });
    }
}



export default gerenciarAlunos;