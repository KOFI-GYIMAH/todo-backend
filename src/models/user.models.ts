import { DataTypes, Model } from 'sequelize';

import bcrypt from 'bcrypt';
import sequelize from '../config/db.config';

class User extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public isVerified!: boolean;
  public verificationToken!: string | null;
  public resetToken!: string | null;
  public resetTokenExpires!: Date | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public async comparePassword(password: string): Promise<boolean> {
    console.log(password, this.password);
    console.log('Password type:', typeof password);
    console.log('Stored hash type:', typeof this.password);
    return bcrypt.compare(password, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_verified',
    },
    verificationToken: {
      type: DataTypes.STRING(255),
      field: 'verification_token',
    },
    resetToken: {
      type: DataTypes.STRING(255),
      field: 'reset_token',
    },
    resetTokenExpires: {
      type: DataTypes.DATE,
      field: 'reset_token_expires',
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
  }
);

export default User;
