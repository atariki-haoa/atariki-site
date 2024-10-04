import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const healthUrl = process.env.LLM_API_HEALTH;
      if (!healthUrl) {
        return res.status(500).json({ error: 'Url de salud no está configurado.' });
      }

      // Realizar una solicitud GET a la URL de salud del servicio de chat
      const response = await axios.get(healthUrl);

      if (response.status === 200) {
        res.status(200).json({ status: 'ok', message: 'API de chat y servicio externo están funcionando correctamente' });
      } else {
        res.status(404).json({ status: 'error', message: 'El servicio está detenido' });
      }
    } catch (error) {
      console.error('Error al verificar el servicio externo:', error);
      res.status(500).json({ error: 'Error al verificar el servicio externo' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido.' });
  }
}
