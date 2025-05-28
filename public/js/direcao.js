document.addEventListener("DOMContentLoaded", function () {

    var numberAddMateria = 0;

    const addDisciplinaButton = document.getElementById('addDisciplina'); if(addDisciplinaButton) addDisciplinaButton.addEventListener('click', addDisciplina); else console.log('addDisciplinaButton not found');
    const validadeprofessorButton = document.getElementById('validar-professor-button'); if(validadeprofessorButton) validadeprofessorButton.addEventListener('click', validateProfessorForm); else console.log('validadeprofessorButton not found');
    const validateAlunoFormButton = document.getElementById('validar-aluno-button'); if(validateAlunoFormButton) validateAlunoFormButton.addEventListener('click', validateAlunoForm); else console.log('validateAlunoFormButton not found');
    const validateDisciplinaFormButton = document.getElementById('validar-disciplina-button'); if(validateDisciplinaFormButton) validateDisciplinaFormButton.addEventListener('click', validateDisciplinaForm); else console.log('validateDisciplinaFormButton not found');
    const validateTurmaFormButton = document.getElementById('validar-turma-button'); if(validateTurmaFormButton) validateTurmaFormButton.addEventListener('click', validateTurmaForm); else console.log('validateTurmaFormButton not found');
    const validateSerieFormButton = document.getElementById('validar-serie-button'); if(validateSerieFormButton) validateSerieFormButton.addEventListener('click', validateSerieForm); else console.log('validateSerieFormButton not found');
    const validateProdutoFormButton = document.getElementById('validar-produto-button'); if(validateProdutoFormButton) validateProdutoFormButton.addEventListener('click', validateProdutoForm); else console.log('validateProdutoFormButton not found');
    const validadeProfessorTurmaDisciplinaButton = document.getElementById('validar-professor-turma-disciplina-button'); if(validadeProfessorTurmaDisciplinaButton) validadeProfessorTurmaDisciplinaButton.addEventListener('click', validateProfessorTurmaDisciplinaForm); else console.log('validadeProfessorTurmaDisciplinaButton not found');
    const professorSelect = document.getElementById('professor-select'); if(professorSelect) professorSelect.addEventListener('change', fetchDisciplinasProfessor); else console.log('professorSelect not found');
    const validateTurmaSalaButton = document.getElementById('validar-turma-sala-button'); if(validateTurmaSalaButton) validateTurmaSalaButton.addEventListener('click', validateTurmaSalaForm); else console.log('validateTurmaSalaButton not found');
    const validateSalaFormButton = document.getElementById('validar-sala-button'); if(validateSalaFormButton) validateSalaFormButton.addEventListener('click', validateSalaForm); else console.log('validateSalaFormButton not found');

    
    function InitializeButtons1() {

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

        const editDisciplinaButton = document.querySelectorAll('.button-edit-disciplina');
        editDisciplinaButton.forEach(button => {
            button.addEventListener('click', editDisciplina);
        })

        const deleteDisciplinaButton = document.querySelectorAll('.button-delete-disciplina');
        deleteDisciplinaButton.forEach(button => {
            button.addEventListener('click', deleteDisciplina);
        })

        const editSalaButton = document.querySelectorAll('.button-edit-sala');
        editSalaButton.forEach(button => {
            button.addEventListener('click', editSala);
        })

        const deleteSalaButton = document.querySelectorAll('.button-delete-sala');
        deleteSalaButton.forEach(button => {
            button.addEventListener('click', deleteSala);
        })

        const deleteTurmaSalaButton = document.querySelectorAll('.button-delete-turma-sala');
        deleteTurmaSalaButton.forEach(button => {
            button.addEventListener('click', deleteTurmaSala);
        })

        const editProdutoButton = document.querySelectorAll('.button-edit-produto');
        editProdutoButton.forEach(button => {
            button.addEventListener('click', editProduto);
        })

        const deleteProdutoButton = document.querySelectorAll('.button-delete-produto');
        deleteProdutoButton.forEach(button => {
            button.addEventListener('click', deleteProduto);
        })

        const maskCPFInputs = document.querySelectorAll('.mask-cpf');
        maskCPFInputs.forEach(input => {
            input.addEventListener('input', maskCPF);
        })

        const serieSelect = document.querySelectorAll('.serie-select');
        serieSelect.forEach(select => {
            select.addEventListener('change', function() {
                TurmaSelectFetch(null, this.value);
            });
        })

        const turmaSelect = document.querySelectorAll('.turma-select');
        turmaSelect.forEach(select => {
            select.addEventListener('change', function() {
                DisciplinaSelectOnTurmaID();
            });
        })

        const quantidadeInput = document.querySelectorAll('.quantidade');
        quantidadeInput.forEach(input => {
            input.addEventListener('input', validateQuantidade);
        })

        const valorInput = document.querySelectorAll('.valor');
        valorInput.forEach(input => {
            input.addEventListener('input', validateValorGasto);
        })

        const deleteProfessorTurmaDisciplinaButton = document.querySelectorAll('.button-delete-disciplina-professor');
        deleteProfessorTurmaDisciplinaButton.forEach(button => {
            button.addEventListener('click', deleteProfessorTurmaDisciplina);
        })

    }

    function InitializeFetch() {
        fetchAlunos();
        fetchProfessores();
        fetchSalas();
        fetchTurmaSala();
        fetchProdutos();
        fetchDisciplinas();
        fetchSerie();
        fetchTurmas();
        fetchDisciplinasProfessor();
    }

    //-------- Validações --------

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

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validateValorGasto() {

        isNaN(this.value) ? this.value = 0 : '';
        console.log(this.value);

        if (this.value < 0) {
            document.getElementById('valorError').style.display = 'inline';
            this.value = 0;
        } else {
            document.getElementById('valorError').style.display = 'none';
        }

        if (this.value > 9999.99) {
            document.getElementById('valorError').style.display = 'inline';
            this.value = 9999.99;
        } else {
            document.getElementById('valorError').style.display = 'none';
        }
    }

    function validateQuantidade() {
        isNaN(this.value) ? this.value = 0 : '';
        console.log(this.value);

        if (this.value < 0) {
            document.getElementById('quantidadeError').style.display = 'inline';
            this.value = 0;
        } else {
            document.getElementById('quantidadeError').style.display = 'none';
        }

        if (this.value > 999) {
            document.getElementById('quantidadeError').style.display = 'inline';
            this.value = 999;
        } else {
            document.getElementById('quantidadeError').style.display = 'none';
        }
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

    //-------- Validações de Formulários --------

    //-------- Aluno --------

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
                location.reload();
            })
            .then(() => {
                fetchAlunos();
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
                alert(data.mensagem);
            })
            .then(() => {
                fetchAlunos();
            })
            .catch(err => {
                console.error(err);
            });

    }

    

    function myMenuFunction() {
        const menu = document.getElementById("navMenu");
        menu.className = (menu.className === "nav-menu") ? "nav-menu responsive" : "nav-menu";
    }

    //-------- Professor --------

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

        fetch('/system/professores/cadastrarProfessor', {
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
                location.reload();
            })
            .then(() => {
                fetchProfessor();
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
                alert(data.mensagem);
                location.reload();
            })
            .then(() => {
                fetchProfessor();
            })
            .catch(err => {
                console.error(err);
            });
    }

    //-------- Turma Sala --------

    function validateTurmaSalaForm() {
        const id = document.getElementById('sala-select').value;
        const turma = document.getElementById('turma-sala-select').value;
        const sala = document.getElementById('sala-select').value;
    
        if (!turma || !sala) {
            alert('Por favor, selecione uma turma e uma sala.');
            return;
        }
    
        const dados = {
            id: id,
            turma: turma,
            sala: sala
        };
    
        fetch('/system/cadastrarTurmaSala', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(dados)
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                if (result.sucesso) {
                    alert('Associação realizada com sucesso!');
                    window.location.reload();
                } else {
                    alert('Erro na associação: ' + result.mensagem);
                }
            })
            .then(() => {
                fetchTurmaSala();
            })
            .catch(err => {
                alert('Erro na requisição: ' + err);
                console.error('Erro na requisição:', err);
            });
    }

    function deleteTurmaSala() {
        fetch(`/system/turmaSala/delete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({id: this.value})
        })
            .then(response => response.json())
            .then(data => {
                alert(data.mensagem);
            })
            .then(() => {
                fetchTurmaSala();
            })
            .catch(err => {
                console.error(err);
            });
    }



    //-------- Serie --------


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

        fetch('/system/serie/cadastrarSerie', {
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
                location.reload();
            })
            .then(() => {
                fetchSerie();
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
                alert(data.mensagem);
            })
            .then(() => {
                fetchSerie();
            })
            .catch(err => {
                console.error(err);
            });
    }


    //-------- Turma --------


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

        fetch('/system/turma/cadastrarTurma', {
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
            .then(() => {
                fetchTurmas();
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
                alert(data.mensagem);
            })
            .then(() => {
                fetchTurmas();
            })
            .catch(err => {
                console.error(err);
            });
    }

    //-------- Sala --------

    function validateSalaForm() {
        const sala = document.getElementById('nome-sala').value.trim();

        let isValid = true;

        isValid = isValid && sala !== '';

        document.getElementById('nameError').style.display = sala ? 'none' : 'inline';

        if (!isValid) {
            document.getElementById('sala-erro').style.display = 'block';
            document.getElementById('sala-sucesso').style.display = 'none';
            return;
        }

        const dados = {
            sala_nome: sala
        };

        fetch('/system/sala/cadastrarSala', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(dados)
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                if (result.sucesso) {
                    document.getElementById('sala-sucesso').style.display = 'block';
                    document.getElementById('sala-erro').style.display = 'none';
                } else {
                    document.getElementById('sala-erro').innerText = result.mensagem || 'Erro no cadastro';
                    document.getElementById('sala-erro').style.display = 'block';
                    document.getElementById('sala-sucesso').style.display = 'none';
                }
            })
            .then(() => {
                fetchSalas();
            })
    }

    function editSala(){
        window.location.href = `/system/sala/editar?id=${this.value}`;
    }

    function deleteSala(){
        fetch(`/system/sala/delete`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({id: this.value})
        })
            .then(response => response.json())
            .then(data => {
                alert(data.mensagem);
            })
            .then(() => {
                fetchSalas();
            })
            .catch(err => {
                console.error(err);
            });
    }


    //-------- Disciplina --------


    function validateDisciplinaForm() {
        const disciplina = document.getElementById('disciplina-nome').value.trim();

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

        fetch('/system/disciplina/cadastrarDisciplina', {
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
            .then(() => {
                fetchDisciplinas();
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
                alert(data.mensagem);
            })
            .then(() => {
                fetchDisciplinas();
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

    //-------- Produto --------

    function validateProdutoForm() {
        const nome = document.getElementById('nome-produto').value.trim();
        const descricao = document.getElementById('descricao-produto').value.trim();
        const quantidade = document.getElementById('quantidade-produto').value.trim();
        const valor = document.getElementById('valor-gasto-produto').value.trim();
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

        console.log(dados);

        fetch('/system/produto/cadastrarProduto', {
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
                } else {
                    document.getElementById('produto-erro').innerText = result.mensagem || 'Erro no cadastro';
                    document.getElementById('produto-erro').style.display = 'block';
                    document.getElementById('produto-sucesso').style.display = 'none';
                }
            })
            .then(() => {
                fetchProdutos();
            })
            .catch(err => {
                console.error(err);
            });
    }

    function editProduto(){
        window.location.href = `/system/produto/editar?id=${this.value}`;
    }

    function deleteProduto(){
        fetch(`/system/produto/delete`,{
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
            .then(() => {
                fetchProdutos();
            })
            .catch(err => {
                console.error(err);
            });
    }

    function fetchProdutos() {
        fetch('/system/produto/fetchProdutos', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(result => {
                let table = document.querySelector('#tabelaProdutos');
                table.innerHTML = '';
                result.forEach(produto => {
                    let row = document.createElement('tr');
                    row.innerHTML = `
                        <th scope="row">${produto.id}</th>
                        <td>${produto.nome_produto}</td>
                        <td>${produto.quantidade}</td>
                        <td>${produto.tipo_produto}</td>
                        <td>${produto.valor}</td>
                        <td>${produto.data_registro}</td>
                        <td>
                            <button type="button" class="btn btn-warning btn-sm button-edit-produto" value="${produto.id}">Editar</button>
                            <button type="button" class="btn btn-danger btn-sm button-delete-produto" value="${produto.id}">Excluir</button>
                        </td>
                    `;
                    table.appendChild(row);
                });
            })
            .then(() => {
                ProdutoValorTotal();
                InitializeButtons1();
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


    //------- Outras Funções -------

    function validateProfessorTurmaDisciplinaForm() {
        console.log("Associando professor a disciplinas...");
        
        // Get professor from select dropdown
        let prof = document.getElementById('professor-select').value;
        
        if (!prof) {
            alert('Por favor, selecione um professor.');
            return;
        }
        
        // Check if we have any added disciplines
        if (numberAddMateria <= 0) {
            // Get values from the main selects if no disciplines were added
            let turma = document.querySelector('.turma-select-0').value;
            let disciplina = document.querySelector(`.disciplina-select-0`).value;
            
            if (!turma || !disciplina) {
                alert('Por favor, selecione turma e disciplina.');
                return;
            }

            console.log('Enviando dados:', {professor: prof, disciplina: disciplina, turma: turma});
            
            // Process single association
            processAssociation(prof, turma, disciplina);
        } else {
            // Process all added disciplines
            let successCount = 0;
            
            // Loop through all added disciplines (0 to numberAddMateria)
            for (let i = 0; i <= numberAddMateria; i++) {
                // For i=0, use the default selectors without number
                let turmaSelector = `.turma-select-${i}`;
                let disciplinaSelector = `.disciplina-select-${i}`;
                
                let turmaElement = document.querySelector(turmaSelector);
                let disciplinaElement = document.querySelector(disciplinaSelector);

                console.log('turmaElement:', turmaElement);
                console.log('disciplinaElement:', disciplinaElement);
                
                if (turmaElement && disciplinaElement) {
                    let turma = turmaElement.value;
                    let disciplina = disciplinaElement.value;
                    
                    if (turma && disciplina) {
                        // Process this association
                        processAssociation(prof, turma, disciplina, () => {
                            successCount++;
                            // If this is the last one, refresh the display
                            if (i === numberAddMateria) {
                                alert(`${successCount} associações realizadas com sucesso!`);
                                fetchDisciplinasProfessor();
                            }
                        });
                    }
                }
            }
        }
        
        // Helper function to process a single association
        function processAssociation(professor, turma, disciplina, callback) {
            let dadosDT = {
                professor: professor,
                disciplina: disciplina,
                turma: turma
            };
            
            console.log('Enviando dados:', dadosDT);
            
            fetch('/system/cadastrarProfessorTurmaDisciplina', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(dadosDT)
            })
            .then(response => response.json())
            .then(data => {
                if (data.sucesso) {
                    console.log('Associação realizada com sucesso!');
                    alert('Associação realizada com sucesso!');
                    if (callback) callback();
                    window.location.reload();
                } else {
                    alert(data.mensagem);
                    console.error('Erro na associação:', data.mensagem || 'Erro desconhecido');
                }
            })
            .catch(err => {
                alert('Erro na requisição: ' + err);
                console.error('Erro na requisição:', err);
            });
        }
    }

    function deleteProfessorTurmaDisciplina() {
        fetch(`/system/professores/deleteProfessorTurmaDisciplina`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({id: this.value})
        })
            .then(response => response.json())
            .then(data => {
                alert(data.mensagem);
            })
            .then(() => {
                fetchDisciplinasProfessor();
            })
            .catch(err => {
                console.error(err);
            });
    }

    function addDisciplina() {
        numberAddMateria++;
        let number = numberAddMateria;
        let table = document.querySelector('#professor-table');
        let tbody = table.querySelector('tbody');
        try {
            if (tbody.querySelector('tr').querySelector('th').innerText == 'Não há disciplinas cadastradas') {
                tbody.querySelector('tr').remove();    
            }
        } catch (error) {
            console.log('Não há disciplinas cadastradas');
        }
        let newRow = document.createElement('tr');
        newRow.innerHTML = ` 
    <th scope="row"> <select class="form-select turma-select-${number}" aria-label="Default select example"></select></th>
    <th scope="row"> <select class="form-select disciplina-select-${number}" aria-label="Default select example"></select></th>
    `;
        table.querySelector('tbody').appendChild(newRow);
        TurmaSelectFetch(number);
        DisciplinaSelectFetch(number);
    }


    //------- Fetchs -------

    function fetchTurmas() {
        fetch('/system/direcaoFetchTurma', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(result => {
                let tableBody = document.querySelector('#turmas-cadastradas table tbody');
                result.forEach(turma => {
                    let row = document.createElement('tr');
                    row.innerHTML = `
                        <th scope="row">${turma.id}</th>
                        <td>${turma.nome}</td>
                        <td>${turma.serie_nome}</td>
                        <td>
                            <button type="button" class="btn btn-warning btn-sm button-edit-turma" value="${turma.id}">Editar</button>
                            <button type="button" class="btn btn-danger btn-sm button-delete-turma" value="${turma.id}">Excluir</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            })
            .catch(err => {
                console.error(err);
            });
    }

    function fetchDisciplinas() {
        fetch('/system/direcaoFetchDisciplina', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(result => {
                let tableBody = document.querySelector('#disciplinas-cadastradas table tbody');
                result.forEach(disciplina => {
                    let row = document.createElement('tr');
                    row.innerHTML = `
                        <th scope="row">${disciplina.id}</th>
                        <td>${disciplina.nome}</td>
                        <td>
                            <button type="button" class="btn btn-warning btn-sm button-edit-disciplina" value="${disciplina.id}">Editar</button>
                            <button type="button" class="btn btn-danger btn-sm button-delete-disciplina" value="${disciplina.id}">Excluir</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            })
            .catch(err => {
                console.error(err);
            });
    }

    function fetchSerie() {
        fetch('/system/direcaoFetchSerie', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(result => {
                let tableBody = document.querySelector('#series-cadastradas table tbody');
                result.forEach(serie => {
                    let row = document.createElement('tr');
                    row.innerHTML = `
                        <th scope="row">${serie.id}</th>
                        <td>${serie.nome}</td>
                        <td>${serie.ano}</td>
                        <td>
                            <button type="button" class="btn btn-warning btn-sm button-edit-serie" value="${serie.id}">Editar</button>
                            <button type="button" class="btn btn-danger btn-sm button-delete-serie" value="${serie.id}">Excluir</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            })
            .catch(err => {
                console.error(err);
            });
    }

    function fetchAlunos() {
        fetch('/system/fetchAlunos', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(result => {
                let tableBody = document.querySelector('#alunos-cadastrados table tbody');
                result.forEach(aluno => {
                    let row = document.createElement('tr');
                    row.innerHTML = `
                        <th scope="row">${aluno.id}</th>
                        <td>${aluno.aluno_nome}</td>
                        <td>${aluno.aluno_cpf}</td>
                        <td>${aluno.turma_nome}</td>
                        <td>${aluno.email}</td>
                        <td>${aluno.responsavel_nome}</td>
                        <td>${aluno.responsavel_tel}</td>
                        <td>
                            <button type="button" class="btn btn-warning btn-sm button-edit-aluno" value="${aluno.id}">Editar</button>
                            <button type="button" class="btn btn-danger btn-sm button-delete-aluno" value="${aluno.id}">Excluir</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            })
            .catch(err => {
                console.error(err);
            });
    }


    function fetchProfessores() {
        fetch('/system/fetchProfessores', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(result => {
                let tableBody = document.querySelector('#professores-cadastrados table tbody');
                result.forEach(professor => {
                    let row = document.createElement('tr');
                    row.innerHTML = `
                        <th scope="row">${professor.id}</th>
                        <td>${professor.nome}</td>
                        <td>${professor.cpf}</td>
                        <td>${professor.email}</td>
                        <td>${professor.telefone}</td>
                        <td>
                            <button type="button" class="btn btn-warning btn-sm button-edit-professor" value="${professor.id}">Editar</button>
                            <button type="button" class="btn btn-danger btn-sm button-delete-professor" value="${professor.id}">Excluir</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            })
            .catch(err => {
                console.error(err);
            });
    }

    function fetchSalas() {
        fetch('/system/fetchSalas', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(result => {
                let tableBody = document.querySelector('#salas-cadastradas table tbody');
                result.forEach(sala => {
                    let row = document.createElement('tr');
                    row.innerHTML = `
                        <th scope="row">${sala.id}</th>
                        <td>${sala.nome}</td>
                        <td>
                            <button type="button" class="btn btn-warning btn-sm button-edit-sala" value="${sala.id}">Editar</button>
                            <button type="button" class="btn btn-danger btn-sm button-delete-sala" value="${sala.id}">Excluir</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            })
            .catch(err => {
                console.error(err);
            });
    }

    function fetchTurmaSala() {
        fetch('/system/fetchTurmaSala', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(result => {
                let tableBody = document.querySelector('#turmas-salas-cadastradas table tbody');
                result.forEach(turma_sala => {
                    let row = document.createElement('tr');
                    row.innerHTML = `
                        <th scope="row">${turma_sala.id}</th>
                        <td>${turma_sala.turma_nome}</td>
                        <td>${turma_sala.nome}</td>
                        <td>
                            <button type="button" class="btn btn-warning btn-sm button-edit-turma-sala" value="${turma_sala.id}">Editar</button>
                            <button type="button" class="btn btn-danger btn-sm button-delete-turma-sala" value="${turma_sala.id}">Excluir</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            })
            .catch(err => {
                console.error(err);
            });
    }

    function fetchDisciplinasProfessor() {
        fetch('/system/professores/fetchDisciplinasProfessor?professor='+this.value, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                let tableBody = document.querySelector('#disciplinas-professores-cadastradas table tbody');
                tableBody.innerHTML = '';
                result.forEach(disciplina_professor => {
                    let row = document.createElement('tr');
                    row.innerHTML = `
                        <td><select class="form-select" disabled><option value="${disciplina_professor.turma_id}" selected>${disciplina_professor.nome}</option></select></td>
                        <td><select class="form-select" disabled><option value="${disciplina_professor.disciplina_id}" selected>${disciplina_professor.disciplina_nome}</option></select></td>
                        <td>
                            <button type="button" class="btn btn-danger btn-sm button-delete-disciplina-professor" value="${disciplina_professor.id}">Excluir</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            })
            .then(() => {
                InitializeButtons1();
            })
            .catch(err => {
                console.error(err);
            });
    }

    //-------- Select Fetchs --------

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

        function TurmaSelectFetch(number, serie) {
        fetch('/system/direcaoFetchTurma', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(result => {
                let sel = ".turma-select";
                if (number != null) {
                    sel += '-' + number;
                }
                let turmaSelect = document.querySelectorAll(sel);
                turmaSelect.forEach(select => {
                    select.innerHTML = '';
                    result.forEach(turma => {
                        if (turma.serie_id == serie || serie == null) {
                            let option = document.createElement('option');
                            option.value = turma.id;
                            option.text = turma.nome;
                            select.appendChild(option);
                        }
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
                    sel += '-' + number;
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
                    sel += '-' + number;
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


    TurmaIDSelectFetch();
    SerieSelectFetch();
    TurmaSelectFetch();
    SerieSelectFetch(numberAddMateria);
    TurmaSelectFetch(numberAddMateria);
    DisciplinaSelectFetch(numberAddMateria);
    InitializeFetch();
    InitializeButtons1();
    

});
