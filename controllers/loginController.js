// loginController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { Usuario } from "../models/Usuario.js";
import { Log } from "../models/Log.js";

dotenv.config();

export async function loginUsuario(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Informe o e-mail e a senha." });
  }

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(400).json({ erro: "Usuário não encontrado." });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(400).json({ erro: "Senha incorreta." });
    }

    // Atualiza a data/hora do último login
    await usuario.update({ ultimo_login: new Date() });

    // Gera e retorna o token
    const token = jwt.sign(
      {
        usuario_logado_id: usuario.id,
        usuario_logado_nome: usuario.nome,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    await Log.create({
      descricao: `Login bem-sucedido`,
      complemento: `Usuário: ${usuario.nome}, E-mail: ${email}`,
    });

    return res.status(200).json({
      msg: `Bem-vindo, ${usuario.nome}! Seu último acesso ao sistema foi em ${usuario.ultimo_login}`,
      token,
    });
  } catch (error) {
    console.error("Erro ao tentar fazer login:", error);
    return res.status(400).json({ erro: "Credenciais inválidas." });
  }
}

console.log("Chave JWT:", process.env.JWT_KEY);
