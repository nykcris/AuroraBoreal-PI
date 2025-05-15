class fetchProdutos {

    constructor() {
        this.produtoSelect = document.querySelectorAll(".produto-select");
    }

    init() {
        this.fetchProdutos();
        this.SelectProdutosfetch();
    }

    fetchProdutos() {
        fetch('/system/produtos/fetchProdutos', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                this.produtoSelect.forEach(select => {
                    select.innerHTML = '';
                    result.forEach(produto => {
                        let option = document.createElement('option');
                        option.value = produto.id;
                        option.text = produto.nome;
                        select.appendChild(option);
                    });
                });
            })
            .catch(err => {
                console.error(err);
            });
    }

    SelectProdutosfetch(number) {
        fetch('/system/produtos/fetchProdutos', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                let sel = ".produto-select";
                if (number != null) {
                    sel += "-" + number;
                }
                let produtoSelect = document.querySelectorAll(sel);
                produtoSelect.forEach(select => {
                    select.innerHTML = '';
                    result.forEach(produto => {
                        let option = document.createElement('option');
                        option.value = produto.id;
                        option.text = produto.nome;
                        select.appendChild(option);
                    });
                });
            })
            .catch(err => {
                console.error(err);
            });
    }
}

