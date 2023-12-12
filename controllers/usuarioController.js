// usuarioController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Usuario } from "../models/Usuario.js";
import { Log } from "../models/Log.js";

function validaSenha(senha) {
  const mensagens = [];

  if (senha.length < 8) {
    mensagens.push("Erro... senha deve possuir, no mínimo, 8 caracteres");
  }

  // Adicione outras verificações de senha conforme necessário

  return mensagens;
}

export async function usuarioIndex(req, res) {
  try {
    const usuarios = await Usuario.findAll();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
}

export async function usuarioCreate(req, res) {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    res.status(400).json({ erro: "Erro... Informe nome, email e senha" });
    return;
  }

  try {
    // Verificar se já existe um usuário com o mesmo e-mail
    const usuarioExistente = await Usuario.findOne({ where: { email } });

    if (usuarioExistente) {
      res.status(400).json({ erro: "Erro... Já existe um usuário com este e-mail" });
      return;
    }

    // Validação da senha
    const mensagensSenha = validaSenha(senha);
    if (mensagensSenha.length > 0) {
      res.status(400).json({ erro: mensagensSenha.join(", ") });
      return;
    }

    // Hash da senha antes de armazenar
    const hashedSenha = await bcrypt.hash(senha, 10);

    const usuario = await Usuario.create({
      nome,
      email,
      senha: hashedSenha,
    });

    res.status(201).json(usuario);
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
}

export async function usuarioTrocaSenha(req, res) {
  const { senhaAtual, novaSenha } = req.body;

  if (!senhaAtual || !novaSenha) {
    res.status(400).json({ erro: "Erro... Informe senhaAtual e novaSenha" });
    return;
  }

  try {
    const usuario = await Usuario.findByPk(req.usuario_logado_id);

    // Verifica se a senha atual fornecida é válida
    const senhaAtualValida = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaAtualValida) {
      res.status(400).json({ erro: "Senha atual incorreta" });
      return;
    }

    // Verifica se a nova senha é igual à senha atual
    if (senhaAtual === novaSenha) {
      res.status(400).json({ erro: "A nova senha deve ser diferente da senha atual" });
      return;
    }

    // Validação da nova senha
    const mensagensSenha = validaSenha(novaSenha);
    if (mensagensSenha.length > 0) {
      res.status(400).json({ erro: mensagensSenha.join(", ") });
      return;
    }

    // Hash da nova senha antes de armazenar
    const hashedNovaSenha = await bcrypt.hash(novaSenha, 10);

    // Atualiza a senha do usuário
    await usuario.update({ senha: hashedNovaSenha });

    res.status(200).json({ msg: "Ok! Troca de senha realizada com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
}

export async function loginUsuario(req, res) {
  const { email, senha } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    await Log.create({
      descricao: `Tentativa de Login`,
      complemento: `E-mail: ${email}`,
    });

    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      res.status(400).json({ erro: "Credenciais inválidas..." });
      return;
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

    res.status(200).json({
      msg: `Bem-vindo, ${usuario.nome}! Seu último acesso ao sistema foi em ${usuario.ultimo_login}`,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
}

export async function usuarioAlterarSenha(req, res) {
  const { senhaAtual, novaSenha } = req.body;

  if (!senhaAtual || !novaSenha) {
    res.status(400).json({ erro: "Erro... Informe senhaAtual e novaSenha" });
    return;
  }

  try {
    const usuario = await Usuario.findByPk(req.usuario_logado_id);

    // Verifica se a senha atual fornecida é válida
    const senhaAtualValida = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaAtualValida) {
      res.status(400).json({ erro: "Senha atual incorreta" });
      return;
    }

    // Verifica se a nova senha é igual à senha atual
    if (senhaAtualValida && senhaAtual === novaSenha) {
      res.status(400).json({ erro: "A nova senha deve ser diferente da senha atual" });
      return;
    }

    // Validação da nova senha
    const mensagensSenha = validaSenha(novaSenha);
    if (mensagensSenha.length > 0) {
      res.status(400).json({ erro: mensagensSenha.join(", ") });
      return;
    }

    // Hash da nova senha antes de armazenar
    const hashedNovaSenha = await bcrypt.hash(novaSenha, 10);

    // Atualiza a senha do usuário
    await usuario.update({ senha: hashedNovaSenha });

    res.status(200).json({ msg: "Ok! Alteração de senha realizada com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(400).send(error);
  }
}
