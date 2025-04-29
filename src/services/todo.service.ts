import { NotFoundError } from '../utils/apiResponse';

import Todo from '../models/todo.models';

class TodoService {
  async getUserTodos(userId: number) {
    return Todo.findAll({ where: { userId } });
  }

  async createTodo(userId: number, title: string, description?: string) {
    return Todo.create({ userId, title, description });
  }

  async getTodoById(userId: number, todoId: number) {
    const todo = await Todo.findOne({ where: { id: todoId, userId } });
    if (!todo) throw new NotFoundError('Todo not found');
    return todo;
  }

  async updateTodo(userId: number, todoId: number, updateData: any) {
    const todo = await this.getTodoById(userId, todoId);
    return todo.update(updateData);
  }

  async deleteTodo(userId: number, todoId: number) {
    const todo = await this.getTodoById(userId, todoId);
    await todo.destroy();
    return { message: 'Todo deleted successfully' };
  }
}

export default TodoService;
