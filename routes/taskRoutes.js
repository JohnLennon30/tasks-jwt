const { Router } = require('express');
const { 
  list, 
  newTask,
  create, 
  edit, 
  update, 
  toggleComplete, 
  destroy 
} = require('../controllers/taskController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Rotas para tarefas
router.get('/', list);
router.get('/new', newTask);
router.post('/', create);
router.get('/edit/:id', edit);
router.post('/:id', update);
router.post('/:id/complete', toggleComplete);
router.post('/:id/delete', destroy);

module.exports = router;
