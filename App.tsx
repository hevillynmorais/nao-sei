import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

const cardapioCompleto = {
  /* mesmo cardápio que você tem no JS original */
  // Exemplo simples:
  'Pães e Cereais (Carboidratos)': ['Pão Integral', 'Arroz Integral', 'Batata Doce'],
  'Proteínas': ['Peito de Frango', 'Ovo', 'Peixe'],
  'Verduras': ['Alface', 'Tomate', 'Cenoura']
};

type Usuario = {
  nome: string;
  serie: string;
  sexo: string;
  email?: string;
  selecaoAlimentos: string[];
  peso?: number;
  altura?: number;
  imc?: number;
  status?: string;
  objetivo?: string;
};

const App: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [pagina, setPagina] = useState<'login' | 'cardapio' | 'calculo' | 'resultados'>('login');
  const [selecao, setSelecao] = useState<string[]>([]);
  const [resultado, setResultado] = useState<any>(null);

  useEffect(() => {
    if (resultado) {
      const ctx = document.getElementById('graficoProgresso') as HTMLCanvasElement;
      if (ctx) {
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
            datasets: [
              {
                label: 'IMC',
                data: [resultado.imc - 0.3, resultado.imc - 0.2, resultado.imc - 0.1, resultado.imc],
                borderColor: '#ffc107',
                fill: false,
              },
              {
                label: 'Peso',
                data: [resultado.peso - 1, resultado.peso - 0.5, resultado.peso - 0.2, resultado.peso],
                borderColor: '#eeeeee',
                fill: false,
              },
            ],
          },
        });
      }
    }
  }, [resultado]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const nome = (form.elements.namedItem('nome') as HTMLInputElement).value;
    const serie = (form.elements.namedItem('serie') as HTMLSelectElement).value;
    const sexo = (form.elements.namedItem('sexo') as HTMLSelectElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;

    if (!nome || !serie || !sexo) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    setUsuario({ nome, serie, sexo, email, selecaoAlimentos: [] });
    setPagina('cardapio');
  };

  const handleSelecaoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;
    setUsuario({ ...usuario, selecaoAlimentos: selecao });
    setPagina('calculo');
  };

  const handleCalculoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;
    const form = e.target as HTMLFormElement;
    const peso = parseFloat((form.elements.namedItem('peso') as HTMLInputElement).value);
    const altura = parseFloat((form.elements.namedItem('altura') as HTMLInputElement).value);
    const objetivo = (form.elements.namedItem('objetivo') as HTMLSelectElement).value;

    if (!peso || !altura || !objetivo) {
      alert('Preencha todos os campos!');
      return;
    }
    const imc = peso / (altura * altura);
    let status = '';
    if (imc < 18.5) status = 'Abaixo do peso';
    else if (imc < 25) status = 'Peso normal';
    else if (imc < 30) status = 'Sobrepeso';
    else status = 'Obesidade';

    setResultado({ peso, altura, imc, status, objetivo });
    setPagina('resultados');
  };

  return (
    <div style={{ color: '#eeeeee', backgroundColor: '#1a1a1a', minHeight: '100vh', padding: 20 }}>
      <h1 style={{ color: '#ffc107' }}>Escritório Personal Trainer</h1>

      <nav>
        <button onClick={() => setPagina('login')}>Login</button>
        <button onClick={() => usuario && setPagina('cardapio')}>Cardápio</button>
        <button onClick={() => usuario && setPagina('calculo')}>Calcular IMC</button>
        <button onClick={() => resultado && setPagina('resultados')}>Resultados</button>
      </nav>

      {pagina === 'login' && (
        <form onSubmit={handleLoginSubmit}>
          <input name="nome" placeholder="Nome" required />
          <select name="serie" required>
            <option value="">Selecione a Série</option>
            <option value="6">6º</option>
            <option value="7">7º</option>
            <option value="8">8º</option>
            <option value="9">9º</option>
          </select>
          <select name="sexo" required>
            <option value="">Sexo</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
          <input name="email" placeholder="Email (opcional)" type="email" />
          <button type="submit">Entrar</button>
        </form>
      )}

      {pagina === 'cardapio' && (
        <form onSubmit={handleSelecaoSubmit}>
          <h2>Selecione seus alimentos preferidos:</h2>
          {Object.entries(cardapioCompleto).map(([categoria, alimentos]) => (
            <fieldset key={categoria} style={{ marginBottom: 20 }}>
              <legend>{categoria}</legend>
              {alimentos.map(item => (
                <label key={item} style={{ display: 'block', marginBottom: 5 }}>
                  <input
                    type="checkbox"
                    value={item}
                    checked={selecao.includes(item)}
                    onChange={e => {
                      if (e.target.checked) setSelecao([...selecao, item]);
                      else setSelecao(selecao.filter(i => i !== item));
                    }}
                  />
                  {item}
                </label>
              ))}
            </fieldset>
          ))}
          <button type="submit">Salvar e Continuar</button>
        </form>
      )}

      {pagina === 'calculo' && (
        <form onSubmit={handleCalculoSubmit}>
          <h2>Calcule seu IMC</h2>
          <label>Peso (kg): <input name="peso" type="number" step="0.1" required /></label>
          <br />
          <label>Altura (m): <input name="altura" type="number" step="0.01" required /></label>
          <br />
          <label>Objetivo:
            <select name="objetivo" required>
              <option value="">Selecione</option>
              <option value="massa">Ganhar Massa</option>
              <option value="gordura">Perder Gordura</option>
              <option value="manter">Manter Peso</option>
            </select>
          </label>
          <br />
          <button type="submit">Calcular</button>
        </form>
      )}

      {pagina === 'resultados' && resultado && (
        <div>
          <h2>Resultados</h2>
          <p>IMC: {resultado.imc.toFixed(2)}</p>
          <p>Status: {resultado.status}</p>
          <p>Objetivo: {resultado.objetivo}</p>
          <canvas id="graficoProgresso" width="600" height="400"></canvas>
        </div>
      )}
    </div>
  );
};

export default App;
