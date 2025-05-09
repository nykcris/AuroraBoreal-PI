document.addEventListener("DOMContentLoaded", function() {

var number = 0;

function maskCPF(cpf) {
    cpf.value = cpf.value.replace(/\D/g, '')
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

function validateAlunoForm() {
    
    const aluno = document.getElementById('nome-aluno').value.trim();
    const responsavel = document.getElementById('nome-responsavel').value.trim();
    const cpfAluno = document.getElementById('cpf-aluno').value.trim();
    const cpfResponsavel = document.getElementById('cpf-responsavel').value.trim();
    const dataNasc = document.getElementById('data_aniversario').value.trim();
    const email = document.getElementById('email-aluno').value.trim();
    const telefone = document.getElementById('numero-celular').value.trim();
    const serie = document.querySelector('input[name="serie"]:checked').value;
    const email_aca = document.querySelector('#email-academica').value.trim();
    const senha_aca = document.querySelector('#senha-academica').value.trim();


    

    let isValid = true;

    isValid = isValid && aluno !== '';
    isValid = isValid && responsavel !== '';
    isValid = isValid && isValidCPF(cpfAluno);
    isValid = isValid && isValidCPF(cpfResponsavel);
    isValid = isValid && validateDateOfBirth();
    isValid = isValid && email !== '';
    isValid = isValid && telefone !== '';

    document.getElementById('nome-aluno-error').style.display = aluno ? 'none' : 'inline';
    document.getElementById('nome-responsavel-error').style.display = responsavel ? 'none' : 'inline';
    document.getElementById('cpf-aluno-error').style.display = isValidCPF(cpfAluno) ? 'none' : 'inline';
    document.getElementById('cpf-responsavel-error').style.display = isValidCPF(cpfResponsavel) ? 'none' : 'inline';
    document.getElementById('data-aniversario-error').style.display = validateDateOfBirth() ? 'none' : 'inline';
    document.getElementById('email-aluno-error').style.display = email ? 'none' : 'inline';
    document.getElementById('celular-error').style.display = telefone ? 'none' : 'inline';

    if (!isValid) {
    document.getElementById('matricula-erro').style.display = 'block';
    document.getElementById('matricula-sucesso').style.display = 'none';
    return;
    }

    const dados = {
    aluno_nome: aluno,
    aluno_cpf: cpfAluno,
    turma_id: serie,
    email: email_aca,
    senha: senha_aca,
    aluno_nasc: dataNasc,
    responsavel_nome: responsavel,
    responsavel_cpf: cpfResponsavel,
    responsavel_tel: telefone
    };

    fetch('/system/cadastrarAluno', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(dados)
    })
    .then(res => res.json())
    .then(result => {
    if (result.sucesso) {
        document.getElementById('matricula-sucesso').style.display = 'block';
        document.getElementById('matricula-erro').style.display = 'none';
    } else {
        document.getElementById('matricula-erro').innerText = result.mensagem || 'Erro no cadastro';
        document.getElementById('matricula-erro').style.display = 'block';
        document.getElementById('matricula-sucesso').style.display = 'none';
    }
    })
    .catch(err => {
    console.error(err);
    document.getElementById('matricula-erro').innerText = 'Erro na requisição';
    document.getElementById('matricula-erro').style.display = 'block';
    });
}



const addDisciplinaButton = document.getElementById('addDisciplina');
addDisciplinaButton.addEventListener('click', addDisciplina);




function validateForm() {
    const prof = document.getElementById('nome-prof').value.trim();
    const cpfProf = document.getElementById('cpf-prof').value.trim();
    
    const salario = document.getElementById('salario').value.trim();
    const email = document.getElementById('email-prof').value.trim();
    const telefone = document.getElementById('numero-celular').value.trim();
    const senha = document.getElementById('senha-academica').value.trim();
    const disciplinas = document.querySelector('input[name="disciplinas"]:checked').value;

    let isValid = true;

    isValid = isValid && prof !== '';
    isValid = isValid && isValidCPF(cpfProf);
    isValid = isValid && salario !== '';
    isValid = isValid && email !== '';
    isValid = isValid && telefone !== '';
    isValid = isValid && validatePassword(senha);

    document.getElementById('nome-prof-error').style.display = prof ? 'none' : 'inline';
    document.getElementById('cpf-prof-error').style.display = isValidCPF(cpfProf) ? 'none' : 'inline';
    document.getElementById('salario-error').style.display = salario ? 'none' : 'inline';
    document.getElementById('email-prof-error').style.display = email ? 'none' : 'inline';
    document.getElementById('disciplinas-error').style.display = disciplinas ? 'none' : 'inline';
    document.getElementById('celular-error').style.display = telefone ? 'none' : 'inline';
    document.getElementById('senha-error').style.display = validatePassword(senha) ? 'none' : 'inline';

    if (!isValid) {
    document.getElementById('registro-erro').style.display = 'block';
    document.getElementById('registro-sucesso').style.display = 'none';
    return;
    }

    const dados = {
    prof_nome: prof,
    prof_cpf: cpfProf,
    prof_salario: salario,
    email: email,
    senha: senha,
    telefone: telefone,
    disciplinas: disciplinas
    };

    fetch('/system/cadastrarProfessor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(dados)
    })
    .then(res => res.json())
    .then(result => {
    if (result.sucesso) {
        document.getElementById('registro-sucesso').style.display = 'block';
        document.getElementById('registro-erro').style.display = 'none';
    } else {
        document.getElementById('registro-erro').innerText = result.mensagem || 'Erro no cadastro';
        document.getElementById('registro-erro').style.display = 'block';
        document.getElementById('registro-sucesso').style.display = 'none';
    }
    })
    .catch(err => {
    console.error(err);
    document.getElementById('registro-erro').innerText = 'Erro na requisição';
    document.getElementById('registro-erro').style.display = 'block';
    });
}

function cadastrarProfessorTurmaDisciplina() {
    for (let i = 0; i < number; i++) {
    let dis = ".disciplina-select"+i;
    let tur = ".turma-select"+i;
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
        body: JSON.stringify(dados)
    })
    
    }


}



function TurmaIdSelectFetch(number){
    fetch('/system/direcaoFetchTurma', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
    })
    .then(res => res.json())
    .then(result => {
    console.log(result);
    let sel = "#turma-select";
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

function TurmaSelectFetch(number){
    fetch('/system/direcaoFetchTurma', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
    })
    .then(res => res.json())
    .then(result => {
    console.log(result);
    let sel = "#turma-select";
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

function DisciplinaSelectFetch(number){
    fetch('/system/direcaoFetchDisciplina', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
    })
    .then(res => res.json())
    .then(result => {
    console.log(result);
    let sel = ".disciplina-select"+number;
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

function addDisciplina() {
    number++;
    let table = document.querySelector('#professor-table');
    let tbody = table.querySelector('tbody');
    console.log(tbody);
    let newRow = document.createElement('tr');
    newRow.innerHTML = `
    <th scope="row"> <select class="form-select turma-select${number}" aria-label="Default select example"></select></th>
    <th scope="row"> <select class="form-select disciplina-select${number}" aria-label="Default select example"></select></th>
    `;
    table.querySelector('tbody').appendChild(newRow);
    TurmaSelectFetch(number);
    DisciplinaSelectFetch(number);
}

TurmaIdSelectFetch();
TurmaSelectFetch(number);
DisciplinaSelectFetch(number);

});
