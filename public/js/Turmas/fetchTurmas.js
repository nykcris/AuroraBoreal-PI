class fetchTurmas {

    turmaSelect;

    constructor() {
        this.turmaSelect = document.querySelectorAll(".turma-select");
    }

    init() {
        this.fetchTurmas();
        this.SelectTurmasfetch();
        console.log("fetchTurmas");
    }

    fetchTurmas() {
        fetch('/system/turma/fetchTurmas', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                this.turmaSelect.forEach(select => {
                    select.innerHTML = '';
                    result.forEach(turma => {
                        let option = document.createElement('option');
                        option.value = turma.id;
                        option.text = turma.nome;
                        select.appendChild(option);
                    });
                });
            })
            .catch(err => {
                console.error(err);
            });
    }

    SelectTurmasfetch(number) {
        fetch('/system/turma/fetchTurmas', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                let sel = ".turma-select";
                if (number != null) {
                    sel += "-" + number;
                }
                let turmaSelect = document.querySelectorAll(sel);
                console.log("==========================");
                console.log(turmaSelect);
                console.log("==========================");
                turmaSelect.forEach(select => {
                    select.innerHTML = '';
                    result.forEach(turma => {
                        let option = document.createElement('option');
                        option.value = turma.id;
                        option.text = turma.nome;
                        select.appendChild(option);
                    });
                });
            })
            .catch(err => {
                console.error(err);
            });
    }
}
module.exports = fetchTurmas;