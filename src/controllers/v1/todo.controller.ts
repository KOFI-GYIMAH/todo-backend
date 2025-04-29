import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { apiResponse } from '../../utils/apiResponse';

import TodoService from '../../services/todo.service';

class TodoController {
  private todoService: TodoService;

  constructor() {
    this.todoService = new TodoService();
  }

  getTodos = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const todos = await this.todoService.getUserTodos(userId);
      return apiResponse(res, 200, 'Todos retrieved successfully', todos);
    } catch (err: any) {
      return apiResponse(res, err.statusCode || 500, err.message);
    }
  };

  createTodo = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse(res, 400, errors.array()[0].msg);
      }

      const userId = (req as any).user.id;
      const { title, description } = req.body;
      const todo = await this.todoService.createTodo(
        userId,
        title,
        description
      );
      return apiResponse(res, 201, 'Todo created successfully', todo);
    } catch (err: any) {
      return apiResponse(res, err.statusCode || 500, err.message);
    }
  };

  getTodo = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const todoId = parseInt(req.params.id);
      const todo = await this.todoService.getTodoById(userId, todoId);
      return apiResponse(res, 200, 'Todo retrieved successfully', todo);
    } catch (err: any) {
      return apiResponse(res, err.statusCode || 500, err.message);
    }
  };

  updateTodo = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse(res, 400, errors.array()[0].msg);
      }

      const userId = (req as any).user.id;
      const todoId = parseInt(req.params.id);
      const todo = await this.todoService.updateTodo(userId, todoId, req.body);
      return apiResponse(res, 200, 'Todo updated successfully', todo);
    } catch (err: any) {
      return apiResponse(res, err.statusCode || 500, err.message);
    }
  };

  deleteTodo = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const todoId = parseInt(req.params.id);
      await this.todoService.deleteTodo(userId, todoId);
      return apiResponse(res, 200, 'Todo deleted successfully');
    } catch (err: any) {
      return apiResponse(res, err.statusCode || 500, err.message);
    }
  };
}

export default TodoController;
