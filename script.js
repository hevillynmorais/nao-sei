const cardapioCompleto = {
  'Pães e Cereais (Carboidratos)': {
    'Pão': ['Integral (melhor opção)', 'Australiano', 'De forma (moderado)', 'Francês (com moderação)', 'Pão Sírio/Pita', 'Baguete', 'Pão de Centeio'],
    'Arroz': ['Integral (melhor opção)', 'Parboilizado', 'Branco (com moderação)', 'Arroz com legumes', 'Risoto (com moderação)'],
    'Massas e Tubérculos': ['Batata Doce (melhor opção)', 'Mandioca/Aipim', 'Inhame', 'Macarrão Integral', 'Macarrão Branco (com moderação)', 'Batata Inglesa (com casca)'],
    'Cereais e Grãos': ['Aveia (melhor opção)', 'Farinha de Milho/Fubá', 'Granola caseira sem açúcar', 'Cuscuz', 'Quinoa', 'Chia'],
    'Diversos': ['Tortillas de milho', 'Tapioca', 'Biscoito integral (sem açúcar)'],
  },
  'Leguminosas e Sementes': {
    'Feijão': ['Preto', 'Carioca', 'Fradinho', 'Verde', 'Branco (todos excelentes)'],
    'Outras Leguminosas': ['Lentilha', 'Grão de Bico', 'Ervilha', 'Soja e Tofu'],
    'Sementes e Oleaginosas': ['Castanha de Caju', 'Castanha do Pará', 'Amendoim', 'Nozes', 'Linhaça', 'Semente de Girassol', 'Gergelim'],
  },
  'Proteínas Animais (Magras)': {
    'Aves': ['Peito de frango (sem pele)', 'Cortes de peru', 'Coxa e Sobrecoxa (sem pele, assada)'],
    'Peixes e Frutos do Mar': ['Salmão (rico em ômagem-3)', 'Sardinha', 'Tilápia', 'Atum (conservado em água)', 'Camarão', 'Bacalhau'],
    'Carnes Vermelhas': ['Patinho', 'Alcatra', 'Músculo', 'Filé Mignon (cortes magros, com moderação)'],
    'Ovo': ['Cozido (excelente)', 'Mexido', 'Omelete', 'Frito (com pouco óleo)'],
  },
  'Laticínios e Derivados': {
    'Leite': ['Desnatado', 'Semi-desnatado', 'Integral (com moderação)', 'Bebidas vegetais (amêndoa, coco)'],
    'Queijos (Priorize Magros)': ['Ricota', 'Cottage', 'Queijo Minas Frescal', 'Muçarela (com moderação)', 'Queijo Prato (com moderação)'],
    'Iogurte': ['Natural integral', 'Natural desnatado', 'Iogurte Grego (natural, sem açúcar)', 'Kefir'],
  },
  'Vegetais e Verduras (Fibras e Vitaminas)': {
    'Folhas': ['Alface (todos os tipos)', 'Rúcula', 'Agrião', 'Espinafre', 'Couve', 'Acelga', 'Repolho'],
    'Legumes Cozidos': ['Brócolis', 'Couve-flor', 'Cenoura', 'Abobrinha', 'Berinjela', 'Beterraba', 'Vagem', 'Quiabo'],
    'Legumes Crús': ['Tomate', 'Pepino', 'Pimentão', 'Cebola', 'Alho-poró'],
  },
  'Fontes de Gordura Saudável': {
    'Óleos': ['Azeite de Oliva Extra Virgem', 'Óleo de Coco (com moderação)', 'Óleo de Abacate'],
    'Frutas/Sementes': ['Abacate', 'Azeitonas', 'Óleo de Linhaça'],
  },
  'Frutas (Vitaminas e Açúcares Naturais)': {
    'Frutas Cítricas': ['Laranja', 'Limão', 'Tangerina', 'Kiwi'],
    'Frutas Vermelhas': ['Morango', 'Mirtilo (Blueberry)', 'Amora'],
    'Outras': ['Banana', 'Maçã (com casca)', 'Pêra', 'Mamão', 'Melancia', 'Melão', 'Uva', 'Abacaxi'],
  },
};

// Variáveis globais
let usuarioAtual = JSON.parse(localStorage.getItem('pt_usuario'));
let historico = JSON.parse(localStorage.getItem('pt_historico') || '[]');

const cardapioDiv = document.getElementById('cardapioInterativo');
const listaSelecionadosP = document.getElementById('listaSelecionados');
const formSelecaoAlimentos = document.getElementById('formSelecaoAlimentos');
const formLogin = document.getElementById('formLogin');
const formCalculo = document.getElementById('formCalculo');
const respostasDiv = document.getElementById('respostas');
const graficoProgressoCtx = document.getElementById('graficoProgresso').getContext('2d');
let graficoProgresso;

// Funções

function abrirAba(nome){
  document.querySelectorAll('.aba').forEach(a=>a.classList.remove('ativa'));
  const el = document.getElementById('aba-'+nome);
  if(el) el.classList.add('ativa');
  if(nome === 'alimentacao' && cardapioDiv.children.length === 0) gerarCardapioInterativo();
}

// Login
if(formLogin){
  formLogin.addEventListener('submit', e=>{
    e.preventDefault();
    const nome = document.getElementById('nome').value.trim();
    const serie = document.getElementById('serie').value;
    const sexo = document.getElementById('sexo').value;
    const email = document.getElementById('email').value.trim().toLowerCase();

    const emailsCriadorAutorizados = [
      "hevillyn.morais@escola.pr.gov.br",
      "sexugi.isabelly@escola.pr.gov.br",
      "jose.lino.chaves@escola.pr.gov.br",
      "juliano.ramos.souza@escola.pr.gov.br",
      "kemily.santos.luz@escola.pr.gov.br"
    ];

    if(!nome || !serie || !sexo) {
      alert('Por favor, preencha Nome, Série e Sexo.');
      return;
    }

    if(serie === 'A'){
      if(emailsCriadorAutorizados.includes(email)){
        window.location.href = 'criador.html';
        return;
      } else {
        alert('Acesso negado: e-mail não autorizado.');
        return;
      }
    }
    
    usuarioAtual = { nome, serie, sexo, email, selecaoAlimentos: [] };
    localStorage.setItem('pt_usuario', JSON.stringify(usuarioAtual));
    if(cardapioDiv.children.length > 0) carregarSelecaoSalva();
    formLogin.reset();
    abrirAba('alimentacao');
  });
}

// Gerar cardápio interativo
function gerarCardapioInterativo(){
  let html = '';
  for(const categoria in cardapioCompleto){
    html += `<div class="categoria-alimento card" style="margin-bottom: 20px; padding: 15px; border: 1px solid #ffc107;">
    <h3>${categoria}</h3>`;
    for(const sub in cardapioCompleto[categoria]){
      html += `<h4>${sub}:</h4><div style="display:flex; flex-wrap:wrap; gap:10px 20px;">`;
      cardapioCompleto[categoria][sub].forEach(alimento=>{
        const id = 'alimento-'+alimento.replace(/[^a-zA-Z0-9]/g,'_');
        html += `<label for="${id}" style="cursor:pointer;display:flex;align-items:center;margin-bottom:5px; font-weight:normal;">
        <input type="checkbox" name="alimento" value="${alimento}" id="${id}" onchange="actualizarResumoSelecao()" style="width:20px; height:20px; margin-right:5px; cursor:pointer;">${alimento}</label>`;
      });
      html += '</div>';
    }
    html += '</div>';
  }
  cardapioDiv.innerHTML = html;
  carregarSelecaoSalva();
}

// Atualiza resumo seleção alimentos
function actualizarResumoSelecao(){
  const selecionados = Array.from(document.querySelectorAll('#cardapioInterativo input[name="alimento"]:checked')).map(c => c.value);
  listaSelecionadosP.textContent = selecionados.length > 0 ? selecionados.join('; ') : 'Nenhum alimento selecionado.';
}

// Carregar seleção salva na interface
function carregarSelecaoSalva(){
  if(usuarioAtual && usuarioAtual.selecaoAlimentos){
    document.querySelectorAll('#cardapioInterativo input[name="alimento"]').forEach(checkbox => {
      checkbox.checked = usuarioAtual.selecaoAlimentos.includes(checkbox.value);
    });
    actualizarResumoSelecao();
  }
}

// Salvar seleção alimentos
if(formSelecaoAlimentos){
  formSelecaoAlimentos.addEventListener('submit', e=>{
    e.preventDefault();
    if(!usuarioAtual){
      alert('Faça login primeiro na aba Login.');
      abrirAba('login');
      return;
    }
    const selecionados = Array.from(document.querySelectorAll('#cardapioInterativo input[name="alimento"]:checked')).map(c => c.value);
    if(selecionados.length === 0){
      alert('Selecione pelo menos um alimento.');
      return;
    }
    usuarioAtual.selecaoAlimentos = selecionados;
    localStorage.setItem('pt_usuario', JSON.stringify(usuarioAtual));
    const alimentosStr = selecionados.join('; ');
    let registro = historico.find(r => r.email === usuarioAtual.email && r.nome === usuarioAtual.nome);
    if(registro){
      registro.alimentosConsumidos = alimentosStr;
    } else {
      registro = {...usuarioAtual, alimentosConsumidos: alimentosStr};
      historico.push(registro);
    }
    localStorage.setItem('pt_historico', JSON.stringify(historico));
    alert('Seleção salva! Agora calcule no próximo passo.');
    abrirAba('calculo');
  });
}

// Cálculo IMC, recomendação e gráfico
if(formCalculo){
  formCalculo.addEventListener('submit', e=>{
    e.preventDefault();
    if(!usuarioAtual){
      alert('Faça login primeiro.');
      abrirAba('login');
      return;
    }
    const peso = parseFloat(document.getElementById('peso').value.replace(',', '.'));
    const altura = parseFloat(document.getElementById('altura').value.replace(',', '.'));
    if(isNaN(peso) || peso <= 0 || isNaN(altura) || altura <= 0){
      alert('Preencha peso e altura corretamente.');
      return;
    }
    const atividade = document.getElementById('atividade').value;
    const objetivo = document.getElementById('objetivo').value;
    if(!atividade || !objetivo){
      alert('Selecione nível de atividade e objetivo.');
      return;
    }
    const imc = peso / (altura * altura);
    let status = '';
    if(imc < 18.5) status = 'Abaixo do peso (consulte profissional)';
    else if(imc < 25) status = 'Peso normal (ótimo)';
    else if(imc < 30) status = 'Sobrepeso (atenção)';
    else status = 'Obesidade (consulte profissional)';
    let exercicio = '', alimentacao = '', sono = '7-9 horas/dia';
    switch(atividade){
      case 'sedentario': exercicio = '30 min/dia de atividade leve'; break;
      case 'leve': exercicio = '30-60 min/dia, 3x/semana'; break;
      case 'moderado': exercicio = '60 min/dia, 5x/semana'; break;
      case 'intenso': exercicio = '60-90 min/dia, 6-7x/semana'; break;
    }
    switch(objetivo){
      case 'massa': alimentacao = 'Foco em proteínas, superávit calórico.'; break;
      case 'gordura':
      case 'emagrecer': alimentacao = 'Dieta equilibrada, déficit calórico moderado.'; break;
      case 'manter': alimentacao = 'Alimentação equilibrada e variada.'; break;
      case 'definir': alimentacao = 'Proteínas altas e controle calórico.'; break;
      case 'ganhar_forca': alimentacao = 'Proteínas e carboidratos em torno do treino.'; break;
    }
    const alimentosConsumidos = usuarioAtual.selecaoAlimentos ? usuarioAtual.selecaoAlimentos.join('; ') : 'Nenhum alimento selecionado';
    const registro = {
      ...usuarioAtual,
      peso: peso.toFixed(2), altura: altura.toFixed(3),
      imc: imc.toFixed(2), status, exercicio, sono,
      alimentacaoRecomendada: alimentacao, alimentosConsumidos, objetivo
    };
    const indexHist = historico.findIndex(r => r.email === usuarioAtual.email && r.nome === usuarioAtual.nome);
    if(indexHist > -1) historico[indexHist] = registro;
    else historico.push(registro);
    localStorage.setItem('pt_historico', JSON.stringify(historico));
    respostasDiv.innerHTML = `
      <
