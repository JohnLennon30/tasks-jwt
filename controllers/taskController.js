const Task = require('../models/Task');
const User = require('../models/User');

// Listar todas as tarefas do usuário
const list = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { user_id: req.user.id },
      include: User,
      order: [['createdAt', 'DESC']]
    });
    res.render('tasks/index', { tasks, user: req.user });
  } catch (error) {
    res.render('tasks/index', { 
      tasks: [], 
      user: req.user, 
      messages: { error: 'Erro ao buscar tarefas' }
    });
  }
};

// Mostrar formulário de nova tarefa
const newTask = async (req, res) => {
  res.render('tasks/new', { user: req.user });
};

// Criar nova tarefa
const create = async (req, res) => {
  try {
    await Task.create({ 
      ...req.body, 
      user_id: req.user.id 
    });
    res.redirect('/tasks');
  } catch (error) {
    res.render('tasks/new', { 
      user: req.user, 
      messages: { error: 'Erro ao criar tarefa' }
    });
  }
};

// Mostrar formulário de edição
const edit = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { 
        id: req.params.id,
        user_id: req.user.id
      }
    });
    
    if (!task) {
      return res.redirect('/tasks');
    }
    
    res.render('tasks/edit', { task, user: req.user });
  } catch (error) {
    res.redirect('/tasks');
  }
};

// Atualizar tarefa
const update = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { 
        id: req.params.id,
        user_id: req.user.id
      }
    });
    
    if (!task) {
      return res.redirect('/tasks');
    }
    
    await task.update(req.body);
    res.redirect('/tasks');
  } catch (error) {
    res.render('tasks/edit', { 
      task: req.body, 
      user: req.user,
      messages: { error: 'Erro ao atualizar tarefa' }
    });
  }
};

// Completar/descompletar tarefa
const toggleComplete = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { 
        id: req.params.id,
        user_id: req.user.id
      }
    });
    
    if (task) {
      await task.update({ completed: !task.completed });
    }
    
    res.redirect('/tasks');
  } catch (error) {
    res.redirect('/tasks');
  }
};

// Deletar tarefa
const destroy = async (req, res) => {
  try {
    await Task.destroy({
      where: { 
        id: req.params.id,
        user_id: req.user.id
      }
    });
    res.redirect('/tasks');
  } catch (error) {
    res.redirect('/tasks');
  }
};

module.exports = {
  list,
  newTask,
  create,
  edit,
  update,
  toggleComplete,
  destroy
};
