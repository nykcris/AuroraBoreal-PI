class gerenciarDisciplinas {

    validarDisciplinaButton;
    editDisciplinaButton;
    deleteDisciplinaButton;

    constructor() {
        this.validarDisciplinaButton = document.getElementById("validar-disciplina-button");
        this.editDisciplinaButton = document.querySelectorAll(".button-edit-disciplina");
        this.deleteDisciplinaButton = document.querySelectorAll(".button-delete-disciplina");
    }

    init() {
        this.validarDisciplinaButton.addEventListener("click", this.validateDisciplinaForm.bind(this));
        this.editDisciplinaButton.forEach((button) => {
            button.addEventListener("click", this.editDisciplina.bind(this));
        });
        this.deleteDisciplinaButton.forEach((button) => {
            button.addEventListener("click", this.deleteDisciplina.bind(this));
        });
    }

    validateDisciplinaForm() {
        const disciplina = document.getElementById("disciplina-nome").value.trim();

        let isValid = true;

        isValid = isValid && disciplina !== "";

        document.getElementById("nameError").style.display = disciplina ? "none" : "inline";

        if (!isValid) {
            document.getElementById("disciplina-erro").style.display = "block";
            document.getElementById("disciplina-sucesso").style.display = "none";
            return;
        }

        const dados = {
            disciplina_nome: disciplina,
        };

        fetch("/system/disciplina/cadastrarDisciplina", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(dados),
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sucesso) {
                    document.getElementById("disciplina-sucesso").style.display = "block";
                    document.getElementById("disciplina-erro").style.display = "none";
                } else {
                    document.getElementById("disciplina-erro").innerText = result.mensagem || "Erro no cadastro";
                    document.getElementById("disciplina-erro").style.display = "block";
                    document.getElementById("disciplina-sucesso").style.display = "none";
                }
            })
            .catch((err) => {
                console.error(err);
                document.getElementById("disciplina-erro").innerText = "Erro na requisição";
                document.getElementById("disciplina-erro").style.display = "block";
            });
        window.location.reload();
    }

    editDisciplina() {
        window.location.href = `/system/disciplina/editar?id=${this.value}`;
    }

    deleteDisciplina() {
        fetch(`/system/disciplina/delete`, {
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
                alert("Erro ao deletar disciplina");
            });
    }
}





export default gerenciarDisciplinas;