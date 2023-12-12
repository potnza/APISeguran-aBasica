// livroController.js
import { Op } from "sequelize";
import { Livro } from "../models/Livro.js";
import { Log } from "../models/Log.js";

export async function livroIndex(req, res) {
  try {
    const livros = await Livro.findAll();
    res.status(200).json(livros);
  } catch (error) {
    res.status(400).send(error);
  }
}

export async function livroCreate(req, res) {
  const { nome, autor, tema, dataLancamento, valor } = req.body;

  if (!nome || !autor || !tema || !dataLancamento || !valor) {
    res.status(400).json("Erro... Informe nome, autor, tema, dataLancamento e valor");
    return;
  }

  try {
    const livro = await Livro.create({
      nome, autor, tema, dataLancamento, valor
    });
    res.status(201).json(livro);
  } catch (error) {
    res.status(400).send(error);
  }
}

export async function livroUpdate(req, res) {
  const { id } = req.params;
  const { nome, autor, tema, dataLancamento, valor } = req.body;

  if (!nome || !autor || !tema || !dataLancamento || !valor) {
    res.status(400).json("Erro... Informe nome, autor, tema, dataLancamento e valor");
    return;
  }

  try {
    const livro = await Livro.update({
      nome, autor, tema, dataLancamento, valor
    },
      {
        where: { id }
      });
    res.status(200).json(livro);
  } catch (error) {
    res.status(400).send(error);
  }
}

export async function livroDelete(req, res) {
  const { id } = req.params;

  try {
    await Livro.destroy({
      where: { id }
    });

    await Log.create({
      descricao: `Exclusão do Livro Id: ${id}`,
      complemento: `Usuário: ${req.usuario_logado_id} - ${req.usuario_logado_nome}`
    });

    res.status(200).json({ msg: "Ok! Livro removido com sucesso" });
  } catch (error) {
    res.status(400).send(error);
  }
}

export async function livroOrdemAno(req, res) {
  try {
    const livros = await Livro.findAll({
      order: [['dataLancamento', 'ASC']]
    });
    res.status(200).json(livros);
  } catch (error) {
    res.status(400).send(error);
  }
}

export async function livroFiltroModeloAutor(req, res) {
  const { palavra } = req.params;

  try {
    const livros = await Livro.findAll({
      where: {
        [Op.or]: [
          { nome: { [Op.like]: `%${palavra}%` } },
          { autor: { [Op.like]: `%${palavra}%` } }
        ]
      }
    });
    res.status(200).json(livros);
  } catch (error) {
    res.status(400).send(error);
  }
}

export async function livroFiltroTema(req, res) {
  const { preco1, preco2 } = req.params;

  try {
    const livros = await Livro.findAll({
      where: {
        valor: {
          [Op.between]: [preco1, preco2]
        }
      }
    });
    res.status(200).json(livros);
  } catch (error) {
    res.status(400).send(error);
  }
}

export async function livroGruposAutor(req, res) {
  try {
    const autores = await Livro.findAll({
      attributes: ['autor'],
      group: ['autor']
    });
    res.status(200).json(autores);
  } catch (error) {
    res.status(400).send(error);
  }
}

export async function livroTotais(req, res) {
  try {
    const totalLivros = await Livro.count();
    res.status(200).json({ totalLivros });
  } catch (error) {
    res.status(400).send(error);
  }
}
