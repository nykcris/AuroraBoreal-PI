class fetchDisciplinas {

    constructor() {
        this.disciplinaSelect = document.querySelectorAll(".disciplina-select");
    }

    init() {
        this.fetchDisciplinas();
        this.SelectDisciplinasfetch();
    }

    fetchDisciplinas() {
        fetch('/system/disciplina/fetchDisciplinas', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                this.disciplinaSelect.forEach(select => {
                    select.innerHTML = '';
                    result.forEach(disciplina => {
                        let option = document.createElement('option');
                        option.value = disciplina.id;
                        option.text = disciplina.nome;
                        select.appendChild(option);
                    });
                });
            })
            .catch(err => {
                console.error(err);
            });
    }

    SelectDisciplinasfetch(number) {
        fetch('/system/disciplina/fetchDisciplinas', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                let sel = ".disciplina-select";
                if (number != null) {
                    sel += "-" + number;
                }
                let disciplinaSelect = document.querySelectorAll(sel);
                disciplinaSelect.forEach(select => {
                    select.innerHTML = '';
                    result.forEach(disciplina => {
                        let option = document.createElement('option');
                        option.value = disciplina.id;
                        option.text = disciplina.nome;
                        select.appendChild(option);
                    });
                });
            })
            .catch(err => {
                console.error(err);
            });
    }
}

