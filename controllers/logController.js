// logController.js
import { Log } from '../models/Log.js';

export async function getLogs(req, res) {
  try {
    const logs = await Log.findAll();
    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar os logs.');
  }
}
