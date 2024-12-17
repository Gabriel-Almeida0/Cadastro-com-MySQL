const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const promisePool = require('./db'); // Certifique-se de que está importando corretamente

const app = express();
const porta = 5000;

// Configurações do Express
app.use(helmet()); // Protege com o helmet
app.use(bodyParser.urlencoded({ extended: true }));

// Expressão regular para telefone e email
const telefoneRegex = new RegExp('^((1[1-9])|([2-9][0-9]))((3[0-9]{3}[0-9]{4})|(9[0-9]{3}[0-9]{5}))$');
const emailRegex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');

// Verificar duplicidade de email ou telefone
const verificarDuplicado = async (email, telefone) => {
  const query = 'SELECT * FROM clientes WHERE email = ? OR telefone = ?';
  const [rows] = await promisePool.query(query, [email, telefone]);
  return rows.length > 0;
};

// Página inicial com lista de clientes
app.get('/', async (req, res) => {
  try {
    const [results] = await promisePool.query('SELECT * FROM clientes');
    let html = '<h1>Lista de Clientes</h1>';
    html += '<table border="1"><tr><th>ID</th><th>Nome</th><th>Email</th><th>Telefone</th><th>Ações</th></tr>';
    results.forEach(row => {
      html += `<tr>
                 <td>${row.id}</td>
                 <td>${row.nome}</td>
                 <td>${row.email}</td>
                 <td>${row.telefone}</td>
                 <td><form action="/delete" method="POST">
                        <input type="hidden" name="id" value="${row.id}">
                        <button type="submit">Remover</button>
                    </form></td>
               </tr>`;
    });
    html += '</table>';
    html += `<h2>Adicionar Cliente</h2>
             <form action="/add" method="POST">
               <label for="nome">Nome:</label><br>
               <input type="text" id="nome" name="nome"><br>
               <label for="email">Email:</label><br>
               <input type="email" id="email" name="email"><br>
               <label for="telefone">Telefone:</label><br>
               <input type="text" id="telefone" name="telefone"><br><br>
               <button type="submit">Adicionar</button>
             </form>`;
    res.send(html);
  } catch (err) {
    res.status(500).send('Erro ao consultar os dados');
  }
});

// Adicionar um cliente
app.post('/add', async (req, res) => {
  const { nome, email, telefone } = req.body;

  if (!nome || !email || !telefone) {
    return res.status(400).send('Todos os campos são obrigatórios.');
  }

  if (!telefoneRegex.test(telefone)) {
    return res.status(400).send('Número de telefone inválido.');
  }

  if (!emailRegex.test(email)) {
    return res.status(400).send('Email inválido.');
  }

  try {
    const duplicado = await verificarDuplicado(email, telefone);
    if (duplicado) {
      return res.status(400).send('Email ou telefone já cadastrados.');
    }

    const query = 'INSERT INTO clientes (nome, email, telefone) VALUES (?, ?, ?)';
    await promisePool.query(query, [nome, email, telefone]);
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Erro ao adicionar cliente');
  }
});

// Remover um cliente
app.post('/delete', async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).send('ID do cliente é necessário.');
  }

  try {
    const query = 'DELETE FROM clientes WHERE id = ?';
    await promisePool.query(query, [id]);
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Erro ao remover cliente');
  }
});

// Iniciar o servidor
app.listen(porta, () => {
  console.log(`Servidor rodando em http://localhost:${porta}`);
});
