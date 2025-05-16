class gerenciarProdutos {

    validarProdutoButton;
    editProdutoButton;
    deleteProdutoButton;

    constructor() {
        this.validarProdutoButton = document.getElementById("validar-produto-button");
        this.editProdutoButton = document.querySelectorAll(".button-edit-produto");
        this.deleteProdutoButton = document.querySelectorAll(".button-delete-produto");
    }

    init() {
        this.validarProdutoButton.addEventListener("click", this.validateProdutoForm.bind(this));
        this.editProdutoButton.forEach((button) => {
            button.addEventListener("click", this.editProduto.bind(this));
        });
        this.deleteProdutoButton.forEach((button) => {
            button.addEventListener("click", this.deleteProduto.bind(this));
        });
    }

    validateProdutoForm() {
        const nome = document.getElementById("nome-produto").value.trim();
        const descricao = document.getElementById("descricao-produto").value.trim();
        const quantidade = document.getElementById("quantidade-produto").value.trim();
        const valor = document.getElementById("valor-produto").value.trim();
        const tipo = document.getElementById("tipo-produto").value.trim();

        let isValid = true;

        isValid = isValid && nome !== "";
        isValid = isValid && descricao !== "";
        isValid = isValid && quantidade !== "";
        isValid = isValid && valor !== "";
        isValid = isValid && tipo !== "";

        document.getElementById("nameError").style.display = nome ? "none" : "inline";
        document.getElementById("descricaoError").style.display = descricao ? "none" : "inline";
        document.getElementById("quantidadeError").style.display = quantidade ? "none" : "inline";
        document.getElementById("valorError").style.display = valor ? "none" : "inline";
        document.getElementById("tipoError").style.display = tipo ? "none" : "inline";

        if (!isValid) {
            document.getElementById("produto-erro").style.display = "block";
            document.getElementById("produto-sucesso").style.display = "none";
            return;
        }

        const dados = {
            nome: nome,
            descricao: descricao,
            quantidade: quantidade,
            valor: valor,
            tipo: tipo
        };

        fetch("/system/produtos/cadastrar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(dados),
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.sucesso) {
                    document.getElementById("produto-sucesso").style.display = "block";
                    document.getElementById("produto-erro").style.display = "none";
                } else {
                    document.getElementById("produto-erro").innerText = result.mensagem || "Erro no cadastro";
                    document.getElementById("produto-erro").style.display = "block";
                    document.getElementById("produto-sucesso").style.display = "none";
                }
            })
            .catch((err) => {
                console.error(err);
                document.getElementById("produto-erro").innerText = "Erro na requisição";
                document.getElementById("produto-erro").style.display = "block";
            });
        window.location.reload();
    }

    editProduto() {
        window.location.href = `/system/produtos/editar?id=${this.value}`;
    }

    deleteProduto() {
        fetch(`/system/produtos/delete`, {
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
                alert("Erro ao deletar produto");
            });
    }
}




export default gerenciarProdutos;
