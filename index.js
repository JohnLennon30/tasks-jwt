const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const path = require('path');
const db = require('./db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');
app.use(expressLayouts);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Sincronizar banco de dados
db.sync();

// Middleware para verificar autenticação em todas as páginas
app.use((req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded;
    } catch (err) {
      res.clearCookie('token');
    }
  }
  next();
});

// Rota principal
app.get('/', (req, res) => {
  if (req.user) {
    res.redirect('/tasks');
  } else {
    res.redirect('/login');
  }
});

// Rotas da aplicação
app.use('/', require('./routes/userRoutes'));
app.use('/tasks', require('./routes/taskRoutes'));

// Tratamento de erros 404
app.use((req, res) => {
  res.status(404).render('error', { 
    message: 'Página não encontrada',
    user: req.user 
  });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
