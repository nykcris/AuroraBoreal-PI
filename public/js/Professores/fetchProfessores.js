class fetchProfessores {

    constructor() {
        this.professorSelect = document.querySelectorAll(".professor-select");
    }

    init() {
        this.fetchProfessores();
        this.SelectProfessoresfetch();
    }

    fetchProfessores() {
        fetch('/system/professor/fetchProfessores', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                this.professorSelect.forEach(select => {
                    select.innerHTML = '';
                    result.forEach(professor => {
                        let option = document.createElement('option');
                        option.value = professor.id;
                        option.text = professor.nome;
                        select.appendChild(option);
                    });
                });
            })
            .catch(err => {
                console.error(err);
            });
    }

    SelectProfessoresfetch(number) {
        fetch('/system/professor/fetchProfessores', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                let sel = ".professor-select";
                if (number != null) {
                    sel += "-" + number;
                }
                let professorSelect = document.querySelectorAll(sel);
                professorSelect.forEach(select => {
                    select.innerHTML = '';
                    result.forEach(professor => {
                        let option = document.createElement('option');
                        option.value = professor.id;
                        option.text = professor.nome;
                        select.appendChild(option);
                    });
                });
            })
            .catch(err => {
                console.error(err);
            });
    }
}


