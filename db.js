const mysql = require('mysql2');

// Criando o pool de conexões com o banco de dados MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',        // Usuário padrão do XAMPP
  password: '',        // Senha (geralmente em branco no XAMPP)
  database: 'minha_aplicacao', // Nome do banco de dados
  waitForConnections: true, // Aguarda por novas conexões se o limite for atingido
  connectionLimit: 10,  // Número máximo de conexões no pool
  queueLimit: 0         // Número máximo de requisições na fila de espera
});

// Prometendo a conexão para facilitar o uso com async/await
const promisePool = pool.promise();

// Função para testar a conexão
const testConnection = async () => {
  try {
    const [rows, fields] = await promisePool.query('SELECT 1 + 1 AS result');
    console.log('Conexão bem-sucedida:', rows);
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  }
};

// Testando a conexão
testConnection();

// Exportando o pool para ser utilizado nas rotas ou outras partes do código
module.exports = promisePool;
