
import { fetchProdutos } from "./Produtos/fetchProdutos.js";
import { fetchAlunos } from "./Alunos/fetchAlunos.js";
import { fetchProfessores } from "./Professores/fetchProfessores.js";
import { fetchTurmas } from "./Turmas/fetchTurmas.js";
import { fetchSeries } from "./Series/fetchSeries.js";
import { fetchDisciplinas } from "./Disciplinas/fetchDisciplinas.js";

import { gerenciarProdutos } from "./Produtos/gerenciarProdutos.js";
import { gerenciarAlunos } from "./Alunos/gerenciarAlunos.js";
import { gerenciarProfessores } from "./Professores/gerenciarProfessores.js";
import { gerenciarTurmas } from "./Turmas/gerenciarTurmas.js";
import { gerenciarSeries } from "./Series/gerenciarSeries.js";
import { gerenciarDisciplinas } from "./Disciplinas/gerenciarDisciplinas.js";


document.addEventListener("DOMContentLoaded", function () {

    var number = 0;

    const professorAssociarButton = document.getElementById('professorAssociarButton'); professorAssociarButton.addEventListener('click', cadastrarProfessorTurmaDisciplina);
    const addDisciplinaButton = document.getElementById('addDisciplina'); addDisciplinaButton.addEventListener('click', addDisciplina);
    const validadeprofessorButton = document.getElementById('validar-professor-button'); validadeprofessorButton.addEventListener('click', validateProfessorForm);
    const validateAlunoFormButton = document.getElementById('validar-aluno-button'); validateAlunoFormButton.addEventListener('click', validateAlunoForm);
    const validateTurmaFormButton = document.getElementById('adicionar-turma-button'); validateTurmaFormButton.addEventListener('click', validateTurmaForm);
    const validateSerieFormButton = document.getElementById('adicionar-serie-button'); validateSerieFormButton.addEventListener('click', validateSerieForm);
    const validateDisciplinaFormButton = document.getElementById('adicionar-disciplina-button'); validateDisciplinaFormButton.addEventListener('click', validateDisciplinaForm);
    
    

    const editAlunoButton = document.querySelectorAll('.button-edit-aluno');
    editAlunoButton.forEach(button => {
        button.addEventListener('click', editAluno);
    })

    const deleteAlunoButton = document.querySelectorAll('.button-delete-aluno');
    deleteAlunoButton.forEach(button => {
        button.addEventListener('click', deleteAluno);
    })

    const editProfessorButton = document.querySelectorAll('.button-edit-professor');
    editProfessorButton.forEach(button => {
        button.addEventListener('click', editProfessor);
    })

    const deleteProfessorButton = document.querySelectorAll('.button-delete-professor');
    deleteProfessorButton.forEach(button => {
        button.addEventListener('click', deleteProfessor);
    })

    const editTurmaButton = document.querySelectorAll('.button-edit-turma');
    editTurmaButton.forEach(button => {
        button.addEventListener('click', editTurma);
    })

    const deleteTurmaButton = document.querySelectorAll('.button-delete-turma');
    deleteTurmaButton.forEach(button => {
        button.addEventListener('click', deleteTurma);
    })

    const editSerieButton = document.querySelectorAll('.button-edit-serie');
    editSerieButton.forEach(button => {
        button.addEventListener('click', editSerie);
    })

    const deleteSerieButton = document.querySelectorAll('.button-delete-serie');
    deleteSerieButton.forEach(button => {
        button.addEventListener('click', deleteSerie);
    })

    const editDisciplinaButton = document.querySelectorAll('.button-edit-disciplina');
    editDisciplinaButton.forEach(button => {
        button.addEventListener('click', editDisciplina);
    })

    const deleteDisciplinaButton = document.querySelectorAll('.button-delete-disciplina');
    deleteDisciplinaButton.forEach(button => {
        button.addEventListener('click', deleteDisciplina);
    })

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





    





    
    

    function validateProdutoForm() {
        const nome = document.getElementById('inputName5').value.trim();
        const descricao = document.getElementById('descricao').value.trim();
        const quantidade = document.getElementById('quantidade').value.trim();
        const valor = document.getElementById('valor-gasto').value.trim();
        const tipo = document.getElementById('inputState').value.trim();

        let isValid = true;

        isValid = isValid && nome !== '';
        isValid = isValid && descricao !== '';
        isValid = isValid && quantidade !== '';
        isValid = isValid && valor !== '';
        isValid = isValid && tipo !== '';

        document.getElementById('nameError').style.display = nome ? 'none' : 'inline';
        document.getElementById('descricaoError').style.display = descricao ? 'none' : 'inline';
        document.getElementById('quantidadeError').style.display = quantidade ? 'none' : 'inline';
        document.getElementById('valorError').style.display = valor ? 'none' : 'inline';
        document.getElementById('tipoError').style.display = tipo ? 'none' : 'inline';

        if (!isValid) {
            document.getElementById('produto-erro').style.display = 'block';
            document.getElementById('produto-sucesso').style.display = 'none';
            return;
        }

        const dados = {
            nome: nome,
            descricao: descricao,
            quantidade: quantidade,
            valor: valor,
            tipo: tipo
        };

        fetch('/system/cadastrarProduto', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(dados)
        })
            .then(res => res.json())
            .then(result => {
                if (result.sucesso) {
                    document.getElementById('produto-sucesso').style.display = 'block';
                    document.getElementById('produto-erro').style.display = 'none';
                    ProdutoValorTotal();
                } else {
                    document.getElementById('produto-erro').innerText = result.mensagem || 'Erro no cadastro';
                    document.getElementById('produto-erro').style.display = 'block';
                    document.getElementById('produto-sucesso').style.display = 'none';
                }
            })
            .catch(err => {
                console.error(err);
                document.getElementById('produto-erro').innerText = 'Erro na requisição';
                document.getElementById('produto-erro').style.display = 'block';
            });
        window.location.reload();
    }

    function editProduto(){
        window.location.href = `/system/produtos/editar?id=${this.value}`;
    }

    function deleteProduto(){
        fetch(`/system/produtos/delete`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({id: this.value})
        })
            .then(response => response.json())
            .then(data => {
                alert(data.mensagem);
                location.reload();
            })
            .catch(err => {
                console.error(err);
                alert('Erro ao deletar produto');
            });
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
    SerieSelectFetch(number);
    TurmaSelectFetch(number);
    DisciplinaSelectFetch(number);
    DisciplinaSelectFetch();
    SerieSelectFetch();
    ProdutoValorTotal();

});
