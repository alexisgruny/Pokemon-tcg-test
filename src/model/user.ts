import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';

// Définition des attributs de l'utilisateur
interface UserAttributes {
    id: number;
    username: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Définition des attributs optionnels pour la création
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// Définition du modèle User
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public username!: string;
    public email!: string;
    public password!: string;

    // Champs automatiques
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

// Initialisation du modèle User
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
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize, // Instance Sequelize
        tableName: 'users',
        timestamps: true, // Ajoute createdAt et updatedAt
    }
);

export default User;