
require('./Alunos/fetchAlunos.js');
require('./Professores/fetchProfessores.js');
require('./Turmas/fetchTurmas.js');
require('./Series/fetchSeries.js');
require('./Produtos/fetchProdutos.js');
require('./Disciplinas/fetchDisciplinas.js');

require('./Alunos/gerenciarAlunos.js');
require('./Professores/gerenciarProfessores.js');
require('./Turmas/gerenciarTurmas.js');
require('./Series/gerenciarSeries.js');
require('./Produtos/gerenciarProdutos.js');
require('./Disciplinas/gerenciarDisciplinas.js');



document.addEventListener("DOMContentLoaded", function () {

    
    
    

    var number = 0;

    const maskCPFInputs = document.querySelectorAll('.mask-cpf');
    maskCPFInputs.forEach(input => {
        input.addEventListener('input', maskCPF);
    })



    function maskCPF() {
        this.value = this.value.replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

    function isValidCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
        let sum = 0, remainder;
        for (let i = 1; i <= 9; i++) sum += parseInt(cpf[i - 1]) * (11 - i);
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf[9])) return false;
        sum = 0;
        for (let i = 1; i <= 10; i++) sum += parseInt(cpf[i - 1]) * (12 - i);
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        return remainder === parseInt(cpf[10]);
    }

    function validatePassword(pwd) {
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(pwd);
    }

    function validateDateOfBirth() {
        const input = document.getElementById('data_aniversario');
        const date = new Date(input.value);
        const minDate = new Date('2000-01-01');
        const now = new Date();
        return date >= minDate && date <= now;
    }

    

    function TurmaIDSelectFetch() {
        fetch('/system/direcaoFetchTurma', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                let sel = ".turma-select";
                let turmaSelect = document.querySelectorAll(sel);
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

    function myMenuFunction() {
        const menu = document.getElementById("navMenu");
        menu.className = (menu.className === "nav-menu") ? "nav-menu responsive" : "nav-menu";
    }


    function cadastrarProfessorTurmaDisciplina(number) {
        let prof = document.getElementById('professor-select').value;
        for (let i = 0; i < number; i++) {
            let dis = ".disciplina-select" + i;
            let tur = ".turma-select" + i;
            let disciplina = document.querySelector(dis);
            let turma = document.querySelector(tur);

            let dadosDT = {
                professor: prof,
                disciplina: disciplina.value,
                turma: turma.value
            }


            fetch('/system/cadastrarProfessorTurmaDisciplina', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(dadosDT)
            })

        }


    }


    function fetchDisciplinasProfessor() {
        let professor = document.getElementById('professor-select').value;
        fetch('/system/fetchDisciplinasProfessor', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ professor: professor })
        })
            .then(res => res.json())
            .then(result => {
                document.querySelector('#professor-table tbody').innerHTML = '';
                result.forEach(disciplina => {
                    var disciplinaTr = document.createElement('tr');
                    disciplinaTr.innerHTML = `
                        <th scope="row"> <select class="form-select turma-select" aria-label="Default select example" disabled>
                        <option value="${disciplina.turmaId}">${disciplina.turmaNome}</option>
                        </select></th>
                        <th scope="row"> <select class="form-select disciplina-select" aria-label="Default select example" disabled>
                        <option value="${disciplina.disciplinaId}">${disciplina.disciplinaNome}</option>
                        </select></th>
                        `;
                    document.querySelector('#professor-table tbody').appendChild(disciplinaTr);


                });
            })
            .catch(err => {
                console.error(err);
            });
    }

    function SerieSelectFetch(number) {
        fetch('/system/direcaofetchSerie', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(result => {
                let sel = ".serie-select";
                if (number != null) {
                    sel += number;
                }
                let serieSelect = document.querySelectorAll(sel);
                serieSelect.forEach(select => {
                    select.innerHTML = '';
                    result.forEach(serie => {
                        let option = document.createElement('option');
                        option.value = serie.id;
                        option.text = serie.nome;
                        select.appendChild(option);
                    });
                });
            })
            .catch(err => {
                console.error(err);
            });
    }


    function ProdutoValorTotal() {
        let total = 0;
        let produtos = document.querySelectorAll('#tabelaProdutos tr');
        produtos.forEach(produto => {
            let valor = parseFloat(produto.querySelector('td:nth-child(5)').innerText);
            total += valor;
        });
        document.getElementById('totalGasto').innerText = total.toFixed(2);
    }

    function addDisciplina() {
        number++;
        let table = document.querySelector('#professor-table');
        let tbody = table.querySelector('tbody');
        console.log(tbody);
        let newRow = document.createElement('tr');
        newRow.innerHTML = `
    <th scope="row"> <select class="form-select serie-select${number}" aria-label="Default select example"></select></th>
    <th scope="row"> <select class="form-select turma-select${number}" aria-label="Default select example"></select></th>
    <th scope="row"> <select class="form-select disciplina-select${number}" aria-label="Default select example"></select></th>
    `;
        table.querySelector('tbody').appendChild(newRow);
        SerieSelectFetch(number);
        TurmaSelectFetch(number);
        DisciplinaSelectFetch(number);
    }


    TurmaIDSelectFetch();
    ProdutoValorTotal();

    let fAlunos = new fetchAlunos();
    let fProfessores = new fetchProfessores();
    let fTurmas = new fetchTurmas();
    let fSeries = new fetchSeries();
    let fProdutos = new fetchProdutos();
    let fDisciplinas = new fetchDisciplinas();

    let gAlunos = new gerenciarAlunos();
    let gProfessores = new gerenciarProfessores();
    let gTurmas = new gerenciarTurmas();
    let gSeries = new gerenciarSeries();
    let gDisciplinas = new gerenciarDisciplinas();
    let gProdutos = new gerenciarProdutos();

    fAlunos.init();
    fProfessores.init();
    fTurmas.init();
    fSeries.init();
    fProdutos.init();
    
    gAlunos.init();
    gProfessores.init();
    gTurmas.init();
    gSeries.init();
    gDisciplinas.init();
    gProdutos.init();

    fSeries.SelectSeriesfetch();
    fTurmas.SelectTurmasfetch();
    fDisciplinas.SelectDisciplinasfetch();
    fProfessores.SelectProfessoresfetch();

});
