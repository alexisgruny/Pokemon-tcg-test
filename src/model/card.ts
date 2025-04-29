import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';
import Set from './set'; 

class Card extends Model {
   public id!: string;
   public name!: string;
   public image!: string;
   public type!: string;
   public category!: string;
   public rarity!: string;
   public setId!: string;
   public setName!: string;
   public setLogo!: string;
   public illustrator!: string;

   // Association avec le modèle Set
 public static associate() {
        Card.belongsTo(Set, { foreignKey: 'setId', as: 'set' });
    }
}

Card.init(
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
        image: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rarity: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        setId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        setName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        setLogo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        illustrator: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'cards',
        timestamps: false, // Désactive les colonnes createdAt et updatedAt si non nécessaires
    }
);

export default Card;