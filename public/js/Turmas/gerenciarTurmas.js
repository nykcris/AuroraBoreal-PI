class gerenciarTurmas {

    validarTurmaButton;
    editTurmaButton;
    deleteTurmaButton;

    constructor() {
        this.validarTurmaButton = document.getElementById("validar-turma-button");
        this.editTurmaButton = document.querySelectorAll(".button-edit-turma");
        this.deleteTurmaButton = document.querySelectorAll(".button-delete-turma");
    }

    init() {
        this.validarTurmaButton.addEventListener("click", this.validateTurmaForm.bind(this));
        this.editTurmaButton.forEach((button) => {
            button.addEventListener("click", this.editTurma.bind(this));
        });
        this.deleteTurmaButton.forEach((button) => {
            button.addEventListener("click", this.deleteTurma.bind(this));
        });
    }

    validateTurmaForm() {
        const turma = document.getElementById("turma-nome").value.trim();
        const serie = document.getElementById("turma-serie-select").value.trim();

        let isValid = true;

        isValid = isValid && turma !== "";
        isValid = isValid && serie !== "";

        document.getElementById("nameError").style.display = turma ? "none" : "inline";
        document.getElementById("serieError").style.display = serie ? "none" : "inline";

        if (!isValid) {
            document.getElementById("turma-erro").style.display = "block";
            document.getElementById("turma-sucesso").style.display = "none";
            return;
        }

        const dados = {
            turma_nome: turma,
            serie_id: serie,
        };

        fetch("/system/turma/cadastrarTurma", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(dados),
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sucesso) {
                    document.getElementById("turma-sucesso").style.display = "block";
                    document.getElementById("turma-erro").style.display = "none";
                } else {
					if (result.mensagem == "Turma já cadastrada.") {
						document.getElementById("turma-erro").innerText = result.mensagem || "Erro no cadastro";
						document.getElementById("turma-erro").style.display = "block";
						document.getElementById("turma-sucesso").style.display = "none";
					} else {
						document.getElementById("turma-erro").innerText = result.mensagem || "Erro no cadastro";
						document.getElementById("turma-erro").style.display = "block";
						document.getElementById("turma-sucesso").style.display = "none";
					}
                }
            })
            .catch((err) => {
                console.error(err);
                document.getElementById("turma-erro").innerText = "Erro na requisição";
                document.getElementById("turma-erro").style.display = "block";
            });
        window.location.reload();
    }

    editTurma() {
        window.location.href = `/system/turma/editar?id=${this.value}`;
    }

    deleteTurma() {
        fetch(`/system/turma/delete`, {
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
                alert("Erro ao deletar turma");
            });
    }
}







