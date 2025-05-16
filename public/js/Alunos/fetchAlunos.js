class fetchAlunos {

    alunoSelect;

    constructor() {
        this.alunoSelect = document.querySelectorAll(".aluno-select");
    }

    init() {
        this.fetchAlunos();
        this.SelectAlunosfetch();
    }

    fetchAlunos() {
        fetch('/system/aluno/fetchAlunos', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                this.alunoSelect.forEach(select => {
                    select.innerHTML = '';
                    result.forEach(aluno => {
                        let option = document.createElement('option');
                        option.value = aluno.id;
                        option.text = aluno.nome;
                        select.appendChild(option);
                    });
                });
            })
            .catch(err => {
                console.error(err);
            });
    }

    SelectAlunosfetch(number) {
        fetch('/system/aluno/fetchAlunos', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                let sel = ".aluno-select";
                if (number != null) {
                    sel += "-" + number;
                }
                let alunoSelect = document.querySelectorAll(sel);
                alunoSelect.forEach(select => {
                    select.innerHTML = '';
                    result.forEach(aluno => {
                        let option = document.createElement('option');
                        option.value = aluno.id;
                        option.text = aluno.nome;
                        select.appendChild(option);
                    });
                });
            })
            .catch(err => {
                console.error(err);
            });
    }
}


module.exports = fetchAlunos;