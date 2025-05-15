class gerenciarProfessores {

    validarProfessorButton;
    editProfessorButton;
    deleteProfessorButton;

    constructor() {
        this.validarProfessorButton = document.getElementById("validar-professor-button");
        this.editProfessorButton = document.querySelectorAll(".button-edit-professor");
        this.deleteProfessorButton = document.querySelectorAll(".button-delete-professor");
    }

    init() {
        this.validarProfessorButton.addEventListener("click", this.validateProfessorForm.bind(this));
        this.editProfessorButton.forEach((button) => {
            button.addEventListener("click", this.editProfessor.bind(this));
        });
        this.deleteProfessorButton.forEach((button) => {
            button.addEventListener("click", this.deleteProfessor.bind(this));
        });
    }

    validateProfessorForm() {
        const prof = document.getElementById("nome-prof").value.trim();
        const cpfProf = document.getElementById("cpf-prof").value.trim();
        const salario = document.getElementById("salario-prof").value.trim();
        const email = document.getElementById("email-prof").value.trim();
        const senha = document.getElementById("senha-academica-prof").value.trim();
        const telefone = document.getElementById("telefone-prof").value.trim();

        let isValid = true;

        isValid = isValid && prof !== "";
        isValid = isValid && cpfProf !== "";
        isValid = isValid && salario !== "";
        isValid = isValid && email !== "";
        isValid = isValid && senha !== "";
        isValid = isValid && telefone !== "";

        document.getElementById("nome-prof-error").style.display = prof ? "none" : "inline";
        document.getElementById("cpf-prof-error").style.display = isValidCPF(cpfProf) ? "none" : "inline";
        document.getElementById("salario-prof-error").style.display = salario ? "none" : "inline";
        document.getElementById("email-prof-error").style.display = email ? "none" : "inline";
        document.getElementById("senha-academica-prof-error").style.display = senha ? "none" : "inline";
        document.getElementById("telefone-prof-error").style.display = telefone ? "none" : "inline";

        if (!isValid) {
            document.getElementById("registro-erro").style.display = "block";
            document.getElementById("registro-sucesso").style.display = "none";
            return;
        }

        const dados = {
            prof_nome: prof,
            prof_cpf: cpfProf,
            prof_salario: salario,
            email: email,
            senha: senha,
            telefone: telefone
        };

        fetch("/system/professor/cadastrar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(dados),
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sucesso) {
                    document.getElementById("registro-sucesso").style.display = "block";
                    document.getElementById("registro-erro").style.display = "none";
                } else {
                    document.getElementById("registro-erro").innerText = result.mensagem || "Erro no cadastro";
                    document.getElementById("registro-erro").style.display = "block";
                    document.getElementById("registro-sucesso").style.display = "none";
                }
            })
            .catch((err) => {
                console.error(err);
                document.getElementById("registro-erro").innerText = "Erro na requisição";
                document.getElementById("registro-erro").style.display = "block";
            });
        window.location.reload();
    }

    editProfessor() {
        window.location.href = `/system/professores/editar?id=${this.value}`;
    }

    deleteProfessor() {
        fetch(`/system/professores/delete`, {
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
                alert("Erro ao deletar professor");
            });
    }
}







