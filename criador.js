const listaAlunosContainer = document.getElementById('listaAlunosContainer');
const detalhesAlunoDiv = document.getElementById('detalhesAluno');
let historico = JSON.parse(localStorage.getItem('pt_historico') || '[]');

function limparDadosHistorico(){
  if(confirm("Tem certeza que deseja limpar TODO o histórico de alunos? Esta ação é IRREVERSÍVEL.")){
    localStorage.removeItem('pt_historico');
    localStorage.removeItem('pt_usuario');
    historico = [];
    alert("Histórico limpo. A página será recarregada.");
    window.location.reload();
  }
}

function carregarListaAlunos(){
  listaAlunosContainer.innerHTML = ''; 
  if(historico.length === 0){
    listaAlunosContainer.innerHTML = '<p style="color: #ffc107;">Nenhum aluno registrou dados ainda.</p>';
    return;
  }
  const ul = document.createElement('ul');
  ul.style.listStyle = 'none';
  ul.style.padding = '0';
  historico.forEach((aluno, i) => {
    const li = document.createElement('li');
    li.style.marginBottom = '8px';
    const btn = document.createElement('button');
    btn.className = 'link-btn';
    btn.textContent = `${aluno.nome} (${aluno.serie}º ano) - ${aluno.email || 'Sem Email'}`;
    btn.onclick = () => exibirDetalhesAluno(i);
    li.appendChild(btn);
    ul.appendChild(li);
  });
  listaAlunosContainer.appendChild(ul);
}

function exibirDetalhesAluno(index){
  const aluno = historico[index];
  if(!aluno){
    detalhesAlunoDiv.innerHTML = '<p>Erro: Aluno não encontrado.</p>';
    return;
  }
  detalhesAlunoDiv.innerHTML = `
    <h3>Dados: ${aluno.nome}</h3>
    <table>
      <tr><th>Campo</th><th>Valor</th></tr>
      <tr><td>Nome</td><td>${aluno.nome}</td></tr>
      <tr><td>Email</td><td>${aluno.email || 'Não informado'}</td></tr>
      <tr><td>Série / Sexo</td><td>${aluno.serie}º ano / ${aluno.sexo}</td></tr>
      <tr><td>Peso (kg) / Altura (m)</td><td>${aluno.peso || 'N/A'} / ${aluno.altura || 'N/A'}</td></tr>
    </table>
    <hr>
    <h3>IMC e Metas</h3>
    <table>
      <tr><th>Campo</th><th>Valor</th></tr>
      <tr style="background-color:#555;">
        <td>IMC</td>
        <td><strong>${aluno.imc || 'N/A'}</strong></td>
      </tr>
      <tr style="background-color:#555;">
        <td>Status</td>
        <td><strong>${aluno.status || 'N/A'}</strong></td>
      </tr>
      <tr><td>Objetivo</td><td>${aluno.objetivo ? aluno.objetivo.charAt(0).toUpperCase()+ aluno.objetivo.slice(1).replace('_',' ') : 'N/A'}</td></tr>
    </table>
    <hr>
    <h3>Recomendações</h3>
    <table>
      <tr><th colspan="2">Alimentos Selecionados</th></tr>
      <tr><td colspan="2" style="font-size:0.9em; font-style:italic; color:#ccc;">
          ${aluno.alimentosConsumidos ? aluno.alimentosConsumidos.split(';').map(i=>`• ${i.trim()}`).join(' ') : 'Nenhum alimento selecionado.'}
      </td></tr>
      <tr><th>Exercício</th><td>${aluno.exercicio || 'N/A'}</td></tr>
      <tr><th>Alimentação</th><td>${aluno.alimentacaoRecomendada || 'N/A'}</td></tr>
      <tr><th>Sono</th><td>${aluno.sono || 'N/A'}</td></tr>
    </table>
    <p class="alerta" style="margin-top:20px;">
      📢 Dados do último registro do aluno.
    </p>
  `;
}

document.addEventListener('DOMContentLoaded', carregarListaAlunos);

window.limparDadosHistorico = limparDadosHistorico;
window.exibirDetalhesAluno = exibirDetalhesAluno;
