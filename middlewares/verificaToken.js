// verificaToken.js
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

export function verificaToken(req, res, next) {
  try {
    // Verifica se o token está presente no cabeçalho da requisição
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ erro: "Token não fornecido. Acesso não autorizado." });
    }

    // Divide o token e verifica a assinatura
    const tokenParts = token.split(" ");

    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return res.status(401).json({ erro: "Formato de token inválido. Acesso não autorizado." });
    }

    const decode = jwt.verify(tokenParts[1], process.env.JWT_KEY);
    console.log(decode);

    // Adiciona informações do usuário decodificadas ao objeto de requisição
    req.usuario_logado_id = decode.usuario_logado_id;
    req.usuario_logado_nome = decode.usuario_logado_nome;

    // Avança para o próximo middleware ou rota
    next();
  } catch (error) {
    // Tratamento de diferentes erros durante a verificação do token
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ erro: "Token inválido. Acesso não autorizado." });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ erro: "Token expirado. Acesso não autorizado." });
    } else {
      console.error("Erro durante a verificação do token:", error);
      return res.status(500).json({ erro: "Erro interno do servidor." });
    }
  }
}
