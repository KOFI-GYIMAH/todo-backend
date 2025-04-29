import { DataTypes, Model } from 'sequelize';

import sequelize from '../config/db.config';
import User from './user.models';

class Todo extends Model {
  public id!: number;
  public userId!: number;
  public title!: string;
  public description!: string | null;
  public isCompleted!: boolean;
  public dueDate!: Date | null;
  public priority!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Todo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: User,
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_completed',
    },
    dueDate: {
      type: DataTypes.DATE,
      field: 'due_date',
    },
    priority: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    tableName: 'todos',
    timestamps: true,
  }
);

User.hasMany(Todo, { foreignKey: 'userId' });
Todo.belongsTo(User, { foreignKey: 'userId' });

export default Todo;
