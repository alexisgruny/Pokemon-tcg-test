import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class OwnedCard extends Model {
    public userId!: number;
    public cardId!: string;
    public quantity!: number;
    public forTrade!: boolean;
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
        forTrade: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        tableName: 'owned_cards',
        timestamps: true, 
    }
);

export default OwnedCard;