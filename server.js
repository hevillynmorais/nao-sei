const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let dadosAlunos = [];

app.post('/salvar-dados', (req, res) => {
  const aluno = req.body;
  dadosAlunos.push(aluno);
  res.json({ sucesso: true });
});

app.get('/historico', (req, res) => {
  res.json(dadosAlunos);
});

app.listen(4000, () => console.log('Servidor rodando na porta 4000'));
