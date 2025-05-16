class gerenciarSeries {

    validarSerieButton;
    editSerieButton;
    deleteSerieButton;

    constructor() {
        this.validarSerieButton = document.getElementById("validar-serie-button");
        this.editSerieButton = document.querySelectorAll(".button-edit-serie");
        this.deleteSerieButton = document.querySelectorAll(".button-delete-serie");
    }

    init() {
        this.validarSerieButton.addEventListener("click", this.validateSerieForm.bind(this));
        this.editSerieButton.forEach((button) => {
            button.addEventListener("click", this.editSerie.bind(this));
        });
        this.deleteSerieButton.forEach((button) => {
            button.addEventListener("click", this.deleteSerie.bind(this));
        });
    }

    validateSerieForm() {
        const serie = document.getElementById("nome-serie").value.trim();
        const ano = document.getElementById("ano").value.trim();

        let isValid = true;

        isValid = isValid && serie !== "";
        isValid = isValid && ano !== "";

        document.getElementById("nameError").style.display = serie ? "none" : "inline";
        document.getElementById("anoError").style.display = ano ? "none" : "inline";

        if (!isValid) {
            document.getElementById("serie-erro").style.display = "block";
            document.getElementById("serie-sucesso").style.display = "none";
            return;
        }

        const dados = {
            serie_nome: serie,
            serie_ano: ano,
        };

        fetch("/system/serie/cadastrarSerie", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(dados),
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sucesso) {
                    document.getElementById("serie-sucesso").style.display = "block";
                    document.getElementById("serie-erro").style.display = "none";
                } else {
                    document.getElementById("serie-erro").innerText = result.mensagem || "Erro no cadastro";
                    document.getElementById("serie-erro").style.display = "block";
                    document.getElementById("serie-sucesso").style.display = "none";
                }
            })
            .catch((err) => {
                console.error(err);
                document.getElementById("serie-erro").innerText = "Erro na requisição";
                document.getElementById("serie-erro").style.display = "block";
            });
        window.location.reload();
    }

    editSerie() {
        window.location.href = `/system/serie/editar?id=${this.value}`;
    }

    deleteSerie() {
        fetch(`/system/serie/delete`, {
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
                alert("Erro ao deletar serie");
            });
    }
}





export default gerenciarSeries;