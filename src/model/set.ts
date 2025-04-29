import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db'; // Remplace par ton instance Sequelize

export default class Set extends Model {
    public id!: string;
    public name!: string;
    public logo!: string;
}

Set.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        logo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Set',
    }
);