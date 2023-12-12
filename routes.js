// routes.js
import { Router } from 'express';
import { livroCreate, livroDelete, livroIndex, livroUpdate, livroOrdemAno, livroFiltroModeloAutor, livroFiltroTema, livroGruposAutor, livroTotais } from "./controllers/livroController.js";
import { usuarioCreate, usuarioIndex, usuarioTrocaSenha, loginUsuario } from "./controllers/usuarioController.js";
import { verificaToken } from "./middlewares/verificaToken.js";
import { getLogs } from './controllers/logController.js'; // Adicionado import
import { usuarioAlterarSenha } from "./controllers/usuarioController.js";

const router = Router();

router.get("/livros", verificaToken, livroIndex)
  .post("/livros", livroCreate)
  .put("/livros/:id", livroUpdate)
  .delete("/livros/:id", verificaToken, livroDelete)
  .get("/livros/ordem_ano", livroOrdemAno)
  .get("/livros/filtro_modelo_marca/:palavra", livroFiltroModeloAutor)
  .get("/livros/filtro_preco/:preco1-:preco2", livroFiltroTema)
  .get("/livros/grupos_autor", livroGruposAutor)
  .get("/livros/totais", livroTotais);

router.get("/usuarios", usuarioIndex)
  .post("/usuarios", usuarioCreate)
  .patch("/usuarios/trocasenha", verificaToken, usuarioTrocaSenha)
  .post("/login", loginUsuario);

router.get("/logs", verificaToken, getLogs); // Adicionado rota para logs

router.patch("/usuarios/alterarsenha", verificaToken, usuarioAlterarSenha);

export default router;
