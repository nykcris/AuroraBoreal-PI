document.addEventListener('DOMContentLoaded', function() {



    function InitializeButtons() {

        const turmaSelect = document.querySelector('.turma-select #horario-turma-select');
        turmaSelect.addEventListener('change', fetchHorario);

        const saveHorarioButton = document.querySelector('#save-horario-button');
        saveHorarioButton.addEventListener('click', saveHorario);

        const disciplinaSelect = document.querySelector('.disciplina-select #horario-disciplina-select');
        disciplinaSelect.addEventListener('change', allowEdit);

    }

    function InitializeFetch() {
        fetchHorario();
        InitializeButtons();
    }

    function fetchHorario() {
        const turmaSelect = document.querySelector('.turma-select #horario-turma-select');
        fetch(`/system/direcaoFetchHorario?turma=${turmaSelect.value}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(result => {
                let tableBody = document.querySelector('#horario-cadastrados table tbody');
                let tabelaHorario = [
                    [[],[],[],[],[]],
                    [[],[],[],[],[]],
                    [[],[],[],[],[]],
                    [[],[],[],[],[]],
                    [[],[],[],[],[]],
                    [[],[],[],[],[]]
                ]

                let horas = ["7:00 - 7:50","7:50 - 8:40","8:40 - 9:30","9:30 - 10:00","10:00 - 10:50","10:50 - 11:40","11:40 - 12:25"];
                result.forEach(horario => {
                    tabelaHorario[horario.horario][horario.dia].push(horario);
                });
                tabelaHorario.forEach((horario, index) => {
                    horario.forEach((dia, index) => {
                        let row = document.createElement('tr');
                        if(index != 3){
                            row.innerHTML = `
                                <th scope="row">${horas[index]}</th>
                                <td><select class="form-select" disabled><option value="${dia[0].disciplina_id}" selected>${dia[0].disciplina_nome}</option></select></td>
                                <td><select class="form-select" disabled><option value="${dia[1].disciplina_id}" selected>${dia[1].disciplina_nome}</option></select></td>
                                <td><select class="form-select" disabled><option value="${dia[2].disciplina_id}" selected>${dia[2].disciplina_nome}</option></select></td>
                                <td><select class="form-select" disabled><option value="${dia[3].disciplina_id}" selected>${dia[3].disciplina_nome}</option></select></td>
                                <td><select class="form-select" disabled><option value="${dia[4].disciplina_id}" selected>${dia[4].disciplina_nome}</option></select></td>
                            `;
                        }else{
                            row.innerHTML = `
                                <th scope="row">${horas[index]}</th>
                                <td colspan="5" style="text-align: center;">Intervalo</td>
                            `;
                        }
                        tableBody.appendChild(row);
                    });
            })
            .then(() => {
                allowEdit();
            })
            .catch(err => {
                console.error(err);
            });
    })}

    function allowEdit() {
        let tableBody = document.querySelector('#horario-cadastrados table tbody');
        let rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
            let cells = row.querySelectorAll('td');
            cells.forEach(cell => {
                let select = cell.querySelector('select');
                if(select && select.value == this.value){
                    select.disabled = false;
                }
            });
        });
    }

    function saveHorario() {

        let horario = [];
        let turma = document.querySelector('.turma-select #horario-turma-select').value;

        let tableBody = document.querySelector('#horario-cadastrados table tbody');
        let rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
            let cells = row.querySelectorAll('td');
            cells.forEach(cell => {
                let select = cell.querySelector('select');
                if(select){
                    horario.push({
                        turma: turma,
                        disciplina: select.value,
                        horario: row.querySelector('th').innerText,
                        dia: cell.cellIndex
                    });
                }
            });
        });

        horario.forEach(horario => {
            fetch('/system/horario/cadastrarHorario', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(horario)
            })
                .then(res => res.json())
                .then(result => {
                    if (result.sucesso) {
                        alert('Horário cadastrado com sucesso!');
                    } else {
                        alert('Erro ao cadastrar horário: ' + result.mensagem);
                    }
                })
                .catch(err => {
                    console.error(err);
                });

        });
    }

    function deleteHorario() {
        fetch('/system/horario/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', 
            body: JSON.stringify({turma: this.value})
        })
            .then(res => res.json())
            .then(result => {
                if (result.sucesso) {
                    alert('Horário excluído com sucesso!');
                } else {
                    alert('Erro ao excluir horário: ' + result.mensagem);
                }
            })
            .then(() => {
                fetchHorario();
            })
            .catch(err => {
                console.error(err);
            });
    }


});
