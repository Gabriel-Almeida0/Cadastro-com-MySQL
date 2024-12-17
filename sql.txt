CREATE DATABASE minha_aplicacao;

USE minha_aplicacao;

CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100),
    telefone VARCHAR(20)
);

INSERT INTO clientes (nome, email, telefone) VALUES
('João Silva', 'joao@exemplo.com', '123456789'),
('Maria Oliveira', 'maria@exemplo.com', '987654321');
