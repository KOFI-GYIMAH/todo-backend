import { Router } from 'express';
import {
  validateLogin,
  validateRegister,
} from '../../validators/auth.validator';
import {
  validateTodoCreate,
  validateTodoUpdate,
} from '../../validators/todo.validator';

import AuthController from '../../controllers/v1/auth.controller';
import TodoController from '../../controllers/v1/todo.controller';
import auth from '../../middlewares/auth';

const router = Router();
const authController = new AuthController();
const todoController = new TodoController();

// * Auth routes
router.post('/auth/register', validateRegister, authController.register);
router.post('/auth/login', validateLogin, authController.login);
router.post('/auth/refresh', authController.refreshToken);
router.post('/auth/logout', authController.logout);

// * Todo routes
router.get('/todos', auth, todoController.getTodos);
router.post('/todos', auth, validateTodoCreate, todoController.createTodo);
router.get('/todos/:id', auth, todoController.getTodo);
router.put('/todos/:id', auth, validateTodoUpdate, todoController.updateTodo);
router.delete('/todos/:id', auth, todoController.deleteTodo);

export default router;
