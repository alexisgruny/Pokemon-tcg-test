import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';

interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password?: string | null;
  friendCode: string | null;
  inGameName: string | null;
  googleId?: string;
  provider?: 'google' | 'local';
  emailVerified?: boolean;
  verificationToken?: string | null;
  verificationTokenExpiry?: Date | null;
  resetPasswordToken?: string | null;
  resetPasswordTokenExpiry?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public username!: string;
    public email!: string;
    public password!: string | null;
    public friendCode!: string;
    public inGameName!: string;
    public googleId?: string;
    public provider?: 'google' | 'local';
    public emailVerified!: boolean;
    public verificationToken!: string | null;
    public verificationTokenExpiry!: Date | null;
    public resetPasswordToken!: string | null;
    public resetPasswordTokenExpiry!: Date | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                is: /^[a-zA-Z0-9_]+$/,
                len: [3, 20],
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true, // Allow null for Google OAuth users
            validate: {
                len: [8, 100],
            },
        },
        friendCode: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                is: /^\d{4}-\d{4}-\d{4}$/,
            },
        },
        inGameName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [3, 20],
            },
        },
        googleId: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        provider: {
            type: DataTypes.ENUM('google', 'local'),
            allowNull: true,
            defaultValue: 'local',
        },
        emailVerified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        verificationToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        verificationTokenExpiry: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        resetPasswordToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        resetPasswordTokenExpiry: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'users',
        timestamps: true,
    }
);

export default User;