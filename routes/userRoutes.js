const { Router } = require('express');
const { 
  showLogin, 
  showRegister, 
  login, 
  register, 
  logout 
} = require('../controllers/userController');

const router = Router();

// Middleware para redirecionar usuários já logados
const redirectIfAuthenticated = (req, res, next) => {
  if (req.cookies.token) {
    return res.redirect('/tasks');
  }
  next();
};

// Rotas públicas
router.get('/login', redirectIfAuthenticated, showLogin);
router.get('/register', redirectIfAuthenticated, showRegister);
router.post('/login', login);
router.post('/register', register);

// Rota protegida
router.get('/logout', logout);

module.exports = router;
