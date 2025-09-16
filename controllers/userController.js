const User = require("../models/User");
const bcrypt = require("bcrypt");
const {generateToken} = require('../middlewares/authMiddleware');

// Mostrar página de login
const showLogin = (req, res) => {
  res.render('login', { messages: {} });
};

// Mostrar página de registro
const showRegister = (req, res) => {
  res.render('register', { messages: {} });
};

// Processar login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      return res.render('login', { 
        messages: { error: 'Usuário não encontrado' }
      });
    }
    
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    
    if (!passwordIsValid) {
      return res.render('login', { 
        messages: { error: 'Senha inválida' }
      });
    }
    
    const token = generateToken(user);
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/tasks');
    
  } catch (error) {
    res.render('login', { 
      messages: { error: 'Erro ao fazer login' }
    });
  }
};

// Processar registro
const register = async(req, res) => {
  try {
    const { name, username, password } = req.body;
    
    // Verificar se usuário já existe
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.render('register', { 
        messages: { error: 'Nome de usuário já está em uso' }
      });
    }
    
    const newPassword = bcrypt.hashSync(password, 10);
    await User.create({
      name,
      username,
      password: newPassword
    });

    res.redirect('/login');
  } catch (error) {
    res.render('register', { 
      messages: { error: 'Erro ao registrar usuário' }
    });
  }
};

// Processar logout
const logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};

module.exports = {
  showLogin,
  showRegister,
  login,
  register,
  logout
};
