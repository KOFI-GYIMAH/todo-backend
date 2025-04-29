import sequelize from '../config/db.config';
import Todo from './todo.models';
import User from './user.models';

User.hasMany(Todo);
Todo.belongsTo(User);

export { sequelize, Todo, User };
