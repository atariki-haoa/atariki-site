require('dotenv').config();

const express = require('express');
const next = require('next');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Configurar middleware para parsear cookies
  server.use(cookieParser());

  // Configurar middleware CSRF
  const csrfProtection = csurf({
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Asegúrate de que sea true en producción
      sameSite: 'strict', // Ajusta según tus necesidades
    },
  });  server.use(csrfProtection);

  // Ruta para obtener el token CSRF
  server.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
  });

  // Manejar todas las demás rutas con Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
