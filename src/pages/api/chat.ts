import { NextApiRequest, NextApiResponse } from 'next';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import { runMiddleware } from '../../utils/middleware';
import axios from 'axios';
import { randomUUID } from 'crypto';

const csrfProtection = csurf({ cookie: true });

// Función para generar ID único por sesión
function createUniqueSessionId(): string {
  return randomUUID();
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cookieParser());
  await runMiddleware(req, res, csrfProtection);

  if (req.method === 'POST') {
    const { message, sessionId } = req.body; // El frontend debe enviar el ID de sesión
    let chatSessionId = sessionId || createUniqueSessionId(); // Genera o usa el ID de sesión existente
    const apiUrl = process.env.LLM_API_URL as string;
    try {
      const response = await axios.post(
        apiUrl,
        { 
          model: 'llama-3.2-3b-instruct',
          messages: [{ role: 'user', content: message }],
          temperature: 0.7,
          max_tokens: -1,
          stream: true,
          session_id: chatSessionId, // Enviar el ID único de la sesión
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.LLM_API_KEY}`,
          },
          responseType: 'stream',
        }
      );

      response.data.pipe(res); // Enviar flujo de datos al cliente
    } catch (error) {
      console.error('Error al comunicarse con la API de LLM:', error);
      res.status(500).json({ error: 'Error al comunicarse con la API de LLM' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido.' });
  }
}

export default handler;
