document.addEventListener("DOMContentLoaded", function () {

    var numberAddMateria = 0;

    const professorAssociarButton = document.getElementById('professorAssociarButton'); if(professorAssociarButton) professorAssociarButton.addEventListener('click', cadastrarProfessorTurmaDisciplina); else console.log('professorAssociarButton not found');
    const addDisciplinaButton = document.getElementById('addDisciplina'); if(addDisciplinaButton) addDisciplinaButton.addEventListener('click', addDisciplina); else console.log('addDisciplinaButton not found');
    const validadeprofessorButton = document.getElementById('validar-professor-button'); if(validadeprofessorButton) validadeprofessorButton.addEventListener('click', validateProfessorForm); else console.log('validadeprofessorButton not found');
    const validateAlunoFormButton = document.getElementById('validar-aluno-button'); if(validateAlunoFormButton) validateAlunoFormButton.addEventListener('click', validateAlunoForm); else console.log('validateAlunoFormButton not found');
    const validateDisciplinaFormButton = document.getElementById('validar-disciplina-button'); if(validateDisciplinaFormButton) validateDisciplinaFormButton.addEventListener('click', validateDisciplinaForm); else console.log('validateDisciplinaFormButton not found');
    const validateTurmaFormButton = document.getElementById('validar-turma-button'); if(validateTurmaFormButton) validateTurmaFormButton.addEventListener('click', validateTurmaForm); else console.log('validateTurmaFormButton not found');
    const validateSerieFormButton = document.getElementById('validar-serie-button'); if(validateSerieFormButton) validateSerieFormButton.addEventListener('click', validateSerieForm); else console.log('validateSerieFormButton not found');
    const validateProdutoFormButton = document.getElementById('validar-produto-button'); if(validateProdutoFormButton) validateProdutoFormButton.addEventListener('click', validateProdutoForm); else console.log('validateProdutoFormButton not found');

    

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

    function validateAlunoForm() {

        const aluno = document.getElementById('nome-aluno').value.trim();
        const responsavel = document.getElementById('nome-responsavel').value.trim();
        const cpfAluno = document.getElementById('cpf-aluno').value.trim();
        const cpfResponsavel = document.getElementById('cpf-responsavel').value.trim();
        const dataNasc = document.getElementById('data_aniversario').value.trim();
        const email = document.getElementById('email-aluno').value.trim();
        const telefone = document.getElementById('numero-celular').value.trim();
        const senha = document.getElementById('senha-academica').value.trim();
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

    function editAluno(){
        console.log(this.value);
        window.location.href = `/system/alunos/editar?id=${this.value}`;
    }

    function deleteAluno(){
        console.log(this.value);
        fetch(`/system/alunos/delete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({id: this.value})
        })
            .then(response => response.json())
            .then(data => {
                alert(data);
                location.reload();
            })
            .catch(err => {
                console.error(err);
            });

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

    function myMenuFunction() {
        const menu = document.getElementById("navMenu");
        menu.className = (menu.className === "nav-menu") ? "nav-menu responsive" : "nav-menu";
    }


    function validateProfessorForm() {
        const prof = document.getElementById('nome-prof').value.trim();
        const cpfProf = document.getElementById('cpf-prof').value.trim();

        const salario = document.getElementById('salario').value.trim();
        const email = document.getElementById('email-prof').value.trim();
        const telefone = document.getElementById('prof-numero-celular').value.trim();
        const senha = document.getElementById('senha-academica').value.trim();

        let isValid = true;

        isValid = isValid && prof !== '';
        console.log(isValid);
        isValid = isValid && isValidCPF(cpfProf);
        console.log(isValid);
        isValid = isValid && salario !== '';
        console.log(isValid);
        isValid = isValid && email !== '';
        console.log(isValid);
        isValid = isValid && telefone !== '';
        console.log(telefone);
        console.log(isValid);

        document.getElementById('nome-prof-error').style.display = prof ? 'none' : 'inline';
        document.getElementById('cpf-prof-error').style.display = isValidCPF(cpfProf) ? 'none' : 'inline';
        document.getElementById('salario-error').style.display = salario ? 'none' : 'inline';
        document.getElementById('email-prof-error').style.display = email ? 'none' : 'inline';
        document.getElementById('celular-error').style.display = telefone ? 'none' : 'inline';

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
            telefone: telefone
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
    }

    function editProfessor(){
        window.location.href = `/system/professores/editar?id=${this.value}`;
    }

    function deleteProfessor(){
        fetch(`/system/professores/delete`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({id: this.value})
        })
            .then(response => response.json())
            .then(data => {
                alert(data);
                location.reload();
            })
            .catch(err => {
                console.error(err);
            });
    }


    function cadastrarProfessorTurmaDisciplina() {
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





    function TurmaSelectFetch(number) {
        fetch('/system/direcaoFetchTurma', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(result => {
                let sel = ".turma-select";
                if (number != null) {
                    sel += number;
                }
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

    function DisciplinaSelectFetch(number) {
        fetch('/system/direcaoFetchDisciplina', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(result => {
                let sel = ".disciplina-select";
                if (number != null) {
                    sel += number;
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

    function validateSerieForm() {
        const serie = document.getElementById('inputName5').value.trim();
        const ano = document.getElementById('ano').value.trim();

        let isValid = true;

        isValid = isValid && serie !== '';
        isValid = isValid && ano !== '';

        document.getElementById('nameError').style.display = serie ? 'none' : 'inline';
        document.getElementById('anoError').style.display = ano ? 'none' : 'inline';

        if (!isValid) {
            document.getElementById('serie-erro').style.display = 'block';
            document.getElementById('serie-sucesso').style.display = 'none';
            return;
        }

        const dados = {
            serie_nome: serie,
            ano: ano
        };

        fetch('/system/cadastrarSerie', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(dados)
        })
            .then(res => res.json())
            .then(result => {
                if (result.sucesso) {
                    document.getElementById('serie-sucesso').style.display = 'block';
                    document.getElementById('serie-erro').style.display = 'none';
                } else {
                    document.getElementById('serie-erro').innerText = result.mensagem || 'Erro no cadastro';
                    document.getElementById('serie-erro').style.display = 'block';
                    document.getElementById('serie-sucesso').style.display = 'none';
                }
            })
    }

    function editSerie(){
        window.location.href = `/system/serie/editar?id=${this.value}`;
    }

    function deleteSerie(){
        fetch(`/system/serie/delete`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({id: this.value})
        })
            .then(response => response.json())
            .then(data => {
                alert(data);
                location.reload();
            })
            .catch(err => {
                console.error(err);
            });
    }





    function validateTurmaForm() {
        const turma = document.getElementById('inputName5').value.trim();
        const serie = document.getElementById('Serie').value.trim();

        let isValid = true;

        isValid = isValid && turma !== '';
        isValid = isValid && serie !== '';

        document.getElementById('nameError').style.display = turma ? 'none' : 'inline';
        document.getElementById('serieError').style.display = serie ? 'none' : 'inline';

        if (!isValid) {
            document.getElementById('turma-erro').style.display = 'block';
            document.getElementById('turma-sucesso').style.display = 'none';
            return;
        }

        const dados = {
            turma_nome: turma,
            serie_id: serie
        };

        fetch('/system/cadastrarTurma', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(dados)
        })
            .then(res => res.json())
            .then(result => {
                if (result.sucesso) {
                    document.getElementById('turma-sucesso').style.display = 'block';
                    document.getElementById('turma-erro').style.display = 'none';
                } else {
                    document.getElementById('turma-erro').innerText = result.mensagem || 'Erro no cadastro';
                    document.getElementById('turma-erro').style.display = 'block';
                    document.getElementById('turma-sucesso').style.display = 'none';
                }
            })
    }

    function editTurma(){
        window.location.href = `/system/turma/editar?id=${this.value}`;
    }

    function deleteTurma(){
        fetch(`/system/turma/delete`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({id: this.value})
        })
            .then(response => response.json())
            .then(data => {
                alert(data);
                location.reload();
            })
            .catch(err => {
                console.error(err);
            });
    }

    function validateDisciplinaForm() {
        const disciplina = document.getElementById('inputName5').value.trim();

        let isValid = true;

        isValid = isValid && disciplina !== '';

        document.getElementById('nameError').style.display = disciplina ? 'none' : 'inline';

        if (!isValid) {
            document.getElementById('disciplina-erro').style.display = 'block';
            document.getElementById('disciplina-sucesso').style.display = 'none';
            return;
        }

        const dados = {
            disciplina_nome: disciplina
        };

        fetch('/system/cadastrarDisciplina', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(dados)
        })
            .then(res => res.json())
            .then(result => {
                if (result.sucesso) {
                    document.getElementById('disciplina-sucesso').style.display = 'block';
                    document.getElementById('disciplina-erro').style.display = 'none';
                } else {
                    document.getElementById('disciplina-erro').innerText = result.mensagem || 'Erro no cadastro';
                    document.getElementById('disciplina-erro').style.display = 'block';
                    document.getElementById('disciplina-sucesso').style.display = 'none';
                }
            })
    }

    function editDisciplina(){
        window.location.href = `/system/disciplina/editar?id=${this.value}`;
    }

    function deleteDisciplina(){
        fetch(`/system/disciplina/delete`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({id: this.value})
        })
            .then(response => response.json())
            .then(data => {
                alert(data);
                location.reload();
            })
            .catch(err => {
                console.error(err);
            });
    }

    function DisciplinaSelectOnTurmaID() {
        let turma_id = document.querySelector('.turma-select').value;
        fetch(`/system/direcao/FetchDisciplinaOnTurmaID/${turma_id}`,{
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(result => {
                let disciplinaSelect = document.querySelector('.disciplina-OnTurmaID-select');
                disciplinaSelect.innerHTML = '';
                result.forEach(disciplina => {
                    let option = document.createElement('option');
                    option.value = disciplina.id;
                    option.text = disciplina.nome;
                    disciplinaSelect.appendChild(option);
                });
            })
            .catch(err => {
                console.error(err);
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
                alert(data);
                location.reload();
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
        numberAddMateria++;
        let number = numberAddMateria;
        let table = document.querySelector('#professor-table');
        let tbody = table.querySelector('tbody');
        let newRow = document.createElement('tr');
        newRow.innerHTML = `
    <th scope="row"> <select class="form-select serie-select${number}" aria-label="Default select example"></select></th>    
    <th scope="row"> <select class="form-select turma-select${number}" aria-label="Default select example"></select></th>
    <th scope="row"> <select class="form-select disciplina-select${number}" aria-label="Default select example"></select></th>
    `;
        table.querySelector('tbody').appendChild(newRow);
        TurmaSelectFetch(number);
        DisciplinaSelectFetch(number);
    }


    TurmaIDSelectFetch();
    SerieSelectFetch();
    TurmaSelectFetch();
    SerieSelectFetch(numberAddMateria);
    TurmaSelectFetch(numberAddMateria);
    DisciplinaSelectFetch(numberAddMateria);
    ProdutoValorTotal();

});
