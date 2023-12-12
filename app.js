import express from 'express'
import { sequelize } from './database/conecta.js'
import { Livro } from "./models/Livro.js";
import { Usuario } from './models/Usuario.js'
import routes from './routes.js'
import { Log } from './models/Log.js'
import { Troca } from './models/Troca.js'
import * as dotenv from 'dotenv';

dotenv.config();

const app = express()
const port = 3000

app.use(express.json())
app.use(routes)

app.get('/', (req, res) => {
  res.send('Sistema de Cadastro de Livros')
})

async function conecta_db() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com Banco de Dados realizada com Sucesso');
    await Livro.sync()      // cria a tabela no banco (se não existir)
    console.log("Tabela de Livros: Ok")
    await Usuario.sync()      // cria a tabela no banco (se não existir)
    console.log("Tabela de Usuários: Ok")
    await Log.sync()      // cria a tabela no banco (se não existir)
    console.log("Tabela de Logs: Ok")
    await Troca.sync()      // cria a tabela no banco (se não existir)
    console.log("Tabela de Solicitações de Troca de Senhas: Ok")
  } catch (error) {
    console.error('Erro ao conectar o banco de dados:', error);
  }  
}
conecta_db()

app.listen(port, () => {
  console.log(`API de Carros Rodando na Porta: ${port}`)
})