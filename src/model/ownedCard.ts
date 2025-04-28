import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class OwnedCard extends Model {
    public userId!: number; 
    public cardId!: string; 
    public quantity!: number; 
}

OwnedCard.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true, 
        },
        cardId: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true, 
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
    },
    {
        sequelize,
        tableName: 'owned_cards',
        timestamps: true, 
    }
);

export default OwnedCard;