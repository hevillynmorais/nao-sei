const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let dadosAlunos = [];

app.post('/salvar-dados', (req, res) => {
  const novoAluno = req.body;
  dadosAlunos = dadosAlunos.filter(a => a.email !== novoAluno.email || a.nome !== novoAluno.nome);
  dadosAlunos.push(novoAluno);
  res.json({ sucesso: true });
});

app.get('/historico', (req, res) => {
  res.json(dadosAlunos);
});

app.post('/clear', (req, res) => {
  dadosAlunos = [];
  res.json({ sucesso: true });
});

const porta = 4000;
app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});
