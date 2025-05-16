// Import all modules
import fetchAlunos from '/js/Alunos/fetchAlunos.js';
import fetchProfessores from '/js/Professores/fetchProfessores.js';
import fetchTurmas from '/js/Turmas/fetchTurmas.js';
import fetchSeries from '/js/Series/fetchSeries.js';
import fetchProdutos from '/js/Produtos/fetchProdutos.js';
import fetchDisciplinas from '/js/Disciplinas/fetchDisicplinas.js';
import gerenciarAlunos from '/js/Alunos/gerenciarAlunos.js';
import gerenciarProfessores from '/js/Professores/gerenciarProfessores.js';
import gerenciarTurmas from '/js/Turmas/gerenciarTurmas.js';
import gerenciarSeries from '/js/Series/gerenciarSeries.js';
import gerenciarDisciplinas from '/js/Disciplinas/gerenciarDisciplinas.js';
import gerenciarProdutos from '/js/Produtos/gerenciarProdutos.js';

// Make them available globally
window.fetchAlunos = fetchAlunos;
window.fetchProfessores = fetchProfessores;
window.fetchTurmas = fetchTurmas;
window.fetchSeries = fetchSeries;
window.fetchProdutos = fetchProdutos;
window.fetchDisciplinas = fetchDisciplinas;
window.gerenciarAlunos = gerenciarAlunos;
window.gerenciarProfessores = gerenciarProfessores;
window.gerenciarTurmas = gerenciarTurmas;
window.gerenciarSeries = gerenciarSeries;
window.gerenciarDisciplinas = gerenciarDisciplinas;
window.gerenciarProdutos = gerenciarProdutos;

// Initialize modules when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize your modules as needed
  const fAlunos = new fetchAlunos();
  const fProfessores = new fetchProfessores();
  const fTurmas = new fetchTurmas();
  const fSeries = new fetchSeries();
  const fProdutos = new fetchProdutos();
  const fDisciplinas = new fetchDisciplinas();

  const gAlunos = new gerenciarAlunos();
  const gProfessores = new gerenciarProfessores();
  const gTurmas = new gerenciarTurmas();
  const gSeries = new gerenciarSeries();
  const gDisciplinas = new gerenciarDisciplinas();
  const gProdutos = new gerenciarProdutos();

  // Initialize modules
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
});
